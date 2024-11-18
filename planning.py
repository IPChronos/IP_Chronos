from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time
from supabase_connect import connect_to_supabase

class ExamPlanning(BaseModel):
    idmaterie: int
    idprofesor: int
    idgrupa: int
    data: date
    idsala: int
    ora: time
    status: int
    createde: int

class ExamUpdate(BaseModel):
    idexamen: int
    idmaterie: Optional[int]
    idprofesor: Optional[int]
    idgrupa: Optional[int]
    data: Optional[date]
    idsala: Optional[int]
    ora: Optional[time]
    status: Optional[int]
    createde: Optional[int]

# Initializează conexiunea la baza de date
supabase = connect_to_supabase()

# ---------------- CRUD Functions ----------------

# CREATE
def create_exam_planning(planning: ExamPlanning):
    response = supabase.table("examen").insert(planning.dict()).execute()
    if response.data:
        return {"message": "Planificare adăugată cu succes!", "examen": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la adăugarea planificării examenului.")

# READ
def get_all_exam_plannings():
    response = supabase.table("examen").select("*").execute()
    if response.data:
        return response.data
    else:
        raise HTTPException(status_code=404, detail="Nu s-au găsit planificări.")

def get_exam_planning_by_id(idexamen: int):
    response = supabase.table("examen").select("*").eq("idexamen", idexamen).execute()
    if response.data:
        return response.data[0]
    else:
        raise HTTPException(status_code=404, detail=f"Planificarea cu ID-ul {idexamen} nu a fost găsită.")

# UPDATE
def update_exam_planning(update_data: ExamUpdate):
    idexamen = update_data.idexamen
    update_dict = {key: value for key, value in update_data.dict().items() if value is not None and key != "idexamen"}

    if not update_dict:
        raise HTTPException(status_code=400, detail="Nicio actualizare specificată.")

    response = supabase.table("examen").update(update_dict).eq("idexamen", idexamen).execute()
    if response.data:
        return {"message": "Planificare actualizată cu succes!", "examen": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la actualizarea planificării examenului.")

# DELETE
def delete_exam_planning(idexamen: int):
    response = supabase.table("examen").delete().eq("idexamen", idexamen).execute()
    if response.data:
        return {"message": "Planificare ștearsă cu succes!"}
    else:
        raise HTTPException(status_code=404, detail=f"Planificarea cu ID-ul {idexamen} nu a fost găsită.")
