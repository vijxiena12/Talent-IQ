from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Header, Query
from pydantic import BaseModel
from typing import List, Optional
import tempfile, os
from pathlib import Path

from database import SessionLocal, User, Assessment, JobDescription, get_assessments_by_user, create_assessment, create_resume
from api_utils import get_session, update_session
from code_executor import execute_code
from dependencies import get_detectors
import agent_5_interview_evaluator
from logger import logger
from routers.auth import resolve_user_id

router = APIRouter(prefix="/api", tags=["candidate"])

def clean_skills_list(skills_list):
    if not skills_list:
        return []
    cleaned = []
    known_skills = ["react", "node.js", "python", "tensorflow", "pytorch", "javascript", "typescript", "c++", "sql", "git", "mongodb", "aws", "docker", "kubernetes", "html", "css", "java", "php", "django", "flask", "fastapi"]
    for s in skills_list:
        s_str = str(s).strip()
        found_any = False
        s_lower = s_str.lower()
        if len(s_str) > 15 and not any(char == ' ' for char in s_str):
            for ks in known_skills:
                if ks in s_lower:
                    standard_name = ks
                    if ks == "node.js" and "node.js" not in s_str and "nodejs" in s_lower:
                        standard_name = "Node.js"
                    elif ks == "react" and "react" in s_lower:
                        standard_name = "React"
                    elif ks == "python" and "python" in s_lower:
                        standard_name = "Python"
                    elif ks == "tensorflow" and "tensorflow" in s_lower:
                        standard_name = "TensorFlow"
                    elif ks == "pytorch" and "pytorch" in s_lower:
                        standard_name = "PyTorch"
                    elif ks == "javascript" and "javascript" in s_lower:
                        standard_name = "JavaScript"
                    elif ks == "typescript" and "typescript" in s_lower:
                        standard_name = "TypeScript"
                    elif ks == "c++":
                        standard_name = "C++"
                    elif ks == "mongodb":
                        standard_name = "MongoDB"
                    
                    # Capitalize first letter of other standard skills
                    if standard_name.lower() in ["git", "docker", "kubernetes", "java", "php", "django", "flask", "fastapi"]:
                        standard_name = standard_name.title()
                    elif standard_name.lower() in ["html", "css", "sql", "aws"]:
                        standard_name = standard_name.upper()

                    if standard_name not in cleaned:
                        cleaned.append(standard_name)
                    found_any = True
        if not found_any:
            s_lower_trim = s_str.lower()
            if s_lower_trim == "react":
                s_str = "React"
            elif s_lower_trim == "node.js" or s_lower_trim == "nodejs":
                s_str = "Node.js"
            elif s_lower_trim == "python":
                s_str = "Python"
            elif s_lower_trim == "javascript":
                s_str = "JavaScript"
            elif s_lower_trim == "typescript":
                s_str = "TypeScript"
            elif s_lower_trim == "css":
                s_str = "CSS"
            elif s_lower_trim == "html":
                s_str = "HTML"
            elif s_lower_trim == "sql":
                s_str = "SQL"
            elif s_lower_trim == "aws":
                s_str = "AWS"
            elif s_lower_trim == "c++":
                s_str = "C++"
            elif s_lower_trim == "mongodb":
                s_str = "MongoDB"
            elif s_lower_trim in ["git", "docker", "kubernetes", "java", "php", "django", "flask", "fastapi"]:
                s_str = s_str.title()
            if s_str and s_str not in cleaned:
                cleaned.append(s_str)
    return cleaned

