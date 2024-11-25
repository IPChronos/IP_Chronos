from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase_connect import connect_to_supabase

# Model pentru adăugare student
class StudentCreate(BaseModel):
    numestudent: str
    emailstudent: str
    grupa: int
    iduser: int

# Model pentru actualizare student
class StudentUpdate(BaseModel):
    idstudent: int
    numestudent: Optional[str]
    emailstudent: Optional[str]
    grupa: Optional[int]
    iduser: Optional[int]

# Initializează conexiunea la baza de date
supabase = connect_to_supabase()

# ---------------- CRUD Functions ----------------

# CREATE
def create_student(student: StudentCreate):
    response = supabase.table("student").insert(student.dict()).execute()
    if response.data:
        return {"message": "Student adăugat cu succes!", "student": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la adăugarea studentului.")

# READ - Obține toți studenții
def get_all_students():
    response = supabase.table("student").select("*").execute()
    if response.data:
        return response.data
    else:
        raise HTTPException(status_code=404, detail="Nu s-au găsit studenți.")

# READ - Obține student după ID
def get_student_by_id(idstudent: int):
    response = supabase.table("student").select("*").eq("idstudent", idstudent).execute()
    if response.data:
        return response.data[0]
    else:
        raise HTTPException(status_code=404, detail=f"Studentul cu ID-ul {idstudent} nu a fost găsit.")

# UPDATE
def update_student(update_data: StudentUpdate):
    idstudent = update_data.idstudent
    update_dict = {key: value for key, value in update_data.dict().items() if value is not None and key != "idstudent"}

    if not update_dict:
        raise HTTPException(status_code=400, detail="Nicio actualizare specificată.")

    response = supabase.table("student").update(update_dict).eq("idstudent", idstudent).execute()
    if response.data:
        return {"message": "Student actualizat cu succes!", "student": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la actualizarea studentului.")

# DELETE
def delete_student(idstudent: int):
    response = supabase.table("student").delete().eq("idstudent", idstudent).execute()
    if response.data:
        return {"message": "Student șters cu succes!"}
    else:
        raise HTTPException(status_code=404, detail=f"Studentul cu ID-ul {idstudent} nu a fost găsit.")
