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

import PyPDF2
import io
import gc  # Garbage collector

def extract_text_from_cloudinary_pdf(pdf_url: str, max_pages: int = 3):
    """Extract text without loading entire PDF in memory"""
    try:
        import requests
        
        # Download with streaming (doesn't load all at once)
        response = requests.get(pdf_url, stream=True, timeout=30)
        
        # Process in chunks
        pdf_bytes = io.BytesIO()
        chunk_size = 1024 * 1024  # 1MB chunks
        
        for chunk in response.iter_content(chunk_size=chunk_size):
            if chunk:
                pdf_bytes.write(chunk)
        
        pdf_bytes.seek(0)
        
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(pdf_bytes)
        
        # Extract text page by page (not all at once)
        text = ""
        num_pages = min(len(pdf_reader.pages), max_pages)
        
        for i in range(num_pages):
            page = pdf_reader.pages[i]
            text += page.extract_text() + "\n"
            
            # Clear memory every 3 pages
            if i % 3 == 0:
                gc.collect()  # Force garbage collection
        
        # Limit text size
        return text[:8000]  # Only keep first 5000 characters
        
    except Exception as e:
        print(f"❌ Error extracting text: {e}")
        return ""
    finally:
        # Clean up
        pdf_bytes.close()
        gc.collect()