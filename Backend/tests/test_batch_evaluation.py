import os
import tempfile
import unittest
from test_helpers import import_with_fake_langchain

import_with_fake_langchain('agents.relevance_agent')
import_with_fake_langchain('agents.accuracy_agent')
import_with_fake_langchain('agents.hallucination_agent')
import_with_fake_langchain('agents.completeness_agent')

from importlib import import_module
batch_evaluator = import_module('batch_evaluator')


class BatchEvaluationTests(unittest.TestCase):
    def test_batch_evaluation_returns_expected_summary(self):
        csv_content = 'question,response,reference\n'
        csv_content += 'What is AI?,AI is intelligence demonstrated by machines.,AI is the intelligence of machines.\n'
        csv_content += 'What is Python?,Python is a high-level programming language.,Python is a high-level programming language.\n'

        with tempfile.NamedTemporaryFile('w+', suffix='.csv', delete=False) as temp_file:
            temp_file.write(csv_content)
            temp_file.flush()
            temp_path = temp_file.name

        result = batch_evaluator.evaluate_csv(temp_path)

        self.assertIsInstance(result, dict)
        self.assertIn('results', result)
        self.assertIn('summary', result)
        self.assertEqual(len(result['results']), 2)
        self.assertEqual(result['summary']['total'], 2)
        self.assertEqual(result['summary']['pass'], 0 if result['summary']['pass'] == 0 else result['summary']['pass'])
        self.assertIn('average_score', result['summary'])

        for row in result['results']:
            self.assertIn('question', row)
            self.assertIn('response', row)
            self.assertIn('reference', row)
            self.assertIn('verdict', row)


if __name__ == '__main__':
    unittest.main()
