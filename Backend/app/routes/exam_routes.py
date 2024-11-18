from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Examen
from app.schemas import ExamenCreate, ExamenResponse

router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)

# CREATE - Creează un nou examen
@router.post("/", response_model=ExamenResponse)
def create_exam(exam: ExamenCreate, db: Session = Depends(get_db)):
    new_exam = Examen(**exam.dict())
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam

# READ - Obține toate examenele
@router.get("/", response_model=list[ExamenResponse])
def get_all_exams(db: Session = Depends(get_db)):
    exams = db.query(Examen).all()
    return exams

# READ - Obține un examen după ID
@router.get("/{exam_id}", response_model=ExamenResponse)
def get_exam_by_id(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Examen).filter(Examen.IDExamen == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examenul nu a fost găsit")
    return exam

# UPDATE - Actualizează un examen
@router.put("/{exam_id}", response_model=ExamenResponse)
def update_exam(exam_id: int, exam: ExamenCreate, db: Session = Depends(get_db)):
    db_exam = db.query(Examen).filter(Examen.IDExamen == exam_id).first()
    if not db_exam:
        raise HTTPException(status_code=404, detail="Examenul nu a fost găsit")
    for key, value in exam.dict().items():
        setattr(db_exam, key, value)
    db.commit()
    db.refresh(db_exam)
    return db_exam

# DELETE - Șterge un examen
@router.delete("/{exam_id}")
def delete_exam(exam_id: int, db: Session = Depends(get_db)):
    db_exam = db.query(Examen).filter(Examen.IDExamen == exam_id).first()
    if not db_exam:
        raise HTTPException(status_code=404, detail="Examenul nu a fost găsit")
    db.delete(db_exam)
    db.commit()
    return {"detail": "Examenul a fost șters cu succes"}
