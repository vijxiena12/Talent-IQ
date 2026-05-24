import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, User, Resume
import json

db = SessionLocal()
try:
    user = db.query(User).filter(User.role == "INDIVIDUAL").first()
    if user:
        print("User Email:", user.email)
        print("User Full Name:", user.full_name)
        print("User Skills (User table):", user.skills)
        
        last_resume = db.query(Resume).filter(Resume.candidate_email == user.email).order_by(Resume.uploaded_at.desc()).first()
        if last_resume:
            print("Last Resume ID:", last_resume.id)
            print("ATS Score:", last_resume.ats_score)
            print("Uploaded at:", last_resume.uploaded_at)
            
            analysis_data = last_resume.analysis_data or {}
            profile_data = analysis_data.get("profile_data", {})
            print("Profile Data (Resume table):")
            print(json.dumps(profile_data, indent=2))
        else:
            print("No resume found for user.")
    else:
        print("No INDIVIDUAL user found.")
finally:
    db.close()
