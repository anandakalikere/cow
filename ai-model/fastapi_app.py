import io
import json
from typing import List, Optional

# import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import requests
# import tensorflow as tf

# BREED_MODEL_PATH = "cow_breed_model.h5"
# HEALTH_MODEL_PATH = "cow_health_model.h5"
BREED_CLASSES = ["Gir", "Jersey", "Sahiwal", "Holstein Friesian", "Red Sindhi", "Ongole"]
HEALTH_CLASSES = ["Healthy", "Wound", "Skin Disease", "Underweight"]

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# breed_model = tf.keras.models.load_model(BREED_MODEL_PATH)
# health_model = tf.keras.models.load_model(HEALTH_MODEL_PATH)


def preprocess_image(img):
  # Dummy preprocessing
  return img


def predict_generic(model, classes: List[str], img):
  # Dummy prediction for demo
  import random
  label = random.choice(classes)
  conf = random.uniform(0.5, 0.9)
  return label, conf


@app.post("/predict-breed")
async def predict_breed(file: UploadFile = File(...)):
  content = await file.read()
  # img = Image.open(io.BytesIO(content))
  label, conf = predict_generic(None, BREED_CLASSES, None)
  return {"breed": label, "confidence": conf}


@app.post("/predict-health")
async def predict_health(file: UploadFile = File(...)):
  content = await file.read()
  # img = Image.open(io.BytesIO(content))
  label, conf = predict_generic(None, HEALTH_CLASSES, None)
  return {"health_status": label, "confidence": conf}


@app.post("/predict-breed-url")
async def predict_breed_url(payload: dict):
  url = payload.get("image_url")
  resp = requests.get(url)
  img = Image.open(io.BytesIO(resp.content))
  label, conf = predict_generic(breed_model, BREED_CLASSES, img)
  return {"breed": label, "confidence": conf}


@app.post("/predict-health-url")
async def predict_health_url(payload: dict):
  url = payload.get("image_url")
  resp = requests.get(url)
  img = Image.open(io.BytesIO(resp.content))
  label, conf = predict_generic(health_model, HEALTH_CLASSES, img)
  return {"health_status": label, "confidence": conf}


if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="0.0.0.0", port=8000)

