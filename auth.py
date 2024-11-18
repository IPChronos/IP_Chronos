from fastapi import HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
from supabase_connect import connect_to_supabase

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def login_user(request: LoginRequest):
    """
    Funcție pentru autentificarea unui utilizator.
    """
    supabase = connect_to_supabase()

    response = supabase.table("utilizator").select("*").eq("email", request.email).execute()
    user = response.data[0] if response.data else None

    if not user:
        raise HTTPException(status_code=404, detail="Utilizatorul nu a fost găsit.")

    stored_password = user["password"]
    if not bcrypt.checkpw(request.password.encode("utf-8"), stored_password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Parola este invalidă.")

    return {"message": "Autentificare reușită!", "user": {"email": user["email"]}}
