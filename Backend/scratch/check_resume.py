import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from database import SessionLocal, Resume
from extractor import extract_resume, extract_text_from_pdf
import os

db = SessionLocal()
try:
    resume = db.query(Resume).filter(Resume.id == 25).first()
    if resume:
        print("File name:", resume.file_name)
        print("File path:", resume.file_path)
        print("File exists:", os.path.exists(resume.file_path))
        if os.path.exists(resume.file_path):
            print("Size:", os.path.getsize(resume.file_path))
            try:
                text = extract_text_from_pdf(resume.file_path)
                print("Text length:", len(text))
                print("Preview:", text[:200])
                chunks = extract_resume(resume.file_path)
                print("Chunks count:", len(chunks))
            except Exception as e:
                import traceback
                traceback.print_exc()
    else:
        print("Resume ID 25 not found.")
finally:
    db.close()
