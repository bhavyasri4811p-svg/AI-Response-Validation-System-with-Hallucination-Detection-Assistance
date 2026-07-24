import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)


def accuracy_judge(question, response, reference):
    prompt = f"""
You are an Accuracy Judge Agent.

Evaluate how factually accurate the RESPONSE is compared to the REFERENCE ANSWER.

Question:
{question}

Response:
{response}

Reference:
{reference}

Return ONLY in this format:

Accuracy Score: <0-10>

Reason:
<short explanation>
"""

    result = llm.invoke(prompt)
    return result.content


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")
    reference = input("Reference: ")

    print("\nEvaluating...\n")

    print(accuracy_judge(question, response, reference))