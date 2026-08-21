import os
import unittest
from test_helpers import import_with_fake_langchain

import_with_fake_langchain('agents.relevance_agent')
import_with_fake_langchain('agents.accuracy_agent')
import_with_fake_langchain('agents.hallucination_agent')
import_with_fake_langchain('agents.completeness_agent')

from importlib import import_module
judge = import_module('judge_orchestrator')


class SingleEvaluationTests(unittest.TestCase):
    def test_single_evaluation_returns_complete_result(self):
        result = judge.evaluate_response(
            'What is AI?',
            'AI is intelligence demonstrated by machines.',
            'AI is the intelligence of machines.'
        )

        self.assertIsInstance(result, dict)
        self.assertIn('relevance', result)
        self.assertIn('accuracy', result)
        self.assertIn('hallucination', result)
        self.assertIn('completeness', result)
        self.assertIn('verdict', result)

        verdict = result['verdict']
        self.assertIsInstance(verdict, dict)
        self.assertIn('overall_score', verdict)
        self.assertIn('verdict', verdict)
        self.assertIn('reason', verdict)

        self.assertGreaterEqual(verdict['overall_score'], 0)
        self.assertIn(verdict['verdict'], ['PASS', 'NEEDS IMPROVEMENT', 'FAIL'])


if __name__ == '__main__':
    unittest.main()
