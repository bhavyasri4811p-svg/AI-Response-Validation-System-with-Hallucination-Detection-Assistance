def calculate_dashboard(results):

    total = len(results)

    if total == 0:
        return {
            "total_evaluations": 0,
            "pass_count": 0,
            "needs_improvement_count": 0,
            "fail_count": 0,
            "pass_percentage": 0,
            "needs_improvement_percentage": 0,
            "fail_percentage": 0,
            "average_relevance": 0,
            "average_accuracy": 0,
            "average_completeness": 0,
            "average_hallucination": 0,
            "average_overall_score": 0,
            "hallucination_frequency": 0
        }

    relevance_total = 0
    accuracy_total = 0
    completeness_total = 0
    hallucination_total = 0
    overall_total = 0

    pass_count = 0
    needs_improvement_count = 0
    fail_count = 0

    for result in results:

        relevance = int(
            result["relevance"].split(":")[1].split()[0]
        )

        accuracy = int(
            result["accuracy"].split(":")[1].split()[0]
        )

        hallucination = int(
            result["hallucination"].split(":")[1].split()[0]
        )

        completeness = int(
            result["completeness"].split(":")[1].split()[0]
        )

        overall = result["verdict"]["overall_score"]

        verdict = result["verdict"]["verdict"]

        relevance_total += relevance
        accuracy_total += accuracy
        hallucination_total += hallucination
        completeness_total += completeness
        overall_total += overall

        if verdict == "PASS":
            pass_count += 1

        elif verdict == "NEEDS IMPROVEMENT":
            needs_improvement_count += 1

        elif verdict == "FAIL":
            fail_count += 1

    return {
        "total_evaluations": total,

        "pass_count": pass_count,

        "needs_improvement_count": needs_improvement_count,

        "fail_count": fail_count,

        "pass_percentage": round(
            (pass_count / total) * 100, 2
        ),

        "needs_improvement_percentage": round(
            (needs_improvement_count / total) * 100, 2
        ),

        "fail_percentage": round(
            (fail_count / total) * 100, 2
        ),

        "average_relevance": round(
            relevance_total / total, 2
        ),

        "average_accuracy": round(
            accuracy_total / total, 2
        ),

        "average_completeness": round(
            completeness_total / total, 2
        ),

        "average_hallucination": round(
            hallucination_total / total, 2
        ),

        "average_overall_score": round(
            overall_total / total, 2
        ),

        "hallucination_frequency": round(
            (hallucination_total / (total * 10)) * 100,
            2
        )
    }