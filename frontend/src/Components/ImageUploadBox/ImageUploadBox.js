import React, { useState } from "react";
import "./ImageUploadBox.css"; // Import the CSS file

const ImageUploadAndDisplay = () => {
  const [inputImage, setInputImage] = useState(null); // Stores the uploaded image
  const [outputImage, setOutputImage] = useState(null); // Stores the translated image
  const [isConverting, setIsConverting] = useState(false); // Flag to control the conversion process

  // Handle input image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setInputImage(reader.result);
    reader.readAsDataURL(file);
    setOutputImage(null); // Reset the output image when a new file is uploaded
  };

  // Handle image conversion
  const handleConvertImage = () => {
    if (!inputImage) return; // If no input image, do nothing

    setIsConverting(true); // Set the converting flag to true

    const formData = new FormData();
    const imageBlob = dataURLtoBlob(inputImage); // Convert base64 to Blob
    formData.append("file", imageBlob);

    fetch("http://127.0.0.1:8000/translate-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        setOutputImage(objectURL); // Set the translated image
        setIsConverting(false); // Set the converting flag to false after conversion
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsConverting(false); // Reset flag in case of error
      });
  };

  // Handle reset action
  const handleReset = () => {
    setInputImage(null); // Clear the input image
    setOutputImage(null); // Clear the output image
    setIsConverting(false); // Reset the converting flag
  };

  // Helper function to convert base64 data to Blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <div className="image-upload-container">
      <div className="image-box-container">
        {/* Input Image Box */}
        <div className="image-box">
          {inputImage ? (
            <img
              src={inputImage}
              alt="Input"
              className="image-preview"
            />
          ) : (
            <label>
              Drag & Drop or Click to Select
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        {/* Output Image Box */}
        <div className="image-box">
          {outputImage ? (
            <img
              src={outputImage}
              alt="Output"
              className="image-preview"
            />
          ) : (
            <p>Translated image will appear here</p>
          )}
        </div>
      </div>

      <div className="button-container">
        {/* Convert Button */}
        <button
          className="convert-button"
          onClick={handleConvertImage}
          disabled={isConverting || !inputImage} // Disable the button if converting or no input image
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>

        {/* Reset Button */}
        <button
          className="reset-button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImageUploadAndDisplay;
