import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)


def completeness_judge(question, response, reference):
    prompt = f"""
You are a Completeness Judge Agent.

Your task is to determine whether the RESPONSE completely answers the QUESTION by comparing it with the REFERENCE ANSWER.

Question:
{question}

Reference Answer:
{reference}

Response:
{response}

Evaluate whether all important points from the reference answer are covered in the response.

Return ONLY exactly in the following format.
Use line breaks exactly as shown.

Relevance Score: <0-10>

Reason:
<Write the explanation here on a new line.>

Do not write the score and reason on the same line.
Example Output:

Completeness Score: 6

Reason:
The response answers the basic question but misses several important points from the reference answer.

Follow this format exactly.

Scoring Guidelines:

10 = Covers all important points.

8-9 = Covers almost everything with only minor omissions.

5-7 = Covers some important points but misses several.

2-4 = Covers very little of the required information.

0-1 = Completely incomplete or unrelated.
"""

    result = llm.invoke(prompt)
    output = result.content
    output = output.replace(" Reason:", "\n\nReason:\n")
    return output


if __name__ == "__main__":
    question = input("Question: ")
    response = input("Response: ")
    reference = input("Reference Answer: ")

    print("\nEvaluating...\n")

    print(completeness_judge(question, response, reference))