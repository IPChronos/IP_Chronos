from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routes import auth  # Importăm rutele pentru autentificare
from fastapi.middleware.cors import CORSMiddleware
from app.routes.exam_routes import router as exam_router

app = FastAPI(
    title="Planificarea Examenelor API",
    description="API pentru gestionarea examenelor, autentificare, și dashboard",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",  # Adresa frontend-ului tău (vite.js)
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)  # Ruta pentru autentificare
app.include_router(exam_router)  # Ruta pentru examene


@app.get("/")
def read_root():
    return {"message": "Bine ai venit la API-ul pentru Planificarea Examenelor!"}
