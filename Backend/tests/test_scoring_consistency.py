import unittest
from test_helpers import import_with_fake_langchain

import_with_fake_langchain('agents.relevance_agent')
import_with_fake_langchain('agents.accuracy_agent')
import_with_fake_langchain('agents.hallucination_agent')
import_with_fake_langchain('agents.completeness_agent')

from importlib import import_module
judge = import_module('judge_orchestrator')


def evaluate_multiple_times(question, response, reference, runs=3):
    results = []
    for _ in range(runs):
        results.append(judge.evaluate_response(question, response, reference))
    return results


class ScoringConsistencyTests(unittest.TestCase):
    def test_scores_are_stable_across_runs(self):
        results = evaluate_multiple_times(
            'What is AI?',
            'AI is intelligence demonstrated by machines.',
            'AI is the intelligence of machines.',
            runs=3
        )

        self.assertEqual(len(results), 3)
        self.assertTrue(all(result['relevance'] == results[0]['relevance'] for result in results))
        self.assertTrue(all(result['accuracy'] == results[0]['accuracy'] for result in results))
        self.assertTrue(all(result['hallucination'] == results[0]['hallucination'] for result in results))
        self.assertTrue(all(result['completeness'] == results[0]['completeness'] for result in results))
        self.assertTrue(all(result['verdict'] == results[0]['verdict'] for result in results))


if __name__ == '__main__':
    unittest.main()
