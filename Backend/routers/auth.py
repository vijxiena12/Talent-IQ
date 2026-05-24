from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from typing import List, Optional
from database import create_user, authenticate_user, get_or_create_google_user, update_user_profile, SessionLocal, User, Assessment, Resume
from logger import logger
import base64
import json
import hmac
import hashlib
import time

SECRET_KEY = "talentiq-secret-key-jwt-secure-auth"

router = APIRouter(prefix="/api/auth", tags=["auth"])
user_router = APIRouter(prefix="/api/user", tags=["user"])

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').replace('=', '')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_jwt_token(payload: dict) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    header_b64 = base64url_encode(header_json)
    payload_b64 = base64url_encode(payload_json)
    
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = base64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def decode_jwt_token(token: str) -> Optional[dict]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts
        
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        expected_signature_b64 = base64url_encode(expected_signature)
        
        if not hmac.compare_digest(signature_b64.encode('utf-8'), expected_signature_b64.encode('utf-8')):
            return None
            
        payload_bytes = base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        return payload
    except Exception:
        return None

def resolve_user_id(user_id: Optional[int] = Query(None), authorization: Optional[str] = Header(None)) -> int:
    if user_id is not None:
        return user_id
    if authorization:
        try:
            parts = authorization.split(" ")
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]
                payload = decode_jwt_token(token)
                if payload and "user_id" in payload:
                    return int(payload["user_id"])
                if token.startswith("demo-token-"):
                    return int(token.replace("demo-token-", ""))
                elif token.startswith("google-token-"):
                    return int(token.replace("google-token-", ""))
        except Exception:
            pass
    raise HTTPException(status_code=401, detail="User authentication failed. Missing user_id or valid authorization token.")

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str
    full_name: Optional[str] = None
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    email: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[int] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/register")
def register(req: RegisterRequest):
    logger.info(f"Registering new user: {req.email}")
    try:
        full_name = req.full_name or req.name
        user = create_user(req.email, req.password, req.role, full_name=full_name)
        payload = {"user_id": user.id, "email": user.email, "role": user.role, "exp": int(time.time()) + 86400 * 30}
        token = create_jwt_token(payload)
        return {"id": user.id, "email": user.email, "role": user.role, "token": token}
    except Exception as e:
        logger.error(f"Registration error: {e}")
        if "UNIQUE constraint" in str(e):
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(req: LoginRequest):
    logger.info(f"Login attempt for: {req.email}")
    user = authenticate_user(req.email, req.password)
    if not user:
        logger.warning(f"Invalid credentials for: {req.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    payload = {"user_id": user.id, "email": user.email, "role": user.role, "exp": int(time.time()) + 86400 * 30}
    token = create_jwt_token(payload)
    return {"id": user.id, "email": user.email, "role": user.role, "token": token}

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    try:
        user_id = resolve_user_id(None, authorization)
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"id": user.id, "email": user.email, "role": user.role, "full_name": user.full_name}
    finally:
        db.close()

@router.post("/google")
def google_auth(req: GoogleAuthRequest):
    logger.info(f"Google auth for: {req.email}")
    user = get_or_create_google_user(req.email)
    return {"id": user.id, "email": user.email, "role": user.role, "token": f"google-token-{user.id}"}
@user_router.put("/profile")
def update_profile_endpoint(req: UserUpdate, user_id: int):
    logger.info(f"Updating profile for user_id: {user_id}")
    try:
        # Check if email is already in use by another user
        if req.email:
            db = SessionLocal()
            try:
                existing_user = db.query(User).filter(User.email == req.email, User.id != user_id).first()
                if existing_user:
                    raise HTTPException(status_code=400, detail="Email is already in use by another account")
            finally:
                db.close()
                
        user = update_user_profile(user_id, req.dict(exclude_unset=True))
        if not user:
            logger.error(f"User {user_id} not found during profile update")
            raise HTTPException(status_code=404, detail="User not found")
        return {"status": "success", "user": {
            "full_name": user.full_name,
            "email": user.email,
            "bio": user.bio,
            "location": user.location,
            "avatar_url": user.avatar_url,
            "skills": user.skills,
            "experience_years": user.experience_years
        }}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@user_router.post("/change-password")
