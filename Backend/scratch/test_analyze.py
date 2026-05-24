import sys
sys.path.insert(0, "c:/Users/vijxi/OneDrive/Desktop/pbl project/Backend")

from fastapi.testclient import TestClient
import os

# We mock the extractor module before importing the fastapi app to prevent parsing the dummy PDF
import extractor
from models import ResumeChunk

# Store original functions
_orig_extract_text = extractor.extract_text_from_pdf
_orig_extract_resume = extractor.extract_resume

resume_text = """
Xiena Vij
vijxiena@gmail.com | Khanna, Punjab, India | +91 9877100209
SUMMARY
Artificial Intelligence engineering undergraduate. Experienced in building AI-based applications using Python, NumPy, and Pandas.
TECHNICAL SKILLS
Languages: Python, C++, SQL, TypeScript, JavaScript
Frameworks: React, Node.js, Express
Tools: Git, GitHub, VS Code
Concepts: Data Structures, Object Oriented Programming, Machine Learning, Data Analysis
PROJECTS
AI Paws - AI Pet Care Platform
Built using React, Node.js, and OpenAI APIs. Integrated Google Vision API.
"""

def mock_extract_text_from_pdf(path):
    return resume_text

def mock_extract_resume(path):
    return [
        ResumeChunk(chunk_id="chunk_1", section="summary", content="Artificial Intelligence engineering undergraduate."),
        ResumeChunk(chunk_id="chunk_2", section="skills", content="Languages: Python, C++, SQL, TypeScript, JavaScript. Frameworks: React, Node.js, Express. Tools: Git, GitHub, VS Code."),
        ResumeChunk(chunk_id="chunk_3", section="projects", content="AI Paws - AI Pet Care Platform. Built using React, Node.js, and OpenAI APIs. Integrated Google Vision API.")
    ]

# Apply mocks
extractor.extract_text_from_pdf = mock_extract_text_from_pdf
extractor.extract_resume = mock_extract_resume

from fastapi_app import app
from database import SessionLocal, Resume
from routers.auth import create_jwt_token

client = TestClient(app)

# Generate token
token = create_jwt_token({"user_id": 23, "email": "vijxiena@gmail.com", "role": "INDIVIDUAL"})

db = SessionLocal()
try:
    resume_obj = db.query(Resume).filter(Resume.id == 28).first()
    assert resume_obj is not None
    jd_text = resume_obj.analysis_data.get("jd_text")
finally:
    db.close()

# Create dummy PDF file (any content works now because of the mock)
pdf_path = "dummy_resume.pdf"
with open(pdf_path, "w") as f:
    f.write("dummy content")

try:
    headers = {"Authorization": f"Bearer {token}"}
    with open(pdf_path, "rb") as f:
        response = client.post(
            "/api/assessment/analyze",
            files={"resume": ("dummy_resume.pdf", f, "application/pdf")},
            data={"jd": jd_text, "job_title": "Full Stack Developer"},
            headers=headers
        )
    print("Status:", response.status_code)
    resp_json = response.json()
    print("Analysis Response JSON:")
    import json
    print(json.dumps(resp_json, indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    # Restore original functions
    extractor.extract_text_from_pdf = _orig_extract_text
    extractor.extract_resume = _orig_extract_resume
    if os.path.exists(pdf_path):
        os.remove(pdf_path)
