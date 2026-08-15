# 🚧 AI Urban Risk Intelligence

### AI-Powered Urban Hazard Detection and Risk Mapping

AI Urban Risk Intelligence is a computer vision-based system designed to automatically detect and classify urban road hazards from images using Artificial Intelligence.

The system uses a custom-trained YOLOv8 object detection model to identify hazards such as potholes, drain holes, and sewer covers. It provides detection results along with confidence scores and risk levels through a web-based interface.

---

## 🎯 Problem Statement

Road hazards such as potholes, open drain holes, and damaged or misplaced sewer covers can create serious risks for:

- 🚗 Vehicle drivers
- 🏍️ Two-wheeler riders
- 🚶 Pedestrians
- 🚑 Emergency vehicles
- 🏙️ Urban infrastructure

Manual identification and reporting of these hazards is time-consuming and difficult to scale.

AI Urban Risk Intelligence aims to automate this process using computer vision.

---

## 💡 Our Solution

The system allows a user to upload a road image.

The AI model then:

1. 📷 Receives the road image
2. 🤖 Analyzes the image using YOLOv8
3. 🔍 Detects urban hazards
4. 🏷️ Classifies the detected hazard
5. 📊 Calculates the confidence score
6. ⚠️ Assigns a risk level
7. 📋 Displays the results on the web interface

---

## 🧠 Hazards Detected

The current AI model detects three types of urban hazards:

| Hazard | Risk Level |
|---|---|
| 🚧 Pothole | High |
| 🕳️ Drain Hole | Medium |
| 🚧 Sewer Cover | Low |

---

## 🏗️ System Architecture

```text
              📷 Road Image
                    │
                    ▼
             🌐 Web Interface
                    │
                    ▼
              🔥 Flask Backend
                    │
                    ▼
            🤖 YOLOv8 Model
                    │
                    ▼
          🔍 Hazard Detection
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Pothole  Drain Hole  Sewer Cover
          │         │         │
          └─────────┼─────────┘
                    ▼
          📊 Risk & Confidence
                    │
                    ▼
             🌐 User Dashboard

🛠️ Technologies Used
Artificial Intelligence
YOLOv8
Computer Vision
Object Detection
Custom-trained dataset
Backend
Python
Flask
Flask-CORS
Ultralytics
Frontend
HTML
CSS
JavaScript
Dataset & Training
Roboflow
YOLOv8 format
Google Colab
NVIDIA Tesla T4 GPU
Development Tools
Visual Studio Code
Git
GitHub
📊 AI Model

The project uses a custom-trained YOLOv8 Nano (YOLOv8n) object detection model.

Training Configuration
Model: YOLOv8n
Epochs: 20
Image Size: 640 × 640
GPU: NVIDIA Tesla T4
Classes: 3
Model Performance

The trained model achieved approximately:

Precision: 91%
Recall: 83%
mAP@50: 91%

These values may vary depending on the dataset split and testing images.

📂 Project Structure
AI-Urban-Risk-Intelligence/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model/
│   └── best.pt
│
├── uploads/
│
├── datasets/
│
└── README.md
⚙️ How It Works
1. Upload Image

The user uploads a road image through the web interface.

2. Backend Processing

The Flask backend receives the image and stores it temporarily.

3. AI Detection

The YOLOv8 model analyzes the image and identifies objects belonging to the trained hazard classes.

4. Confidence Score

For every detected hazard, the model provides a confidence score indicating how confident the model is about the prediction.

5. Risk Classification

The system assigns a risk category based on the detected hazard.

6. Result Display

The detected hazards and their confidence scores are displayed on the dashboard.

🚀 Future Scope

The current system works with uploaded images. Future versions can expand it into a complete real-time urban monitoring platform.

Planned improvements include:

📍 GPS-based hazard mapping
🗺️ Interactive urban risk map
📱 Mobile application
🎥 Real-time video detection
🚨 Automatic emergency alerts
📊 Historical hazard analytics
🔄 Real-time hazard updates
🏙️ Urban risk heatmaps
☁️ Cloud deployment
🤖 Continuous model improvement
🌍 Real-World Impact

AI Urban Risk Intelligence can help create safer urban environments by making road hazard detection faster, scalable, and data-driven.

Potential applications include:

Smart city infrastructure monitoring
Road safety systems
Fleet safety
Navigation applications
Urban infrastructure analysis
Road maintenance planning
