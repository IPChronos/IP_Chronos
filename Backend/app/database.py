from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL-ul conexiunii către baza de date (înlocuiește cu datele tale)
DATABASE_URL = "postgresql://postgres.gfmwqcirgxwrlcqpqpte:/Student226721@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Creează motorul pentru baza de date
engine = create_engine(DATABASE_URL)

# Creează o instanță pentru sesiunile bazei de date
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Baza declarativă pentru modelele ORM
Base = declarative_base()

# Dependența pentru sesiunile de bază de date
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
