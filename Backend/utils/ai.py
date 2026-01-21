from openai import OpenAI
import os
from dotenv import load_dotenv
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("API_KEY_MODEL"),
)

completion = client.chat.completions.create(
    model="mistralai/mistral-7b-instruct:free",
    messages=[
        {"role": "user", "content": "What are the essential skills required to become a full-stack developer in 2025?"

}
    ]
)
# print(completion)  
# ✅ Only print the AI’s message content
print(completion.choices[0].message.content.strip())