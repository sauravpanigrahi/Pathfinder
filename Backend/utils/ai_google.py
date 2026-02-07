import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError
load_dotenv()

if "GEMINI_API_KEY" not in os.environ:
    raise RuntimeError("GEMINI_API_KEY not set")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
def run_gemini_query(prompt: str):
    """
    Try models sequentially.
    Stop immediately when one succeeds.
    """
    model_priority = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-1.5-pro",
    ]

    prompt = prompt[:8000]  # safety limit

    for model_name in model_priority:
        try:
            print(f"🤖 Trying model: {model_name}")

            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if response and response.text:
                print(f"✅ Gemini success: {model_name}")
                return response

        except APIError as e:
            print(f"⚠️ APIError on {model_name}: {e}")
        except Exception as e:
            print(f"⚠️ Unexpected error on {model_name}: {e}")

    print("❌ All Gemini models failed")
    return None
