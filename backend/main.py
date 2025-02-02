from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
import tensorflow as tf
import numpy as np
import io
import os
from fastapi.middleware.cors import CORSMiddleware # For linking frontend and backend port
import cv2
from tensorflow.keras.models import load_model


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend domain
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Load the model 
MODEL_PATH = "../models/g_model_epoch_000354.h5"

# Load the pre-trained model with custom objects
model = load_model(MODEL_PATH)
print(f"Model loaded from: {MODEL_PATH}")

# Function to process the uploaded image
def process_image(image_bytes):
    # Open image and resize to model input size (256x256)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((256, 256))  # Model's input size is 256x256
    img_array = np.array(image)
    
    # Normalize image 
    norm_img = (img_array.copy() - 127.5) / 127.5  # Normalize to [-1, 1]

    # Expand dims and predict using the model
    g_img = model.predict(np.expand_dims(norm_img, 0))[0]
    g_img = (g_img + 1) * 127.5  # Denormalize to [0, 255]
    
    # Resize generated image for display 
    g_img = cv2.resize(g_img, (200, 250))
    
    # Convert grayscale to RGB if necessary (for visualization)
    if g_img.shape[-1] == 1:
        g_img = np.squeeze(g_img)  # Remove single-dimensional entry
        g_img = cv2.cvtColor(g_img, cv2.COLOR_GRAY2RGB)  # Convert grayscale to RGB
    
    # Convert to PIL image for further processing or saving
    generated_image = Image.fromarray(g_img.astype(np.uint8))
    return generated_image

@app.post("/translate-image")
async def translate_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    translated_image = process_image(image_bytes)

    # Save the translated image to a temporary file
    temp_file = "translated_image.png"
    translated_image.save(temp_file)
    return FileResponse(temp_file, media_type="image/png")
