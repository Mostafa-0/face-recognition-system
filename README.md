# Face Recognition Access Control System

A web-based face recognition system that simulates a secure access control workflow using real-time webcam input, a Next.js frontend, and a Python FastAPI backend powered by a face recognition model.

---

## System Overview

The system is split into three main parts:

### 1. Frontend (Next.js + Tailwind)

* Captures webcam image from the browser
* Sends image to backend API
* Displays authentication result (Granted / Denied)
* Provides a simple access control UI

### 2. Backend (FastAPI - Python)

* Receives base64 image from frontend
* Decodes and processes the image
* Sends frame to AI model
* Returns recognition result

### 3. AI Model (Face Recognition Module)

* Maintains database of authorized users (face embeddings)
* Compares incoming face against stored encodings
* Returns identity and authentication status

---

## Tech Stack

* Frontend: Next.js, Tailwind CSS
* Backend: FastAPI (Python)
* Computer Vision: OpenCV
* Face Recognition: face_recognition

---

## Project Structure

```
project-root/
│
├── frontend/ (Next.js App)
│   ├── app/
│   ├── components/
│   ├── package.json
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── utils.py
│
└── README.md
```

---

## How It Works

### Step 1: User Authentication Flow

1. User opens the web app
2. Activates camera
3. Captures face image via browser
4. Image is sent to backend API

### Step 2: Backend Processing

1. Backend receives base64 image
2. Decodes image into OpenCV format
3. Sends frame to AI model
4. Receives prediction result

### Step 3: AI Decision

* Compares face with stored authorized users
* If match found → returns:

```json
{
  "name": "Ahmed",
  "status": "granted"
}
```

* If no match → returns:

```json
{
  "name": "Unknown",
  "status": "denied"
}
```

### Step 4: Frontend Display

* Shows user name
* Displays access status:

  * GREEN → GRANTED
  * RED → DENIED

---

## Backend API

### POST `/recognize`

**Request**

```json
{
  "image": "base64_encoded_image"
}
```

**Response**

```json
{
  "name": "Ahmed",
  "status": "granted"
}
```

or

```json
{
  "name": "Unknown",
  "status": "denied"
}
```

---

## AI Model Requirements

The AI module must:

* Store face embeddings of authorized users
* Support enrollment (adding new users)
* Compare incoming face with stored dataset
* Return best match or unknown result

### Storage format (example)

* Encodings stored in `.pkl` or `.json`
* Each entry includes:

  * Name
  * Face embedding vector

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install fastapi uvicorn opencv-python numpy
uvicorn main:app --reload --port 8000
```

Backend runs at:

```
http://localhost:8000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## Connection Flow

```
Next.js (camera capture)
        ↓
POST /recognize
        ↓
FastAPI backend
        ↓
AI model (face matching)
        ↓
Response JSON
        ↓
UI update (Granted / Denied)
```

---

## Important Notes

* Backend must be running before frontend testing
* CORS must be enabled in FastAPI
* Image is sent as base64 string
* No real-time streaming is used (single capture per request)
