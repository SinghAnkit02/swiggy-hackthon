#!/usr/bin/env node

import {
    BedrockRuntimeClient,
    StartAsyncInvokeCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import winston from 'winston';
import { monitorAndDownloadVideo, saveInvocationInfo, imageToBase64 } from './amazonVideoUtil.js';

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Constants
const DEFAULT_MODEL_ID = "amazon.nova-reel-v1";

// Initialize AWS clients
let bedrockRuntime;
let s3Client;

function setupAwsSession() {
}


/**
 * Generates a video from an image using the specified prompt and model.
 * @param {string} s3DestinationBucket - The S3 bucket to store the generated video.
 * @param {string} videoPrompt - The prompt for video generation.
 * @param {string} inputImageBase64 - The base64 encoded image to use as input.
 * @param {string} [modelId=DEFAULT_MODEL_ID] - The model ID to use for video generation.
 * @returns {Promise<string|null>} - The ARN of the invocation if successful, otherwise null.
 */
async function generateVideoFromImage(s3DestinationBucket, videoPrompt, inputImageBase64, modelId = DEFAULT_MODEL_ID) {
    try {
        // Create the S3 bucket

        try {
            // Check if the bucket already exists and you own it
            await s3Client.send(new HeadBucketCommand({
                Bucket: s3DestinationBucket
            }));
            logger.info(`Bucket "${s3DestinationBucket}" already exists and is owned by you.`);
        } catch (error) {
            if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
                // The bucket does not exist or you don't own it, create it
                await s3Client.send(new CreateBucketCommand({
                    Bucket: s3DestinationBucket
                }));
                logger.info(`Bucket "${s3DestinationBucket}" created.`);
            } else {
                // Rethrow the error if it's other than not found
                throw error;
            }
        }

        const modelInput = {
            taskType: "TEXT_VIDEO",
            textToVideoParams: {
                text: videoPrompt,
                images: [
                    {
                        format: "png",
                        source: {
                            bytes: inputImageBase64
                        }
                    }
                ]
            },
            videoGenerationConfig: {
                durationSeconds: 6,
                fps: 24,
                dimension: "1280x720",
                seed: Math.floor(Math.random() * 2147483648),
            },
        };

        console.log(modelInput)

        const command = new StartAsyncInvokeCommand({
            modelId: modelId,
            contentType: "application/json",
            accept: "application/json",
            modelInput: modelInput,
            outputDataConfig: {
                s3OutputDataConfig: {
                    s3Uri: `s3://${s3DestinationBucket}`
                }
            }
        });

        const invocation = await bedrockRuntime.send(command);
        const invocationArn = invocation.invocationArn;

        logger.info("\nResponse:");
        logger.info(JSON.stringify(invocation, null, 2));

        await saveInvocationInfo(bedrockRuntime, s3Client, invocation, modelInput);

        return invocationArn;

    } catch (error) {
        logger.error(error);
        return null;
    }
}

const convertImageToVideo = async (image_path) => {
    // Initialize the AWS session
    setupAwsSession();

    // Configuration
    const S3_BUCKET = "image-to-txt-hackathon"; // Change this to your unique bucket name
    const VIDEO_PROMPT = "Make the image realistic.";
    const MODEL_ID = "amazon.nova-reel-v1:0";

    const inputImageBase64 = await imageToBase64(image_path);

    // Generate video
    const invocationArn = await generateVideoFromImage(S3_BUCKET, VIDEO_PROMPT, inputImageBase64, MODEL_ID);
    if (!invocationArn) {
        logger.error("Failed to start video generation");
        process.exit(1);
    }

    // Monitor and download the video
    logger.info("\nMonitoring job and waiting for completion...");
    const localFilePath = await monitorAndDownloadVideo(invocationArn, "output");

    if (localFilePath) {
        logger.info(`\nVideo successfully generated and downloaded to: ${localFilePath}`);
    } else {
        logger.info("\nFailed to generate or download video");
    }
    return localFilePath;
}

export { convertImageToVideo };