@router.get("/individual/profile")
def get_profile(user_id: Optional[int] = Query(None), authorization: Optional[str] = Header(None)):
    try:
        resolved_id = resolve_user_id(user_id, authorization)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        
    logger.info(f"Fetching profile for user: {resolved_id}")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == resolved_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        from database import Resume
        last_resume = db.query(Resume).filter(Resume.candidate_email == user.email).order_by(Resume.uploaded_at.desc()).first()
        if not last_resume:
            return {"has_profile": False, "profile": None}
            
        analysis_data = last_resume.analysis_data or {}
        # Try to get the saved profile_data
        profile_data = analysis_data.get("profile_data")
        if not profile_data:
            # Fallback dynamic build
            profile_data = {
                "name": user.full_name or user.email.split("@")[0].title(),
                "title": analysis_data.get("job_title", "Software Engineer"),
                "location": user.location or "San Francisco, CA",
                "email": user.email,
                "phone": "+1 (555) 000-0000",
                "summary": analysis_data.get("summary", "Technical professional."),
                "skills": clean_skills_list(user.skills or []),
                "experience": [],
                "projects": [],
                "ats_score": last_resume.ats_score,
                "resume_url": f"/api/recruiter/resume/{last_resume.id}/download"
            }
        else:
            # ensure resume_url is present
            profile_data["resume_url"] = f"/api/recruiter/resume/{last_resume.id}/download"
            # Fall back to user.skills if profile_data has empty skills
            raw_skills = profile_data.get("skills")
            if not raw_skills:
                raw_skills = user.skills or []
            profile_data["skills"] = clean_skills_list(raw_skills)
            # Fall back to user.location if profile location is missing or a false positive
            loc = profile_data.get("location")
            if not loc or loc == "GitHub, VS":
                profile_data["location"] = user.location or "San Francisco, CA"
            
        return {"has_profile": True, "profile": profile_data}
    finally:
        db.close()

@router.get("/individual/history")
def get_history(user_id: Optional[int] = Query(None), authorization: Optional[str] = Header(None)):
    try:
        resolved_id = resolve_user_id(user_id, authorization)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
        
    logger.info(f"Fetching history for user: {resolved_id}")
    assessments = get_assessments_by_user(resolved_id)
    return [
        {
            "id": a.id,
            "mcq_score": a.mcq_score,
            "integrity_score": a.integrity_score,
            "overall_score": a.overall_score,
            "interview_feedback": a.interview_feedback,
            "behavior_summary": a.behavior_summary,
            "completed_at": a.completed_at.isoformat() if a.completed_at else None
        }
        for a in assessments
    ]

@router.get("/individual/resume-suggestions")
def get_resume_suggestions(user_id: Optional[int] = Query(None), authorization: Optional[str] = Header(None)):
    try:
        resolved_id = resolve_user_id(user_id, authorization)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
        
    logger.info(f"Fetching resume suggestions for user: {resolved_id}")
    # Fetch the last resume uploaded by this user
    db_session = SessionLocal()
    user = db_session.query(User).filter(User.id == resolved_id).first()
    if not user or not user.resumes:
        db_session.close()
        return {"suggestions": "Upload your resume in the assessment suite to get suggestions."}
    
    last_resume = user.resumes[-1]
    db_session.close()
    
    return {
        "missing_skills": last_resume.missing_skills,
        "matching_skills": last_resume.matching_skills,
        "ats_score": last_resume.ats_score,
        "file_name": last_resume.file_name
    }

