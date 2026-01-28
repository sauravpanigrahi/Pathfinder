def calculate_ats_score(resume_skills_text, job_skills_text):
    resume_skills = normalize_skills(resume_skills_text)
    job_skills = normalize_skills(job_skills_text)

    print("resume_skills:", resume_skills)
    print("job_skills:", job_skills)

    if not job_skills:
        return 0, []

    matched = resume_skills.intersection(job_skills)
    score = (len(matched) / len(job_skills)) * 100

    return round(score, 2), list(matched)

import re

STOP_WORDS = {
    # Section headers
    "technical skills",
    "skills",
    "skill set",
    "key skills",
    "core skills",
    "professional skills",
    "technical expertise",
    "expertise",
    "competencies",
    "core competencies",

    # Category labels
    "programming languages",
    "languages",
    "frontend technologies",
    "backend technologies",
    "web technologies",
    "technologies",
    "tools",
    "cloud & tools",
    "cloud tools",
    "frameworks",
    "libraries",
    "platforms",
    "databases",
    "database technologies",

    # Resume noise
    "experience",
    "work experience",
    "projects",
    "certifications",
    "education",
    "profile",
    "summary",
    "professional summary",
    "about",
    "responsibilities",
    "achievements",
    "interests",
    "hobbies",

    # Generic junk
    "and",
    "or",
    "with",
    "using",
    "knowledge of",
    "familiar with",
    "hands on",
    "basic",
    "advanced",
    "intermediate",
}


def normalize_skills(text):
    if not text:
        return set()

    # ---- Flatten everything to string safely ----
    if isinstance(text, (list, set)):
        flat = []
        for item in text:
            if isinstance(item, (list, set)):
                flat.extend(item)
            else:
                flat.append(str(item))
        text = ", ".join(flat)

    elif isinstance(text, dict):
        text = ", ".join([str(v) for v in text.values()])

    else:
        text = str(text)

    text = text.lower()

    # Remove brackets and quotes
    text = re.sub(r"[\[\]\(\)\'\"]", "", text)

    # Normalize separators
    text = text.replace("\n", ",")
    text = text.replace(";", ",")
    text = text.replace("|", ",")

    raw_parts = text.split(",")

    clean_skills = set()

    for part in raw_parts:
        part = part.strip()

        # Remove label before colon
        if ":" in part:
            part = part.split(":")[-1].strip()

        # Remove headings
        if part in STOP_WORDS:
            continue

        if len(part) <= 2:
            continue

        clean_skills.add(part)

    return clean_skills
