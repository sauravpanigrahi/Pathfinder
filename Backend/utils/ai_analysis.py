from sentence_transformers import SentenceTransformer, util
from utils.ai_google import run_gemini_query

# ✅ Lazy load model (only when needed)
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    return _model

def calculate_ats_score(resume_text: str, job_description: str):
    """
    Combines local NLP similarity scoring + Gemini AI qualitative feedback.
    """
    model = get_model()
    
    # --- 1️⃣ Local Semantic Similarity ---
    resume_emb = model.encode(resume_text, convert_to_tensor=True)
    job_emb = model.encode(job_description, convert_to_tensor=True)
    similarity = util.cos_sim(resume_emb, job_emb).item()
    semantic_score = round(similarity * 100, 2)

    # --- 2️⃣ Gemini AI Feedback ---
    prompt = f"""
    You are an expert ATS evaluator.
    Compare the following RESUME and JOB DESCRIPTION and return a JSON output with:
    {{
      "ats_score_reasoning": "Short reasoning for score",
    }}

    RESUME: {resume_text[:17000]}

    JOB DESCRIPTION: {job_description[:7000]}
    """

    response = run_gemini_query(prompt)
    feedback_text = response.text if response else "No AI feedback available."

    return {
        "feedback_text": feedback_text,
        "semantic_score": semantic_score
    }