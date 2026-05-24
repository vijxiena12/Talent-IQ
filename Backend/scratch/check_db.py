import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, User, Resume, Assessment

db = SessionLocal()
try:
    print("--- USERS ---")
    users = db.query(User).all()
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Name: {u.full_name}, Skills: {u.skills}")
        
    print("\n--- RESUMES ---")
    resumes = db.query(Resume).all()
    for r in resumes:
        print(f"ID: {r.id}, Candidate ID: {r.candidate_id}, Email: {r.candidate_email}, File: {r.file_name}, ATS: {r.ats_score}")
        
    print("\n--- ASSESSMENTS ---")
    assessments = db.query(Assessment).all()
    for a in assessments:
        print(f"ID: {a.id}, User ID: {a.individual_id}, MCQ: {a.mcq_score}, Integrity: {a.integrity_score}")
finally:
    db.close()
