import json
import os
import requests
import random
from models import ATSResult, MCQQuestion, DSAQuestion, AssessmentData
from mcp_tools import call_tool
from logger import logger

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL_ASSESSOR", "gemma3:4b")

def _ollama_generate(prompt: str) -> str:
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.4, "num_predict": 1024},
    }
    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
        resp.raise_for_status()
        return resp.json().get("response", "").strip()
    except Exception as e:
        raise RuntimeError(f"[agent_4] Ollama call failed: {e}")

def _build_assessment_prompt(ats: ATSResult, context: str) -> str:
    # Preferred languages based on user request
    languages = ["Python", "C++"]
    target_lang = random.choice(languages)
    
    return f"""You are a technical examiner. Create a specialized assessment for a candidate.
Ground the questions in the candidate's resume and job requirements.

Context:
{context}

Matched Skills: {', '.join([m.requirement for m in ats.matching_skills[:3]])}
Gaps: {', '.join([m.requirement for m in ats.missing_skills[:3]])}

Strictly return ONLY valid JSON in this format:
{{
  "mcqs": [
    {{
      "id": 1,
      "question": "A technical/behavioral question about [Context Item]",
      "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
      "correct_idx": 0,
      "explanation": "Why A is correct"
    }}
  ],
  "dsa": {{
    "title": "A coding challenge related to the role",
    "description": "Problem statement for both Python and C++",
    "constraints": ["Time complexity requirement"],
    "base_code": "The default starter function signature (in Python)",
    "python_base_code": "Python starter code template (e.g. def solution(...):)",
    "cpp_base_code": "C++ starter code template (e.g. class Solution { ... })",
    "language": "{target_lang.lower()}",
    "solution_logic": "Pseudocode explanation of the optimal approach",
    "test_cases": [
      {{
        "input": "arg1, arg2 or JSON array representing arguments, e.g. '[[2, 7, 11], 9]'",
        "expected": "expected output representation, e.g. '[0, 1]'"
      }}
    ]
  }}
}}

Generate exactly 3 MCQs (2 technical, 1 behavioral) and 1 DSA coding question with exactly 3 test cases.
"""

def generate_assessment(ats_result: ATSResult) -> AssessmentData:
    # Pull resume context
    chunks = call_tool("query_resume", query="technical skills projects algorithms", n_results=4)
    context = "\n".join([c["content"] for c in chunks])
    
    prompt = _build_assessment_prompt(ats_result, context)
    logger.info("Generating MCQ & DSA Assessment...")
    raw = _ollama_generate(prompt)
    
    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        start = clean.find("{")
        end = clean.rfind("}") + 1
        data = json.loads(clean[start:end])
        
        mcqs = [MCQQuestion(**q) for q in data.get("mcqs", [])]
        dsa = DSAQuestion(**data.get("dsa", {}))
        
        # Ensure default base_code is fallback if python_base_code or cpp_base_code are missing from output
        if not dsa.python_base_code:
            dsa.python_base_code = dsa.base_code
        if not dsa.cpp_base_code:
            dsa.cpp_base_code = dsa.base_code
            
        return AssessmentData(mcqs=mcqs, dsa=dsa)
    except Exception as e:
        logger.warning(f"Parsing failed: {e}. Using fallback assessment.")
        return AssessmentData(
            mcqs=[
                MCQQuestion(id=1, question="What is the primary benefit of using a Vector Database in RAG?", 
                            options=["Encryption", "Semantic Search", "Compression", "Formatting"], 
                            correct_idx=1, explanation="Vector DBs allow high-speed similarity search based on embeddings."),
                MCQQuestion(id=2, question="Which data structure is most efficient for a LIFO (Last-In-First-Out) implementation?", 
                            options=["Queue", "Linked List", "Stack", "Heap"], 
                            correct_idx=2, explanation="A Stack is a LIFO structure."),
                MCQQuestion(id=3, question="How do you handle a conflict in a team setting?", 
                            options=["Avoid it", "Listen and find common ground", "Report to HR immediately", "Force your opinion"], 
                            correct_idx=1, explanation="Collaboration requires empathy and listening.")
            ],
            dsa=DSAQuestion(
                title="Two Sum",
                description="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                constraints=["O(N) time complexity", "O(N) space complexity"],
                base_code="def two_sum(nums: list[int], target: int) -> list[int]:",
                python_base_code="def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass",
                cpp_base_code="#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        \n    }\n};",
                language="python",
                solution_logic="Use a hash map to store visited numbers and their indices, checking if target - num exists in the map.",
                test_cases=[
                    {"input": "[[2, 7, 11, 15], 9]", "expected": "[0, 1]"},
                    {"input": "[[3, 2, 4], 6]", "expected": "[1, 2]"},
                    {"input": "[[3, 3], 6]", "expected": "[0, 1]"}
                ]
            )
        )
