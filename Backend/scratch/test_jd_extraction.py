import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, Resume
from vector_store import parse_jd_requirements_from_text

db = SessionLocal()
try:
    resume = db.query(Resume).filter(Resume.id == 28).first()
    if resume:
        jd_text = resume.analysis_data.get("jd_text")
        print("JD TEXT PREVIEW:\n", jd_text[:300])
        print("\nEXTRACTING REQUIREMENTS...")
        requirements = parse_jd_requirements_from_text(jd_text)
        print(f"Extracted {len(requirements)} requirements:")
        for r in requirements:
            print(" -", r)
    else:
        print("Resume 28 not found.")
finally:
    db.close()
