from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils import decode_base64_image
from model import recognize_face

app = FastAPI()

# allow frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image: str

@app.post("/recognize")
def recognize(data: ImageRequest):
    try:
        frame = decode_base64_image(data.image)

        name, status = recognize_face(frame)

        return {
            "name": name,
            "status": status
        }

    except Exception:
        return {
            "name": "error",
            "status": "denied"
        }