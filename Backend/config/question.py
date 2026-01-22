# import json
# import mysql.connector

# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="mysql@database",
#     database="pathfinder"
# )
# cursor = db.cursor()
# with open("interview_questions.json", "r", encoding="utf-8") as f:
#     data = json.load(f)
# query = """
# INSERT INTO interview_questions
# (domain, topic, question, answer, difficulty)
# VALUES (%s, %s, %s, %s, %s)
# """
# for q in data:
#     cursor.execute(query, (
#         q["domain"],
#         q["topic"],
#         q["question"],
#         q["answer"],
#         q["difficulty"]
#     ))
# db.commit()
# cursor.close()
# db.close()
# print("✅ All questions inserted successfully")
# import json
# import mysql.connector

# # Database connection
# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="mysql@database",
#     database="pathfinder"
# )

# cursor = db.cursor()

# # Load JSON file
# with open("coding_question.json", "r", encoding="utf-8") as f:
#     data = json.load(f)

# # Insert query
# query = """
# INSERT INTO questions (category, difficulty, question, answer, tags)
# VALUES (%s, %s, %s, %s, %s)
# """

# # Insert each question
# for q in data["questions"]:
#     cursor.execute(query, (
#         q["category"],
#         q["difficulty"],
#         q["question"],
#         q["answer"],
#         json.dumps(q["tags"])   # IMPORTANT: convert list → JSON string
#     ))

# # Commit and close
# db.commit()
# cursor.close()
# db.close()

# print("✅ All questions inserted successfully")

import json
import mysql.connector
import os
from dotenv import load_dotenv

# ⚠️ SECURITY: Load credentials from environment variables
load_dotenv()

# Connect to MySQL
# ⚠️ WARNING: This script should only be run once for data migration
# Use environment variables for database credentials
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "pathfinder")

if not DB_PASSWORD:
    raise ValueError("DB_PASSWORD environment variable is required")

conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

cursor = conn.cursor()

# Load JSON file
with open("company_question.json", "r", encoding="utf-8") as f:
    data = json.load(f)

insert_sql = """
INSERT INTO company_questions
(company_name, title, difficulty, description, approach, topics, requirements)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

for company in data["companies"]:
    company_name = company["name"]

    for q in company["questions"]:
        cursor.execute(
            insert_sql,
            (
                company_name,
                q["title"],
                q["difficulty"],
                q.get("description"),
                q.get("approach"),
                json.dumps(q.get("topic")),
                json.dumps(q.get("requirements"))
            )
        )

conn.commit()
cursor.close()
conn.close()

print("✅ Data inserted into company_questions table successfully")

