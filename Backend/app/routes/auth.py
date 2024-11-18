from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Utilizator
from app.schemas import UserLogin
from passlib.context import CryptContext

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Utilizator).filter(Utilizator.EmailUser == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilizatorul nu există.")
    
    if not verify_password(user.password, db_user.Password):
        raise HTTPException(status_code=401, detail="Parola incorectă.")

    return {"message": "Autentificare reușită", "user_id": db_user.IDUser}
