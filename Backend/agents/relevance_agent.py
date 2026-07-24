import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

def relevance_judge(question, response):
    prompt = f"""
You are a Relevance Judge Agent.

Evaluate how well the RESPONSE answers the QUESTION.

Question:
{question}

Response:
{response}

Return ONLY in this format:

Relevance Score: <0-10>

Reason:
<short explanation>
"""

    result = llm.invoke(prompt)
    return result.content


if __name__ == "__main__":
    question = input("Question: ")
    response = input("Response: ")

    print("\nEvaluating...\n")

    print(relevance_judge(question, response))