@router.post("/individual/apply")
async def apply_to_job(
    job_id: int = Form(...),
    user_id: int = Form(...),
    file: UploadFile = File(...),
):
    """Candidate uploads their resume to apply for a specific job."""
    logger.info(f"User {user_id} applying to job {job_id} with file: {file.filename}")

    db_session = SessionLocal()
    job = db_session.query(JobDescription).filter(JobDescription.id == job_id).first()
    candidate = db_session.query(User).filter(User.id == user_id).first()
    db_session.close()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not candidate:
        raise HTTPException(status_code=404, detail="User not found")

    # Check already applied
    from database import Resume
    db_check = SessionLocal()
    already = db_check.query(Resume).filter(
        Resume.jd_id == job_id,
        Resume.candidate_email == candidate.email
    ).first()
    db_check.close()
    if already:
        raise HTTPException(status_code=409, detail="You have already applied to this job.")

    suffix = Path(file.filename).suffix if file.filename else ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        from extractor import extract_resume, extract_skills
        from vector_store import store_resume_chunks, store_jd_requirements_tagged, clear_collections, store_skills
        from test_main_cli import _extract_jd_requirements, _extract_resume_skill_items
        import agent_3_validator

        clear_collections()
        chunks = extract_resume(tmp_path)
        store_resume_chunks(chunks)
        jd_items = _extract_jd_requirements(job.raw_text)
        resume_items = _extract_resume_skill_items(chunks)

        # Extract structured skills from resume and JD
        resume_skills = extract_skills(" ".join([c.content for c in chunks]))
        jd_skills = jd_items
        
        # Store skills in ChromaDB
        store_skills(resume_skills, "resume")
        store_skills(jd_skills, "jd")

        store_jd_requirements_tagged(jd_items, resume_items, job.title)
        ats = agent_3_validator.run(job.raw_text)

        result_data = {
            "ats_score": ats.ats_score,
            "matching_skills": [s.model_dump() if hasattr(s, "model_dump") else s.dict() for s in ats.matching_skills],
            "missing_skills": [s.model_dump() if hasattr(s, "model_dump") else s.dict() for s in ats.missing_skills],
        }

        resume = create_resume(
            candidate_email=candidate.email,
            file_path=tmp_path,
            file_name=file.filename or "resume.pdf",
            jd_id=job_id,
            analysis_data=result_data,
        )

        return {
            "status": "success",
            "resume_id": resume.id,
            "ats_score": ats.ats_score,
            "matching_count": len(ats.matching_skills),
            "missing_count": len(ats.missing_skills),
        }
    except Exception as e:
        logger.error(f"Apply failed: {e}")
        raise HTTPException(status_code=500, detail=f"Application processing failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


class CodeExecuteRequest(BaseModel):
    code: str
    language: str
    test_cases: List[dict]

@router.post("/code/execute")
def execute_code_endpoint(req: CodeExecuteRequest):
    logger.info(f"Executing code for language: {req.language}")
    result = execute_code(req.code, req.language, req.test_cases)
    return result

class AssessmentSubmitRequest(BaseModel):
    session_id: str
    interview_answers: List[dict] = []
    resume_id: Optional[int] = 1
    user_id: Optional[int] = 2
    mcq_score: float
    dsa_code: str
    dsa_feedback: dict
    integrity_score: float

@router.post("/individual/submit-assessment")
def submit_assessment(req: AssessmentSubmitRequest):
    logger.info(f"Submitting assessment for session: {req.session_id}")
    # Evaluate interview answers using agent_5
    mock_interview_feedback = {}
    if req.interview_answers:
        try:
            mock_interview_feedback = agent_5_interview_evaluator.run(req.interview_answers)
        except Exception as e:
            logger.error(f"[submit-assessment] Interview evaluation failed: {e}")
            mock_interview_feedback = {
                "overall_impression": "Evaluation unavailable.",
                "strengths": [],
                "areas_for_improvement": ["Unable to evaluate interview answers."],
                "technical_accuracy": "N/A"
            }

    # Save feedback to session
    session = get_session(req.session_id)
    if session:
        update_session(req.session_id, "mock_interview_feedback", mock_interview_feedback)
        update_session(req.session_id, "dsa_feedback", req.dsa_feedback)

    # Get behavior summary from rules engine (active session)
    _, _, _, rules_obj = get_detectors()
    behavior_summary = rules_obj.get_behavior_summary()

    assessment = create_assessment(
        resume_id=req.resume_id or 1,
        individual_id=req.user_id or 2,
        mcq_score=req.mcq_score,
        dsa_code=req.dsa_code,
        dsa_feedback=req.dsa_feedback,
        integrity_score=req.integrity_score,
        behavior_summary=behavior_summary,
        interview_feedback=mock_interview_feedback
    )

    return {"status": "success", "assessment_id": assessment.id}

def generate_llm_suggestions(resume_text: str, jd_text: str, matching_skills: list, missing_skills: list) -> list:
    import requests
    import json
    
    prompt = f"""You are an expert career coach and technical recruiter.
Analyze the candidate's resume relative to the job description requirements.

Matched Skills: {', '.join(matching_skills)}
Missing Skills: {', '.join(missing_skills)}

Resume Content:
{resume_text[:2000]}

Job Description Content:
{jd_text[:1500]}

Generate exactly 3 to 4 actionable, highly specific recommendations for the candidate to improve their resume, cover gaps, or prepare for this role.
Rules:
- Each recommendation must be a single concrete sentence.
- Base them directly on the difference between the resume content and the job description.
- Do not mention ATS score or percentages.
- Return ONLY a JSON list of strings, e.g. ["string 1", "string 2"]. Do not return markdown, backticks, or any other explanation.
"""
    payload = {
        "model": "gemma3:4b",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 250,
        }
    }
    try:
        resp = requests.post("http://localhost:11434/api/generate", json=payload, timeout=20)
        if resp.status_code == 200:
            raw = resp.json().get("response", "").strip()
            clean = raw.replace("```json", "").replace("```", "").strip()
            start = clean.find("[")
            end = clean.rfind("]") + 1
            if start != -1 and end > start:
                clean = clean[start:end]
            suggestions = json.loads(clean)
            if isinstance(suggestions, list) and all(isinstance(s, str) for s in suggestions):
                return suggestions
    except Exception as e:
        print(f"LLM suggestion generation failed: {e}")
    return []

