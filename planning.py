from fastapi import HTTPException, Depends
from fastapi.encoders import jsonable_encoder
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
    creatde: int

class ExamUpdate(BaseModel):
    idexamen: int
    idmaterie: Optional[int]
    idprofesor: Optional[int]
    idgrupa: Optional[int]
    data: Optional[date]
    idsala: Optional[int]
    ora: Optional[time]
    status: Optional[int]
    creatde: Optional[int]

# Initializează conexiunea la baza de date
supabase = connect_to_supabase()

# ---------------- CRUD Functions ----------------

# CREATE
from fastapi.encoders import jsonable_encoder

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder

def create_exam_planning(planning: ExamPlanning):
    # Creăm payload-ul și adăugăm creatde și status
    planning_data = jsonable_encoder(planning)
    planning_data['creatde'] = 10  # Setăm creatde la 10
    planning_data['status'] = 1    # Setăm status la 1

    print("Payload trimis către Supabase:", planning_data)  # Debug

    # Inserăm planificarea examenului în baza de date
    response = supabase.table("examen").insert(planning_data).execute()
    
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