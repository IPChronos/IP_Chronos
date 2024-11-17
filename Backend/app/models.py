from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base

# Tabela Grupa
class Grupa(Base):
    __tablename__ = "Grupa"
    
    IDGrupa = Column(Integer, primary_key=True, index=True)
    Specializare = Column(String(255), nullable=False)

    studenti = relationship("Student", back_populates="grupa")

# Tabela Utilizator
class Utilizator(Base):
    __tablename__ = "Utilizator"
    
    IDUser = Column(Integer, primary_key=True, index=True)
    NumeUser = Column(String(255), nullable=False)
    EmailUser = Column(String(255), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)
    
    student = relationship("Student", back_populates="utilizator", uselist=False)
    profesor = relationship("Profesor", back_populates="utilizator", uselist=False)
    secretariat = relationship("Secretariat", back_populates="utilizator", uselist=False)

# Tabela Sala
class Sala(Base):
    __tablename__ = "Sala"
    
    IDSala = Column(Integer, primary_key=True, index=True)
    Numar = Column(Integer, nullable=False)
    Capacitate = Column(Integer, nullable=False)
    Corp = Column(String(1), nullable=False)

    examene = relationship("Examen", back_populates="sala")

# Tabela Student
class Student(Base):
    __tablename__ = "Student"
    
    IDStudent = Column(Integer, primary_key=True, index=True)
    NumeStudent = Column(String(255), nullable=False)
    EmailStudent = Column(String(255), nullable=False)
    Grupa = Column(Integer, ForeignKey("Grupa.IDGrupa"))
    IDUser = Column(Integer, ForeignKey("Utilizator.IDUser"), unique=True)

    grupa = relationship("Grupa", back_populates="studenti")
    utilizator = relationship("Utilizator", back_populates="student")
    requests = relationship("Request", back_populates="student")

# Tabela Profesor
class Profesor(Base):
    __tablename__ = "Profesor"
    
    IDProfesor = Column(Integer, primary_key=True, index=True)
    NumeProfesor = Column(String(255), nullable=False)
    EmailProfesor = Column(String(255), nullable=False)
    Facultate = Column(String(255))
    Specializare = Column(String(255))
    IDUser = Column(Integer, ForeignKey("Utilizator.IDUser"), unique=True)

    utilizator = relationship("Utilizator", back_populates="profesor")
    materii = relationship("Materie", back_populates="profesor")
    examene = relationship("Examen", back_populates="profesor")

# Tabela Secretariat
class Secretariat(Base):
    __tablename__ = "Secretariat"
    
    IDSecretariat = Column(Integer, primary_key=True, index=True)
    Facultate = Column(String(255), nullable=False)
    Specializare = Column(String(255), nullable=False)
    Email = Column(String(255), nullable=False)
    IDUser = Column(Integer, ForeignKey("Utilizator.IDUser"), unique=True)

    utilizator = relationship("Utilizator", back_populates="secretariat")

# Tabela Materie
class Materie(Base):
    __tablename__ = "Materie"
    
    IDMaterie = Column(Integer, primary_key=True, index=True)
    IDProfesor = Column(Integer, ForeignKey("Profesor.IDProfesor"))
    NumeMaterie = Column(String(255), nullable=False)

    profesor = relationship("Profesor", back_populates="materii")
    examene = relationship("Examen", back_populates="materie")

# Tabela Examen
class Examen(Base):
    __tablename__ = "Examen"
    
    IDExamen = Column(Integer, primary_key=True, index=True)
    IDMaterie = Column(Integer, ForeignKey("Materie.IDMaterie"))
    IDProfesor = Column(Integer, ForeignKey("Profesor.IDProfesor"))
    IDGrupa = Column(Integer, ForeignKey("Grupa.IDGrupa"))
    Data = Column(Date, nullable=False)
    IDSala = Column(Integer, ForeignKey("Sala.IDSala"))
    Ora = Column(String(8), nullable=False)
    Status = Column(Boolean, default=False)
    CreatDe = Column(Integer, ForeignKey("Utilizator.IDUser"))

    materie = relationship("Materie", back_populates="examene")
    profesor = relationship("Profesor", back_populates="examene")
    grupa = relationship("Grupa", back_populates="examene")
    sala = relationship("Sala", back_populates="examene")
    creator = relationship("Utilizator", back_populates="examene")
    requests = relationship("Request", back_populates="examen")

# Tabela Request
class Request(Base):
    __tablename__ = "Request"
    
    IDRequest = Column(Integer, primary_key=True, index=True)
    IDStudent = Column(Integer, ForeignKey("Student.IDStudent"))
    IDExamen = Column(Integer, ForeignKey("Examen.IDExamen"))
    Status = Column(Boolean, default=False)

    student = relationship("Student", back_populates="requests")
    examen = relationship("Examen", back_populates="requests")

# Tabela Asistent
class Asistent(Base):
    __tablename__ = "Asistent"
    
    IDAsistent = Column(Integer, primary_key=True, index=True)
    NumeAsistent = Column(String(255), nullable=False)
    EmailAsistent = Column(String(255), nullable=False)
    IDExamenAsistent = Column(Integer, ForeignKey("Examen.IDExamen"))

    examen = relationship("Examen", back_populates="asistenti")
