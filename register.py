from fastapi import HTTPException
from pydantic import BaseModel, EmailStr
from supabase_connect import connect_to_supabase
from bcrypt import hashpw, gensalt


# Definim un model pentru request-ul de înregistrare
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


def register_user(request: RegisterRequest):
    """
    Funcție pentru înregistrarea unui utilizator.
    """
    supabase = connect_to_supabase()

    # Verificăm dacă email-ul există deja în tabela principală
    response_check = supabase.table("utilizator").select("*").eq("emailuser", request.email).execute()
    if response_check.data:
        raise HTTPException(
            status_code=400,
            detail="Email-ul este deja folosit."
        )

    # Obținem următorul ID disponibil
    last_user = supabase.table("utilizator").select("iduser").order("iduser", desc=True).limit(1).execute()
    if last_user.data:
        next_id = max(11, last_user.data[0]["iduser"] + 1)  # Se asigură că ID-ul începe de la 11
    else:
        next_id = 11  # Dacă nu există utilizatori, începe de la 11

    # Criptăm parola
    hashed_password = hashpw(request.password.encode('utf-8'), gensalt())

    try:
        # Inserăm utilizatorul în tabela principală
        user_data = {
            "iduser": next_id,  # Setăm manual ID-ul
            "numeuser": request.name,
            "emailuser": request.email,
            "password": request.password,  # Folosim parola criptată
        }
        response_user = supabase.table("utilizator").insert(user_data).execute()

        # Inserăm utilizatorul în tabela specifică rolului
        if request.role == "secretariat":
            role_data = {
                "idsecretariat": next_id,
                "numesecretariat": request.name,
                "emailsecretariat": request.email,
                "iduser": next_id,  # Asigură-te că ID-ul este corect aici
            }
            role_table = "secretariat"
        elif request.role == "student":
            role_data = {
                "idstudent": next_id,  # Asigură-te că ID-ul este corect aici
                "numestudent": request.name,
                "emailstudent": request.email,
                "iduser": next_id,
            }
            role_table = "student"
        else:
            # Dacă rolul nu este valid, aruncăm o eroare și ștergem utilizatorul
            supabase.table("utilizator").delete().eq("iduser", next_id).execute()  # Ștergem utilizatorul
            raise HTTPException(
                status_code=400,
                detail="Rolul specificat nu este valid."
            )

        # Inserăm datele în tabela rolului
        response_role = supabase.table(role_table).insert(role_data).execute()

        # Dacă totul este în regulă, returnăm succes
        return {
            "message": "Utilizator înregistrat cu succes!",
            "user": {
                "name": request.name,
                "email": request.email,
                "role": request.role
            }
        }

    except Exception as e:
        # Dacă apare vreo eroare, ștergem utilizatorul creat și returnăm eroare
        supabase.table("utilizator").delete().eq("iduser", next_id).execute()  # Ștergem utilizatorul
        raise HTTPException(
            status_code=500,
            detail="A apărut o eroare la înregistrarea utilizatorului. Vă rugăm încercați din nou."
        )
