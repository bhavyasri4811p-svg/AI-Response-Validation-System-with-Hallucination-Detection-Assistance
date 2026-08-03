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
Return ONLY exactly in the following format.
Use line breaks exactly as shown.

Relevance Score: <0-10>

Reason:
<Write the explanation here on a new line.>

Do not write the score and reason on the same line.
Example Output:

Relevance Score: 8

Reason:
The response answers the question correctly but misses some important details.

Follow this format exactly.
"""

    result = llm.invoke(prompt)
    output = result.content
    output = output.replace(" Reason:", "\n\nReason:\n")
    return output

if __name__ == "__main__":
    question = input("Question: ")
    response = input("Response: ")

    print("\nEvaluating...\n")

    print(relevance_judge(question, response))