import re


def extract_score(text):
    match = re.search(r'(\d+)', text)
    if match:
        return int(match.group(1))
    return 0


def verdict_agent(
    relevance,
    accuracy,
    hallucination,
    completeness
):

    relevance_score = extract_score(relevance)
    accuracy_score = extract_score(accuracy)
    hallucination_score = extract_score(hallucination)
    completeness_score = extract_score(completeness)

    overall = (
        relevance_score * 0.30 +
        accuracy_score * 0.35 +
        completeness_score * 0.25 +
        (10 - hallucination_score) * 0.10
    )

    overall = round(overall*10)

    if overall >= 80:
        verdict = "PASS"

    elif overall >= 50:
        verdict = "NEEDS IMPROVEMENT"

    else:
        verdict = "FAIL"

    summary = []

    # Relevance
    if relevance_score >= 8:
        summary.append("The response is highly relevant to the question.")
    elif relevance_score >= 5:
        summary.append("The response is partially relevant but misses some important aspects.")
    else:
        summary.append("The response is poorly related to the question.")

    # Accuracy
    if accuracy_score >= 8:
        summary.append("Most of the information is factually correct.")
    elif accuracy_score >= 5:
        summary.append("The response contains partially correct information.")
    else:
        summary.append("The response contains major factual errors.")

    # Completeness
    if completeness_score >= 8:
        summary.append("Almost all important points from the reference answer are covered.")
    elif completeness_score >= 5:
        summary.append("Some important points are covered, but several details are missing.")
    else:
        summary.append("Many important points from the reference answer are missing.")

    # Hallucination
    if hallucination_score <= 2:
        summary.append("Very little unsupported information was detected.")
    elif hallucination_score <= 5:
        summary.append("Some unsupported claims were detected.")
    else:
        summary.append("The response contains many unsupported or hallucinated statements.")

    reason = " ".join(summary)
    print("Overall:", overall)
    print("Verdict:", verdict)
    return {
        "overall_score": overall,
        "verdict": verdict,
        "reason": reason
    }


if __name__ == "__main__":

    relevance = "Relevance Score: 8"

    accuracy = "Accuracy Score: 7"

    hallucination = "Hallucination Score: 2"

    completeness = "Completeness Score: 6"

    print(
        verdict_agent(
            relevance,
            accuracy,
            hallucination,
            completeness
        )
    )