from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import cv2
import io
import shutil
from gfpgan import GFPGANer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the generator model
MODEL_PATH = "../models/11440.h5"
#MODEL_PATH = r"C:\Users\anand\Downloads\generator_model_epoch_16 (1).h5"
model = load_model(MODEL_PATH)
print(f"Generator model loaded from: {MODEL_PATH}")

# Load GFPGAN model for enhancement
GFPGAN_PATH = r"D:\Projects\finegrain-image-enhancer\GFPGANv1.4.pth"
restorer = GFPGANer(model_path=GFPGAN_PATH, upscale=2, arch="clean", channel_multiplier=2)
print(f"GFPGAN model loaded from: {GFPGAN_PATH}")

def process_image(image_bytes):
    # Convert bytes to PIL image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((256, 256))
    img_array = np.array(image)
    
    # Normalize to [-1, 1] and run through generator model
    norm_img = (img_array.copy() - 127.5) / 127.5
    g_img = model.predict(np.expand_dims(norm_img, 0))[0]
    
    # Denormalize to [0, 255] and resize
    g_img = (g_img + 1) * 127.5
    g_img = cv2.resize(g_img, (200, 250))

    # Convert grayscale to RGB if needed
    if g_img.shape[-1] == 1:
        g_img = np.squeeze(g_img)
        g_img = cv2.cvtColor(g_img, cv2.COLOR_GRAY2RGB)

    return Image.fromarray(g_img.astype(np.uint8))

@app.post("/translate-image")
async def translate_image(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Generate initial translated image
    translated_image = process_image(image_bytes)
    temp_file = "translated_image.png"
    translated_image.save(temp_file)

    # Load the translated image for enhancement
    input_img = cv2.imread(temp_file)

    # Enhance the image using GFPGAN
    _, _, restored_img = restorer.enhance(input_img, has_aligned=False, only_center_face=False, paste_back=True)

    # Save and return enhanced image
    final_image_path = "enhanced_image.png"
    cv2.imwrite(final_image_path, restored_img)
    
    return FileResponse(final_image_path, media_type="image/png")
