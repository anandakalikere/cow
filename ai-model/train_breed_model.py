import os

import numpy as np
import opendatasets as od
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

DATASET_URL = "https://www.kaggle.com/datasets/your-cow-breed-dataset"  # TODO: replace
OUTPUT_MODEL = "cow_breed_model.h5"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10


def download_dataset():
  target_dir = "data/breeds"
  if not os.path.exists(target_dir):
    os.makedirs("data", exist_ok=True)
    print("Downloading cow breed dataset from Kaggle...")
    od.download(DATASET_URL, data_dir="data")
    print("Downloaded. Please adjust `train_breed_model.py` to point to the extracted folder if needed.")
  return target_dir


def build_model(num_classes: int) -> Model:
  base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
  base_model.trainable = False

  x = base_model.output
  x = GlobalAveragePooling2D()(x)
  x = Dropout(0.3)(x)
  predictions = Dense(num_classes, activation="softmax")(x)

  model = Model(inputs=base_model.input, outputs=predictions)
  model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"],
  )
  return model


def main():
  data_root = download_dataset()

  datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=20,
    zoom_range=0.15,
    horizontal_flip=True,
    validation_split=0.2,
  )

  train_gen = datagen.flow_from_directory(
    data_root,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
  )
  val_gen = datagen.flow_from_directory(
    data_root,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
  )

  class_indices = train_gen.class_indices
  print("Classes:", class_indices)
  np.save("breed_class_indices.npy", class_indices)

  model = build_model(num_classes=len(class_indices))

  model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
  )

  model.save(OUTPUT_MODEL)
  print(f"Saved breed model to {OUTPUT_MODEL}")


if __name__ == "__main__":
  main()

