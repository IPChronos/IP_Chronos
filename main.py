from fastapi import FastAPI
from auth import login_user, LoginRequest
from exam import adauga_examen, Examen
from fastapi.middleware.cors import CORSMiddleware
from planning import (
    create_exam_planning,
    get_all_exam_plannings,
    get_exam_planning_by_id,
    update_exam_planning,
    delete_exam_planning,
    ExamPlanning,
    ExamUpdate,
)

# Initializează FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adresele frontend-ului care au permisiunea de a accesa backend-ul
    allow_credentials=True,  # Permite trimiterea cookie-urilor sau a altor credențiale
    allow_methods=["*"],  # Permite toate metodele HTTP (GET, POST, PUT, DELETE etc.)
    allow_headers=["*"],  # Permite toate tipurile de header-uri
)

#LOGIN
@app.post("/login")
async def login(request: LoginRequest):
    """
    Endpoint pentru autentificarea utilizatorilor.
    """
    return login_user(request)



# ADD EXAMENE
@app.post("/adauga_examen")
async def adauga_examen_endpoint(examen: Examen):
    """
    Endpoint pentru a adăuga un examen nou.
    """
    return adauga_examen(examen)

# CREATE
@app.post("/planning")
async def add_planning(planning: ExamPlanning):
    return create_exam_planning(planning)

# READ
@app.get("/planning")
async def list_all_plannings():
    return get_all_exam_plannings()

@app.get("/planning/{idexamen}")
async def get_planning(idexamen: int):
    return get_exam_planning_by_id(idexamen)

# UPDATE
@app.put("/planning")
async def update_planning(update_data: ExamUpdate):
    return update_exam_planning(update_data)

# DELETE
@app.delete("/planning/{idexamen}")
async def delete_planning(idexamen: int):
    return delete_exam_planning(idexamen)

@app.get("/")
def home():
    """
    Endpoint principal pentru verificarea funcționalității.
    """
    return {"message": "API-ul este funcțional!"}
