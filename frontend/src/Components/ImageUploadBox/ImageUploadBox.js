import React, { useState } from "react";
import "./ImageUploadBox.css"; // Import the CSS file

const ImageUploadAndDisplay = () => {
  const [inputImage, setInputImage] = useState(null); // Stores the uploaded image
  const [outputImage, setOutputImage] = useState(null); // Stores the translated image
  const [isConverting, setIsConverting] = useState(false); // Flag to control the conversion process

  // Handle drag and drop upload
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior (open file)
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    handleImageUpload({ target: { files: [file] } });
  };

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
      <div className="image-box-wrapper">
        {/* Title and Image Upload Box */}
        <div className="image-box-container">
          <div>
            <div className="box-title">Input Sketch</div>
            <div
              className="image-box"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="inner-box">
                {inputImage ? (
                  <img src={inputImage} alt="Input" className="image-preview" />
                ) : (
                  <label>
                    <span className="inner-box-text">Drag & Drop or Click to Select</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Title and Generated Image Box */}
          <div>
            <div className="box-title">Generated Image</div>
            <div className="image-box">
              <div className="inner-box">
                {outputImage ? (
                  <img src={outputImage} alt="Generated" className="image-preview" />
                ) : (
                  <p><span className="inner-box-text">No image generated yet</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Convert and Reset buttons */}
      <div className="button-container">
        <button
          className="convert-button"
          onClick={handleConvertImage}
          disabled={isConverting || !inputImage}
        ><span>
          {isConverting ? "Generating.." : "Generate"}</span>
        </button>
        <button className="reset-button" onClick={handleReset}>
          <span className="text">Clear All</span>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
        </button>
      </div>
      
    </div>
  );
};
export default ImageUploadAndDisplay;
