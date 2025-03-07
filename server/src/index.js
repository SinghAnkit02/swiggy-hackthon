import { convertImageToVideo } from "./genAI/ImageToVideoConverter.js";

const loadImageFromLocalStorage = () => {
  const savedImages = JSON.parse(localStorage.getItem('savedImages')) || []
  if (savedImages.length > 0) {
    return savedImages[savedImages.length - 1] // Get the last saved image
  }
  return null
}

const imageBase64 = loadImageFromLocalStorage()

if (imageBase64) {
  convertImageToVideo(imageBase64, "passed") // Pass Base64 image directly to the function
} else {
  console.error("No image found in local storage")
}
