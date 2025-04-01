# Face Reconstruction from Sketches
![file_2025-03-01_13 29 05](https://github.com/user-attachments/assets/4d3fa082-81fd-4c79-922d-061de9f86588)

## Overview
This project focuses on reconstructing realistic human face images from sketches using deep learning techniques. A Conditional GAN (Pix2Pix) model is trained on paired sketch-to-real face images to achieve high-quality reconstructions. Additionally, the **GFPGAN** model is used to enhance the quality of the generated images, refining details and improving realism.

## Dataset
- **Name:** CUSF Dataset
- **Structure:** The dataset consists of 188 paired images of human face sketches and their corresponding real images.
- **Folders:**
  - `train` 88 images
  - `test` 100 images

## Model Architecture
The model is based on the Pix2Pix framework with a generator-discriminator architecture:
- **Generator:** U-Net-based architecture for image-to-image translation.
- **Discriminator:** PatchGAN for distinguishing real and generated images.
- **Loss Functions:** Adversarial loss + L1 loss for generating photorealistic outputs.
- **Post-Processing:** GFPGAN is applied to enhance the generated images, improving sharpness and facial details.

## Training Details
- **Epochs:** 11
- **Batch Size:** 16
- **Optimizer:** Adam (learning rate = 0.0002, beta1 = 0.5)

## Evaluation
- The model is evaluated using test sketches and compared with ground-truth real images.
- **Metrics:**
  - **SSIM:** 0.8623912301261317
  - **PSNR:** 30.930116121278516
  - **MSE:** 52.92612859090169
  - **L2 Norm:** 57893.46135113549
- The generator loss fluctuates but improves progressively without overfitting.

## Results
- The model successfully generates realistic face images from sketches.
- GFPGAN further enhances the generated images by improving clarity and fine details.
- Performance improves with more training data and better preprocessing techniques.

## Clone the repository:
   ```bash
   git clone https://github.com/anandjohnbaby/Face-Reconstruction-from-sketches.git
   ```

