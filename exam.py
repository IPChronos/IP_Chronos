from fastapi import HTTPException
from pydantic import BaseModel
from datetime import date, time
from supabase_connect import connect_to_supabase

class Examen(BaseModel):
    idmaterie: int
    idprofesor: int
    idgrupa: int
    data: date
    idsala: int
    ora: time
    status: int
    createde: int

def adauga_examen(examen: Examen):
    """
    Funcție pentru adăugarea unui examen în tabelul 'examen'.
    """
    supabase = connect_to_supabase()

    # Inserarea examenului în baza de date
    response = supabase.table("examen").insert(examen.dict()).execute()

    if response.data:
        return {"message": "Examen adăugat cu succes!", "examen": response.data}
    else:
        raise HTTPException(status_code=400, detail="Eroare la adăugarea examenului")
