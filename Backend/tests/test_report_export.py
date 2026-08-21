import unittest
from report_generator import create_pdf_report


class ReportExportTests(unittest.TestCase):
    def test_pdf_report_generation_with_results(self):
        results = [
            {
                'question': 'What is AI?',
                'aiResponse': 'AI is intelligence demonstrated by machines.',
                'referenceAnswer': 'AI is the intelligence of machines.',
                'metrics': {
                    'relevance': 8,
                    'correctness': 8,
                    'completeness': 8,
                    'hallucinationRisk': 2,
                    'overallScore': 80,
                },
                'verdict': {
                    'overall_score': 80,
                    'verdict': 'PASS',
                    'summary': 'The response is highly relevant and factually correct.',
                },
            }
        ]

        pdf_data = create_pdf_report(results)
        self.assertIsInstance(pdf_data, bytes)
        self.assertGreater(len(pdf_data), 0)


if __name__ == '__main__':
    unittest.main()
