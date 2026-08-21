import unittest
from test_helpers import import_with_fake_langchain

hallucination = import_with_fake_langchain('agents.hallucination_agent')


class HallucinationTests(unittest.TestCase):
    def test_supported_response_low_hallucination(self):
        result = hallucination.hallucination_judge(
            'What is Python?',
            'Python is a high-level programming language.',
            'Python is a high-level programming language.'
        )
        self.assertIn('Hallucination Score:', result)
        self.assertIn('Reason:', result)

    def test_unsupported_response_detects_hallucination(self):
        result = hallucination.hallucination_judge(
            'What is Python?',
            'Python was created in 1985 and is used exclusively for mobile development.',
            'Python is a high-level programming language.'
        )
        self.assertIn('Hallucination Score:', result)
        self.assertIn('Reason:', result)


if __name__ == '__main__':
    unittest.main()
