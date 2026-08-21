import csv
import tempfile
import unittest
from test_helpers import import_with_fake_langchain

import_with_fake_langchain('agents.relevance_agent')
import_with_fake_langchain('agents.accuracy_agent')
import_with_fake_langchain('agents.hallucination_agent')
import_with_fake_langchain('agents.completeness_agent')

from importlib import import_module
batch_evaluator = import_module('batch_evaluator')
judge = import_module('judge_orchestrator')


class InvalidInputTests(unittest.TestCase):
    def test_empty_question_still_returns_result(self):
        result = judge.evaluate_response('', 'AI is intelligence demonstrated by machines.', 'AI is the intelligence of machines.')
        self.assertIn('relevance', result)

    def test_empty_response_still_returns_result(self):
        result = judge.evaluate_response('What is AI?', '', 'AI is the intelligence of machines.')
        self.assertIn('accuracy', result)

    def test_empty_reference_still_returns_result(self):
        result = judge.evaluate_response('What is AI?', 'AI is intelligence demonstrated by machines.', '')
        self.assertIn('hallucination', result)

    def test_invalid_csv_raises(self):
        with tempfile.NamedTemporaryFile('w+', suffix='.csv', delete=False) as temp_file:
            temp_file.write('invalid,data\n1,2,3')
            temp_file.flush()
            temp_path = temp_file.name

        with self.assertRaises(Exception):
            batch_evaluator.evaluate_csv(temp_path)

    def test_missing_csv_columns_raises(self):
        with tempfile.NamedTemporaryFile('w+', suffix='.csv', delete=False) as temp_file:
            temp_file.write('foo,bar,baz\n1,2,3')
            temp_file.flush()
            temp_path = temp_file.name

        with self.assertRaises(Exception):
            batch_evaluator.evaluate_csv(temp_path)

    def test_empty_csv_returns_empty_summary(self):
        with tempfile.NamedTemporaryFile('w+', suffix='.csv', delete=False) as temp_file:
            temp_file.write('question,response,reference\n')
            temp_file.flush()
            temp_path = temp_file.name

        result = batch_evaluator.evaluate_csv(temp_path)
        self.assertEqual(result['summary']['total'], 0)


if __name__ == '__main__':
    unittest.main()
