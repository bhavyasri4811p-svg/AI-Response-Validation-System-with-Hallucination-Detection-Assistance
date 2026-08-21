import pandas as pd

from judge_orchestrator import evaluate_response


def evaluate_csv(csv_path):
    df = pd.read_csv(csv_path)

    results = []
    overall_total = 0
    pass_count = 0
    needs_improvement_count = 0
    fail_count = 0
    relevance_total = 0
    accuracy_total = 0
    hallucination_total = 0
    completeness_total = 0

    for _, row in df.iterrows():
        result = evaluate_response(
            row["question"],
            row["response"],
            row["reference"]
        )

        relevance = int(result["relevance"].split(":")[1].split()[0])
        accuracy = int(result["accuracy"].split(":")[1].split()[0])
        hallucination = int(result["hallucination"].split(":")[1].split()[0])
        completeness = int(result["completeness"].split(":")[1].split()[0])
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
        else:
            fail_count += 1

        results.append({
            "question": row["question"],
            "response": row["response"],
            "reference": row["reference"],
            "relevance": result["relevance"],
            "accuracy": result["accuracy"],
            "hallucination": result["hallucination"],
            "completeness": result["completeness"],
            "verdict": result["verdict"],
        })

    count = len(results)
    pass_percentage = round((pass_count / count) * 100, 2) if count else 0

    summary = {
        "total": count,
        "average_score": round(overall_total / count, 2) if count else 0,
        "highest_score": max([r["verdict"]["overall_score"] for r in results]) if results else 0,
        "lowest_score": min([r["verdict"]["overall_score"] for r in results]) if results else 0,
        "pass": pass_count,
        "needs_improvement": needs_improvement_count,
        "fail": fail_count,
        "pass_percentage": pass_percentage,
        "average_relevance": round(relevance_total / count, 2) if count else 0,
        "average_accuracy": round(accuracy_total / count, 2) if count else 0,
        "average_hallucination": round(hallucination_total / count, 2) if count else 0,
        "average_completeness": round(completeness_total / count, 2) if count else 0,
    }

    return {
        "results": results,
        "summary": summary,
    }
