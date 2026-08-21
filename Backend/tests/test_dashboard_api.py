import unittest
from importlib import import_module

from test_helpers import import_with_fake_langchain

# Ensure fake modules do not interfere with dashboard calculation
calculate_dashboard = import_module('dashboard').calculate_dashboard


class DashboardApiTests(unittest.TestCase):
    def test_dashboard_summary_calculation(self):
        results = [
            {
                'relevance': 'Relevance Score: 8',
                'accuracy': 'Accuracy Score: 7',
                'hallucination': 'Hallucination Score: 2',
                'completeness': 'Completeness Score: 8',
                'verdict': {'overall_score': 80, 'verdict': 'PASS', 'summary': 'Good.'}
            },
            {
                'relevance': 'Relevance Score: 4',
                'accuracy': 'Accuracy Score: 5',
                'hallucination': 'Hallucination Score: 6',
                'completeness': 'Completeness Score: 4',
                'verdict': {'overall_score': 50, 'verdict': 'NEEDS IMPROVEMENT', 'summary': 'Partial.'}
            }
        ]

        summary = calculate_dashboard(results)
        self.assertEqual(summary['total_evaluations'], 2)
        self.assertEqual(summary['pass_count'], 1)
        self.assertEqual(summary['needs_improvement_count'], 1)
        self.assertEqual(summary['fail_count'], 0)
        self.assertAlmostEqual(summary['average_relevance'], 6.0)
        self.assertAlmostEqual(summary['average_accuracy'], 6.0)
        self.assertAlmostEqual(summary['average_completeness'], 6.0)
        self.assertAlmostEqual(summary['average_hallucination'], 4.0)
        self.assertAlmostEqual(summary['average_overall_score'], 65.0)


if __name__ == '__main__':
    unittest.main()
