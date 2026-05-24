import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, Resume
import json

db = SessionLocal()
try:
    resumes = db.query(Resume).order_by(Resume.uploaded_at.desc()).limit(10).all()
    for r in resumes:
        print(f"ID: {r.id} | Email: {r.candidate_email} | Name: {r.file_name} | Score: {r.ats_score} | Uploaded: {r.uploaded_at}")
        analysis_data = r.analysis_data or {}
        print("  Keys in analysis_data:", list(analysis_data.keys()))
        print("  Profile Data:", analysis_data.get("profile_data"))
        print("  Matching Skills (Resume):", r.matching_skills)
finally:
    db.close()
