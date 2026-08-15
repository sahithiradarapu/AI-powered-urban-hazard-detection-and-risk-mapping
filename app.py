from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Folders
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Try both possible project structures
model_paths = [
    os.path.join(BASE_DIR, "model", "best.pt"),
    os.path.join(BASE_DIR, "..", "model", "best.pt")
]

MODEL_PATH = next((path for path in model_paths if os.path.exists(path)), None)

if MODEL_PATH is None:
    raise FileNotFoundError("best.pt not found inside the model folder")

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -----------------------------
# Load trained YOLO model
# -----------------------------
print("Loading YOLO model...")
model = YOLO(MODEL_PATH)
print("YOLO model loaded successfully!")
print("Model:", MODEL_PATH)


@app.route("/")
def home():
    return "AI Urban Risk Intelligence System is running!"


@app.route("/detect", methods=["POST"])
def detect():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "error": "No image selected"
        }), 400

    # Make filename safe
    filename = secure_filename(image.filename)

    # Save uploaded image
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    print("Image saved at:", image_path)

    # -----------------------------
    # YOLO DETECTION
    # -----------------------------
    results = model.predict(
        source=image_path,
        conf=0.25,
        verbose=False
    )

    detections = []

    for result in results:

        boxes = result.boxes

        for box in boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "class": model.names[class_id],
                "confidence": round(confidence, 3),
                "box": {
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2)
                }
            })

    print("Detections:", detections)

    return jsonify({
        "message": "Image detected successfully",
        "filename": filename,
        "detections": detections,
        "count": len(detections)
    })


if __name__ == "__main__":
    app.run(debug=True)