from pydantic import BaseModel, EmailStr
from pydantic import BaseModel
from datetime import date, time

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ExamenBase(BaseModel):
    IDMaterie: int
    IDProfesor: int
    IDGrupa: int
    Data: date
    IDSala: int
    Ora: str
    Status: int
    CreatDe: int

class ExamenCreate(ExamenBase):
    pass

class ExamenResponse(ExamenBase):
    IDExamen: int

    class Config:
        orm_mode = True
