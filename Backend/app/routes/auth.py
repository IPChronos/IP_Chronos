from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Utilizator
from app.schemas import UserLogin, UserRegister, UserResponse
from passlib.context import CryptContext

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Funcție pentru hash-ul parolei"""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Funcție pentru verificarea parolei"""
    return pwd_context.verify(plain_password, hashed_password)

# Login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Utilizator).filter(Utilizator.EmailUser == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilizatorul nu există.")
    
    if not verify_password(user.password, db_user.Password):
        raise HTTPException(status_code=401, detail="Parola incorectă.")

    return {"message": "Autentificare reușită", "user_id": db_user.IDUser}

# Register
@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Verificăm dacă email-ul există deja
    db_user = db.query(Utilizator).filter(Utilizator.EmailUser == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email-ul este deja folosit.")

    # Creăm un nou utilizator
    new_user = Utilizator(
        NumeUser=user.name,
        EmailUser=user.email,
        Password=hash_password(user.password)
    )

    # Adăugăm în baza de date
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