def change_password_endpoint(req: ChangePasswordRequest, user_id: int):
    logger.info(f"Changing password for user_id: {user_id}")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        from database import pwd_context
        if not pwd_context.verify(req.current_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect current password")
            
        user.password_hash = pwd_context.hash(req.new_password)
        db.commit()
        return {"status": "success", "message": "Password changed successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error changing password for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@user_router.get("/dashboard")
def get_user_dashboard(authorization: Optional[str] = Header(None), user_id: Optional[int] = Query(None)):
    db = SessionLocal()
    try:
        resolved_id = None
        try:
            resolved_id = resolve_user_id(user_id, authorization)
        except Exception:
            pass
            
        if not resolved_id:
            return {
                "profile": {
                    "user_id": 0,
                    "email": "demo@example.com",
                    "role": "INDIVIDUAL",
                    "full_name": "Demo Candidate",
                    "total_assessments": 0,
                    "average_score": 0
                },
                "history": [],
                "suggestions": {
                    "suggestions": [
                        "Upload your resume and compare it with a job description.",
                        "Get tailored advice on skills and format improvements.",
                        "Boost ATS compatibility with clear resume structure."
                    ]
                },
                "dashboard_state": None
            }
            
        user = db.query(User).filter(User.id == resolved_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        from database import get_assessments_by_user
        assessments = get_assessments_by_user(resolved_id)
        history_data = [
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

        # Fetch resumes associated with the user
        user_resumes = db.query(Resume).filter(
            (Resume.candidate_id == resolved_id) | (Resume.candidate_email == user.email)
        ).all()

        for r in user_resumes:
            history_data.append({
                "id": 1000 + r.id,
                "mcq_score": r.ats_score,
                "integrity_score": 100.0,
                "overall_score": r.ats_score,
                "interview_feedback": {},
                "behavior_summary": {},
                "completed_at": r.uploaded_at.isoformat() if r.uploaded_at else None
            })

        # Sort combined history by completed_at descending
        history_data.sort(key=lambda x: x["completed_at"] or "", reverse=True)
        
        profile_data = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
            "full_name": user.full_name or user.email.split("@")[0].title(),
            "bio": user.bio,
            "location": user.location,
            "avatar_url": user.avatar_url,
            "skills": user.skills or [],
            "experience_years": user.experience_years,
            "total_assessments": len(assessments),
            "average_score": sum(a.overall_score for a in assessments) / len(assessments) if assessments else 0
        }
        
        suggestions_data = {
            "suggestions": [
                "Upload your resume and compare it with a job description.",
                "Get tailored advice on skills and format improvements.",
                "Boost ATS compatibility with clear resume structure."
            ]
        }

        last_resume = None
        if user_resumes:
            # Sort by id to find the latest
            sorted_resumes = sorted(user_resumes, key=lambda r: r.id)
            last_resume = sorted_resumes[-1]

        if last_resume:
            ats_result = (last_resume.analysis_data or {}).get("ats_result", last_resume.analysis_data or {})
            suggestions_list = ats_result.get("suggestions")
            if not suggestions_list:
                suggestions_list = [s.get("reason", s.get("requirement", "")) if isinstance(s, dict) else str(s) for s in (last_resume.missing_skills or [])]
            if not suggestions_list:
                suggestions_list = ["Resume analysed. Ready for next assessment."]

            suggestions_data = {
                "missing_skills": last_resume.missing_skills or [],
                "matching_skills": last_resume.matching_skills or [],
                "ats_score": last_resume.ats_score or 0.0,
                "file_name": last_resume.file_name,
                "suggestions": suggestions_list
            }
            
        dashboard_state = None
        if last_resume:
            analysis_data = last_resume.analysis_data or {}
            ats_result = analysis_data.get("ats_result", analysis_data)
            
            # Map skills to list of strings
            def get_skill_requirements(skills_list):
                result = []
                for s in skills_list:
                    if isinstance(s, dict):
                        req = s.get("requirement") or s.get("skill") or ""
                    else:
                        req = str(s)
                    if req:
                        result.append(req)
                return result

            matching_skills_names = get_skill_requirements(last_resume.matching_skills or [])
            missing_skills_names = get_skill_requirements(last_resume.missing_skills or [])
            
            suggestions_list = ats_result.get("suggestions")
            if not suggestions_list:
                suggestions_list = [s.get("reason", s.get("requirement", "")) if isinstance(s, dict) else str(s) for s in (last_resume.missing_skills or [])]
            if not suggestions_list:
                suggestions_list = ["Resume analysed. Ready for next assessment."]

            dashboard_state = {
                "resumeName": last_resume.file_name,
                "resumeText": ats_result.get("resume_text") or "Resume text is stored under candidate profile.",
                "jobDescription": ats_result.get("jd_text") or "Last analyzed job requirements.",
                "analysisResult": {
                    "finalScore": last_resume.ats_score,
                    "ats_score": last_resume.ats_score,
                    "breakdown": ats_result.get("breakdown", {
                        "skillMatch": int(last_resume.ats_score * 0.9),
                        "experience": int(last_resume.ats_score * 0.85),
                        "keywords": int(last_resume.ats_score * 0.95),
                        "formatting": 90
                    }),
                    "matchingSkills": matching_skills_names,
                    "missingSkills": missing_skills_names,
                    "suggestions": suggestions_list
                }
            }
            
        return {
            "profile": profile_data,
            "history": history_data,
            "suggestions": suggestions_data,
            "dashboard_state": dashboard_state
        }
    finally:
        db.close()
