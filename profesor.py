from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase_connect import connect_to_supabase

# Model pentru adăugare profesor
class ProfesorCreate(BaseModel):
    numeprofesor: str
    emailprofesor: str
    facultate: str
    specializare: str
    iduser: int

# Model pentru actualizare profesor
class ProfesorUpdate(BaseModel):
    idprofesor: int
    numeprofesor: Optional[str]
    emailprofesor: Optional[str]
    facultate: Optional[str]
    specializare: Optional[str]
    iduser: Optional[int]

# Initializează conexiunea la baza de date
supabase = connect_to_supabase()

# ---------------- CRUD Functions ----------------

# CREATE
def create_profesor(profesor: ProfesorCreate):
    response = supabase.table("profesor").insert(profesor.dict()).execute()
    if response.data:
        return {"message": "Profesor adăugat cu succes!", "profesor": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la adăugarea profesorului.")

# READ - Obține toți profesorii
def get_all_profesors():
    response = supabase.table("profesor").select("*").execute()
    if response.data:
        return response.data
    else:
        raise HTTPException(status_code=404, detail="Nu s-au găsit profesori.")

# READ - Obține profesor după ID
def get_profesor_by_id(idprofesor: int):
    response = supabase.table("profesor").select("*").eq("idprofesor", idprofesor).execute()
    if response.data:
        return response.data[0]
    else:
        raise HTTPException(status_code=404, detail=f"Profesorul cu ID-ul {idprofesor} nu a fost găsit.")

# UPDATE
def update_profesor(update_data: ProfesorUpdate):
    idprofesor = update_data.idprofesor
    update_dict = {key: value for key, value in update_data.dict().items() if value is not None and key != "idprofesor"}

    if not update_dict:
        raise HTTPException(status_code=400, detail="Nicio actualizare specificată.")

    response = supabase.table("profesor").update(update_dict).eq("idprofesor", idprofesor).execute()
    if response.data:
        return {"message": "Profesor actualizat cu succes!", "profesor": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la actualizarea profesorului.")

# DELETE
def delete_profesor(idprofesor: int):
    response = supabase.table("profesor").delete().eq("idprofesor", idprofesor).execute()
    if response.data:
        return {"message": "Profesor șters cu succes!"}
    else:
        raise HTTPException(status_code=404, detail=f"Profesorul cu ID-ul {idprofesor} nu a fost găsit.")
