from agents.relevance_agent import relevance_judge
from agents.accuracy_agent import accuracy_judge
from agents.hallucination_agent import hallucination_judge


def evaluate_response(question, response, reference):

    relevance = relevance_judge(question, response)

    accuracy = accuracy_judge(
        question,
        response,
        reference
    )

    hallucination = hallucination_judge(
        question,
        response,
        reference
    )

    return {
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination": hallucination
    }