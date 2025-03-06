import { fal } from "@fal-ai/client";

fal.config({
    credentials: "91c43ec2-88ba-47c1-964e-75fda51d1883:98a42ddab73a773f245241d7d02e9807"
  });

  async function convertImageToVideoModel2(image_url) {
    try {
        const result = await fal.subscribe("fal-ai/stable-video", {
            input: {
                image_url: image_url
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    console.log("Still Updating");
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });
        console.log(result.data);
        console.log(result.requestId);
        return result;
    } catch (error) {
        console.error("Failed to subscribe to FAL.ai:", error);
    }
}

export { convertImageToVideoModel2 };