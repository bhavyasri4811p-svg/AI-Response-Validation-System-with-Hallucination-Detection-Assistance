import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-120b",
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

Return ONLY exactly in the following format.
Use line breaks exactly as shown.

Relevance Score: <0-10>

Reason:
<Write the explanation here on a new line.>

Do not write the score and reason on the same line.
Example Output:

Accuracy Score: 7

Reason:
The response is mostly correct but omits information about AI and automation.

Follow this format exactly.
"""

    result = llm.invoke(prompt)
    output = result.content
    output = output.replace(" Reason:", "\n\nReason:\n")
    return output


if __name__ == "__main__":

    question = input("Question: ")
    response = input("Response: ")
    reference = input("Reference: ")

    print("\nEvaluating...\n")

    print(accuracy_judge(question, response, reference))