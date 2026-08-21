import unittest
from test_helpers import import_with_fake_langchain

agents = import_with_fake_langchain('agents.relevance_agent')
accuracy = import_with_fake_langchain('agents.accuracy_agent')
hallucination = import_with_fake_langchain('agents.hallucination_agent')
completeness = import_with_fake_langchain('agents.completeness_agent')
from importlib import import_module
verdict = import_module('agents.verdict_agent')


class AgentTests(unittest.TestCase):
    def test_relevance_agent_output_format(self):
        result = agents.relevance_judge('What is AI?', 'AI is intelligence demonstrated by machines.')
        self.assertIn('Relevance Score:', result)
        self.assertIn('Reason:', result)

    def test_accuracy_agent_output_format(self):
        result = accuracy.accuracy_judge('What is AI?', 'AI is intelligence demonstrated by machines.', 'AI is the intelligence of machines.')
        self.assertIn('Accuracy Score:', result)
        self.assertIn('Reason:', result)

    def test_hallucination_agent_output_format(self):
        result = hallucination.hallucination_judge('What is AI?', 'AI is intelligence demonstrated by machines.', 'AI is the intelligence of machines.')
        self.assertIn('Hallucination Score:', result)
        self.assertIn('Reason:', result)

    def test_completeness_agent_output_format(self):
        result = completeness.completeness_judge('What is AI?', 'AI is intelligence demonstrated by machines.', 'AI is the intelligence of machines.')
        self.assertIn('Completeness Score:', result)
        self.assertIn('Reason:', result)

    def test_verdict_agent_stability(self):
        outcome = verdict.verdict_agent(
            'Relevance Score: 8',
            'Accuracy Score: 8',
            'Hallucination Score: 2',
            'Completeness Score: 8'
        )
        self.assertEqual(outcome['verdict'], 'PASS')
        self.assertIsInstance(outcome['overall_score'], int)
        self.assertIsInstance(outcome['reason'], str)
        self.assertGreater(len(outcome['reason']), 0)


if __name__ == '__main__':
    unittest.main()
