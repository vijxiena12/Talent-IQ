import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, Resume
import json

db = SessionLocal()
try:
    resume = db.query(Resume).filter(Resume.id == 28).first()
    if resume:
        print("ATS Score:", resume.ats_score)
        print("Analysis Data:")
        print(json.dumps(resume.analysis_data, indent=2))
    else:
        print("Resume 28 not found.")
finally:
    db.close()
