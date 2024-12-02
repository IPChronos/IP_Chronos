from fastapi import HTTPException
from pydantic import BaseModel, EmailStr
from supabase_connect import connect_to_supabase

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def login_user(request: LoginRequest):
    """
    Funcție pentru autentificarea unui utilizator fără criptarea parolei.
    """
    supabase = connect_to_supabase()

    # Selectăm utilizatorul după email
    response = supabase.table("utilizator").select("*").eq("emailuser", request.email).execute()
    user = response.data[0] if response.data else None

    # Verificăm dacă utilizatorul există
    if not user:
        raise HTTPException(status_code=404, detail="Utilizatorul nu a fost găsit.")

    stored_password = user["password"]

    # Comparam parola primită cu parola din baza de date
    if request.password != stored_password:
        raise HTTPException(status_code=401, detail="Parola este invalidă.")
    
    role = None

    # Căutăm utilizatorul în tabelul 'student'
    student_response = supabase.table("student").select("*").eq("iduser", user["iduser"]).execute()
    if student_response.data:
        role = "student"

    # Căutăm utilizatorul în tabelul 'profesor'
    profesor_response = supabase.table("profesor").select("*").eq("iduser", user["iduser"]).execute()
    if profesor_response.data:
        role = "profesor"

    # Căutăm utilizatorul în tabelul 'secretariat'
    secretariat_response = supabase.table("secretariat").select("*").eq("iduser", user["iduser"]).execute()
    if secretariat_response.data:
        role = "secretariat"

    # Dacă nu s-a găsit un rol, returnăm o eroare
    if not role:
        raise HTTPException(status_code=403, detail="Utilizatorul nu are un rol asociat.")

    # Returnăm un mesaj de succes și detaliile utilizatorului
    return {
        "message": "Autentificare reușită!",
        "user": {
            "id": user["iduser"],
            "nume": user["numeuser"],
            "email": user["emailuser"],
            "role": role,
        },
    }