def calculate_dynamic_scores(resume_text: str, ats_result, jd_text: str, job_title: str) -> dict:
    import re
    
    # 1. Skill Match Score
    matched_count = len(ats_result.matching_skills)
    partial_count = len(ats_result.partial_matches)
    missing_count = len(ats_result.missing_skills)
    total_skills = matched_count + partial_count + missing_count
    
    if total_skills > 0:
        skill_match_score = int(((matched_count + 0.5 * partial_count) / total_skills) * 100)
    else:
        skill_match_score = 70
        
    # 2. Formatting Score (Deduct for missing email, phone, links, length)
    formatting_score = 100
    if not re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text):
        formatting_score -= 15
    if not re.search(r"[\+\(]?\d[\d\s\-\(\)]{6,}\d", resume_text):
        formatting_score -= 15
    if not re.search(r"\b(linkedin\.com|github\.com)\b", resume_text, re.I):
        formatting_score -= 10
        
    word_count = len(resume_text.split())
    if word_count < 100:
        formatting_score -= 20
    elif word_count > 1500:
        formatting_score -= 10
        
    formatting_score = max(50, formatting_score)
    
    # 3. Keyword Score (percentage of matching skills)
    if total_skills > 0:
        keyword_score = int((matched_count / total_skills) * 100)
    else:
        keyword_score = 65
        
    # 4. Experience Relevance Score (years of experience vs seniority)
    experience_score = 75
    years_matches = re.findall(r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?experience", resume_text, re.I)
    resume_years = 0
    if years_matches:
        resume_years = max(int(y) for y in years_matches)
        
    required_years = 1
    job_title_lower = job_title.lower()
    if "senior" in job_title_lower or "sr." in job_title_lower:
        required_years = 5
    elif "lead" in job_title_lower or "principal" in job_title_lower:
        required_years = 8
    elif "junior" in job_title_lower or "jr." in job_title_lower:
        required_years = 0
        
    if resume_years >= required_years:
        experience_score = min(100, 85 + (resume_years - required_years) * 3)
    else:
        experience_score = max(40, 70 - (required_years - resume_years) * 10)
        
    # 5. Overall ATS Score
    ats_score = int(
        skill_match_score * 0.40 +
        keyword_score * 0.30 +
        experience_score * 0.20 +
        formatting_score * 0.10
    )
    # Blend with agent_3's raw score
    ats_score = int((ats_score + ats_result.ats_score) / 2)
    
    # 6. Suggestions
    matching_names = [m.requirement for m in ats_result.matching_skills]
    missing_names = [m.requirement for m in ats_result.missing_skills]
    
    suggestions = generate_llm_suggestions(resume_text, jd_text, matching_names, missing_names)
    
    # Fallback to heuristics if LLM failed
    if not suggestions:
        suggestions = []
        if formatting_score < 90:
            suggestions.append("Add missing contact details (email, phone, LinkedIn or GitHub) in your resume header.")
        if skill_match_score < 75:
            suggestions.append("Incorporate more matching technical skills from the job description to boost matching score.")
        if experience_score < 75:
            suggestions.append("Clarify and highlight years of professional experience corresponding to the seniority level.")
            
        for missing in ats_result.missing_skills:
            suggestions.append(f"Consider adding details or projects showcasing your experience in '{missing.requirement}'.")
            
        if not suggestions:
            suggestions.append("Format is solid! Add more metrics/quantified results to achievements.")
        
    return {
        "ats_score": ats_score,
        "skillMatch": skill_match_score,
        "formatting": formatting_score,
        "keywords": keyword_score,
        "experience": experience_score,
        "suggestions": suggestions
    }

@router.post("/assessment/analyze")
async def analyze_resume_endpoint(
    resume: UploadFile = File(...),
    jd: Optional[str] = Form(None),
    jd_text: Optional[str] = Form(None),
    job_title: str = Form("Target Role"),
    authorization: Optional[str] = Header(None)
):
    import re
    logger.info(f"Analyzing resume for job title '{job_title}'")
    
    # 1. Resolve user from token
    user_id = None
    if authorization:
        try:
            parts = authorization.split(" ")
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]
                from routers.auth import decode_jwt_token
                payload = decode_jwt_token(token)
                if payload and "user_id" in payload:
                    user_id = int(payload["user_id"])
                elif token.startswith("demo-token-"):
                    user_id = int(token.replace("demo-token-", ""))
                elif token.startswith("google-token-"):
                    user_id = int(token.replace("google-token-", ""))
        except Exception:
            pass

    db = SessionLocal()
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    
    email = user.email if user else "candidate@demo.ai"
    
    # 2. Save file persistently
    import time
    data_dir = Path(__file__).parent.parent / "data" / "resumes"
    data_dir.mkdir(parents=True, exist_ok=True)
    dest_name = f"{int(time.time())}_{resume.filename or 'resume.pdf'}"
    dest_path = data_dir / dest_name
    
    contents = await resume.read()
    with open(dest_path, "wb") as f:
        f.write(contents)
    tmp_path = str(dest_path)
    
    success = False
        
    try:
        from vector_store import store_resume_chunks, store_jd_requirements_tagged, clear_collections, store_skills
        from test_main_cli import _extract_jd_requirements, _extract_resume_skill_items
        from extractor import extract_resume, extract_text_from_pdf, extract_skills
        import agent_3_validator
        
        clear_collections()
        chunks = extract_resume(tmp_path)
        store_resume_chunks(chunks)
        
        raw_text = extract_text_from_pdf(tmp_path)
        
        actual_jd = jd or jd_text or "General Skill Assessment"
        jd_items = _extract_jd_requirements(actual_jd)
        resume_items = _extract_resume_skill_items(chunks)

        # Extract structured skills from resume and JD
        resume_skills = extract_skills(" ".join([c.content for c in chunks]))
        jd_skills = jd_items
        
        # Store skills in ChromaDB
        store_skills(resume_skills, "resume")
        store_skills(jd_skills, "jd")
        
        store_jd_requirements_tagged(jd_items, resume_items, job_title)
        
        ats = agent_3_validator.run(actual_jd)
        
        # Calculate dynamic breakdown and suggestions
        scores = calculate_dynamic_scores(raw_text, ats, actual_jd, job_title)
        
        # Profile parsing
        summary_text = ats.summary
        experience_items = []
        project_items = []
        location = user.location if (user and user.location) else "San Francisco, CA"
        phone = "+1 (555) 000-0000"
        
        for c in chunks:
            if c.section == "summary":
                summary_text = c.content
            elif c.section == "experience":
                blocks = c.content.split("\n\n")
                for b in blocks:
                    b_lines = [line.strip() for line in b.split("\n") if line.strip()]
                    if b_lines:
                        experience_items.append({
                            "role": b_lines[0][:60],
                            "company": b_lines[1][:60] if len(b_lines) > 1 else "Tech Company",
                            "period": "2021 - Present",
                            "description": "\n".join(b_lines[2:]) if len(b_lines) > 2 else b
                        })
            elif c.section == "projects":
                blocks = c.content.split("\n\n")
                for b in blocks:
                    b_lines = [line.strip() for line in b.split("\n") if line.strip()]
                    if b_lines:
                        project_items.append({
                            "title": b_lines[0][:60],
                            "description": "\n".join(b_lines[1:]) if len(b_lines) > 1 else b
                        })
                        
        if not experience_items:
            experience_items = [
                {
                    "role": "Software Developer",
                    "company": "Enterprise Tech",
                    "period": "2022 - Present",
                    "description": "Developed features, maintained cloud pipelines, and optimized databases."
                }
            ]
        if not project_items:
            project_items = [
                {
                    "title": "TalentIQ AI Platform Integration",
                    "description": "Implemented full resume parser, proctored testing suite, and ATS analysis."
                }
            ]
            
        phone_match = re.search(r"[\+\(]?\d[\d\s\-\(\)]{6,}\d", raw_text)
        if phone_match:
            phone = phone_match.group(0)
            
        location_matches = re.finditer(r"\b([A-Z][a-zA-Z \t]{1,19},\s*[A-Z][a-zA-Z \t]{1,19}(?:,\s*[A-Z][a-zA-Z \t]{1,19})?)\b", raw_text)
        for m in location_matches:
            loc_candidate = m.group(0).strip()
            loc_lower = loc_candidate.lower()
            if not any(term in loc_lower for term in [
                "github", "linkedin", "vscode", "vs code", "visual studio", "api", "framework", "library", 
                "python", "numpy", "pandas", "react", "node", "skills", "tools", "languages",
                "sql", "typescript", "javascript", "c++", "c#", "java", "html", "css", "git", "docker", 
                "kubernetes", "aws", "gcp", "azure", "database", "mongodb", "postgresql", "mysql"
            ]):
                location = " ".join([line.strip() for line in loc_candidate.split("\n") if line.strip()])
                break
            
        profile_data = {
            "name": user.full_name if (user and user.full_name) else email.split("@")[0].title(),
            "title": job_title,
            "location": location,
            "email": email,
            "phone": phone,
            "summary": summary_text,
            "skills": resume_skills,
            "experience": experience_items,
            "projects": project_items,
            "ats_score": scores["ats_score"]
        }
        
        result_data = {
            "ats_score": scores["ats_score"],
            "matching_skills": [{"requirement": s.requirement, "skill": s.requirement, "similarity_score": s.similarity_score} for s in ats.matching_skills],
            "missing_skills": [{"requirement": s.requirement, "reason": "Missing skill requirement.", "similarity_score": s.similarity_score} for s in ats.missing_skills],
            "partial_matches": [{"requirement": s.requirement, "skill": s.requirement, "similarity_score": s.similarity_score} for s in ats.partial_matches],
            "summary": ats.summary,
            "breakdown": {
                "skillMatch": scores["skillMatch"],
                "experience": scores["experience"],
                "keywords": scores["keywords"],
                "formatting": scores["formatting"]
            },
            "suggestions": scores["suggestions"],
            "profile_data": profile_data,
            "jd_text": actual_jd,
            "job_title": job_title,
            "resume_text": raw_text
        }
        
        # 3. Create resume in db
        resume_obj = create_resume(
            candidate_email=email,
            file_path=tmp_path,
            file_name=resume.filename or "resume.pdf",
            jd_id=None,
            analysis_data=result_data
        )
        
        # 4. If user is logged in, also update their skills, location, and full_name in user table if empty
        if user:
            user.skills = list(sorted(set(resume_skills)))
            if not user.full_name:
                user.full_name = email.split("@")[0].title()
            if location and not user.location:
                user.location = location
            db.commit()
            db.refresh(user)

        success = True
        return {
            "status": "success",
            "resume_id": resume_obj.id,
            "analysis": result_data,
            "ats_result": result_data,
            "assessment": {
                "mcqs": [],
                "dsa": {
                    "title": "Coding Assessment",
                    "description": "General code optimization challenge.",
                    "base_code": ""
                }
            }
        }
    except Exception as e:
        logger.error(f"Analyze resume failed: {e}")
        import traceback
        traceback.print_exc()
        try:
            with open("error.log", "w", encoding="utf-8") as f:
                traceback.print_exc(file=f)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")
    finally:
        db.close()
        if not success and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass
