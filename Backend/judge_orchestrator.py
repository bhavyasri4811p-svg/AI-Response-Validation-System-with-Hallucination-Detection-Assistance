from agents.relevance_agent import relevance_judge
from agents.accuracy_agent import accuracy_judge
from agents.hallucination_agent import hallucination_judge
from agents.completeness_agent import completeness_judge
from agents.verdict_agent import verdict_agent


def evaluate_response(question, response, reference):

    relevance = relevance_judge(
        question,
        response
    )

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

    completeness = completeness_judge(
        question,
        response,
        reference
    )
    verdict = verdict_agent(
    relevance,
    accuracy,
    hallucination,
    completeness
)

    return {
        "relevance": relevance,
        "accuracy": accuracy,
        "hallucination": hallucination,
        "completeness": completeness,
        "verdict": verdict
    }