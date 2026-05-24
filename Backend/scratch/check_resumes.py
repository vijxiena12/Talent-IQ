import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, Resume
import json

db = SessionLocal()
try:
    resumes = db.query(Resume).order_by(Resume.uploaded_at.desc()).all()
    for r in resumes:
        print(f"ID: {r.id} | Email: {r.candidate_email} | Name: {r.file_name} | Score: {r.ats_score} | Uploaded: {r.uploaded_at}")
        profile_data = (r.analysis_data or {}).get("profile_data", {})
        print("  Profile Skills:", profile_data.get("skills"))
        print("  Matching Skills (Resume):", r.matching_skills)
finally:
    db.close()
