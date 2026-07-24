import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)


def hallucination_judge(question, response, reference):
    prompt = f"""
You are a Hallucination Judge Agent.

Determine whether the RESPONSE contains information that is NOT supported
by the REFERENCE ANSWER.

Question:
{question}

Reference Answer:
{reference}

Response:
{response}

Return ONLY in this format:

Hallucination Score: <0-10>

Reason:
<Explain whether unsupported or invented information exists.>

Scoring:
0 = No hallucination.
1-3 = Minor unsupported details.
4-6 = Some unsupported claims.
7-9 = Mostly hallucinated.
10 = Completely fabricated or contradicts the reference.
"""

    result = llm.invoke(prompt)
    return result.content


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")
    reference = input("Reference Answer: ")

    print("\nEvaluating...\n")

    print(hallucination_judge(question, response, reference))