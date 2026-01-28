# import httpx # To download the file from the web URL
# import fitz # PyMuPDF, used to read the PDF content
# import io # To handle the file data in memory

# def extract_text_from_cloudinary_pdf(cloudinary_url: str):
#     """
#     Downloads a PDF from a public URL and extracts all raw text using PyMuPDF.
    
#     Args:
#         cloudinary_url: The public web link to the PDF file.
        
#     Returns:
#         A string containing all raw, unformatted text from the PDF.
#     """
#     doc = None # Initialize for safe closure
#     text = ""
    
#     try:
#         # 1. Download the PDF file content from the URL
#         print(f"Attempting to download PDF from: {cloudinary_url}...")
#         response = httpx.get(cloudinary_url, follow_redirects=True)
#         response.raise_for_status() # Raises an error for 4xx/5xx status codes
        
#         # 2. Use BytesIO to create an in-memory file-like object from the downloaded data
#         pdf_stream = io.BytesIO(response.content)
        
#         # 3. Use PyMuPDF to open the PDF directly from the in-memory stream
#         doc = fitz.open(stream=pdf_stream, filetype="pdf")
        
#         # 4. Extract text page by page
#         for page in doc:
#             # Use sort=True for better reading order in complex documents
#             text += page.get_text("text", sort=True) 
#             text += "\n\n--- Page Break ---\n\n"
            
#     except httpx.HTTPStatusError as e:
#         print(f"ERROR: Could not download file (HTTP Status Code {e.response.status_code}). Check the URL.")
#         return ""
#     except Exception as e:
#         print(f"An unexpected error occurred during processing: {e}")
#         return ""
        
#     finally:
#         # 5. Safely close the document
#         if doc is not None:
#             doc.close()
            
#     return text

import requests
import io
import gc
import PyPDF2

def extract_text_from_cloudinary_pdf(pdf_url: str, max_pages: int = 3):
    try:
        response = requests.get(pdf_url, stream=True, timeout=30)
        
        pdf_bytes = io.BytesIO()
        for chunk in response.iter_content(chunk_size=1024 * 1024):
            if chunk:
                pdf_bytes.write(chunk)
        
        pdf_bytes.seek(0)
        pdf_reader = PyPDF2.PdfReader(pdf_bytes)
        
        text = ""
        num_pages = min(len(pdf_reader.pages), max_pages)
        
        for i in range(num_pages):
            text += (pdf_reader.pages[i].extract_text() or "") + "\n"
            gc.collect()
        
        return text[:8000]
    
    except Exception as e:
        print("PDF error:", e)
        return ""
    
    finally:
        try:
            pdf_bytes.close()
        except:
            pass
        gc.collect()

import re

import re

def extract_skill_section(resume_text: str):
    text = resume_text.upper()

    start_keywords = [
        "TECHNICAL SKILLS",
        "SKILLS",
        "TECHNICAL EXPERTISE"
    ]

    end_keywords = [
        "WORK EXPERIENCE",
        "EXPERIENCE",
        "PROJECTS",
        "EDUCATION",
        "CERTIFICATIONS",
        "ACHIEVEMENTS",
        "INTERNSHIP"
    ]

    start_idx = -1
    for key in start_keywords:
        if key in text:
            start_idx = text.find(key)
            break

    if start_idx == -1:
        return ""  # no skills section found

    # find nearest next heading
    end_idx = len(text)
    for end_key in end_keywords:
        idx = text.find(end_key, start_idx + 10)
        if idx != -1:
            end_idx = min(end_idx, idx)

    skills_section = resume_text[start_idx:end_idx]
    return skills_section.strip()


# -------- Step 3: Send only skills to ATS --------
def get_resume_skills_from_pdf(pdf_url: str):
    full_text = extract_text_from_cloudinary_pdf(pdf_url)
    skills_text = extract_skill_section(full_text)
    return skills_text   # ✅ must be string

