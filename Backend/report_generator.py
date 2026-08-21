from datetime import datetime
from io import BytesIO
from typing import List, Dict
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _format_date(dt: datetime) -> str:
    return dt.strftime('%B %d, %Y')


def _build_recommendations(averages: Dict[str, float]) -> List[str]:
    recommendations = []

    if averages.get('average_relevance', 0) < 70:
        recommendations.append(
            'Improve response relevance by directly addressing the user question.'
        )

    if averages.get('average_accuracy', 0) < 70:
        recommendations.append(
            'Improve factual accuracy and verify claims against reliable reference information.'
        )

    if averages.get('average_completeness', 0) < 70:
        recommendations.append(
            'Include more of the important points required by the reference answer.'
        )

    if averages.get('average_hallucination', 0) >= 25:
        recommendations.append(
            'Reduce unsupported claims and rely more strongly on retrieved/reference information.'
        )

    if not recommendations:
        recommendations.append(
            'Overall evaluation quality is strong across the measured dimensions.'
        )

    return recommendations


def _calculate_summary(results: List[Dict]) -> Dict[str, float]:
    summary = {
        'total': len(results),
        'average_overall_score': 0.0,
        'pass': 0,
        'needs_improvement': 0,
        'fail': 0,
        'average_relevance': 0.0,
        'average_accuracy': 0.0,
        'average_completeness': 0.0,
        'average_hallucination': 0.0,
    }

    if not results:
        return summary

    totals = {
        'relevance': 0.0,
        'accuracy': 0.0,
        'completeness': 0.0,
        'hallucination': 0.0,
        'overall': 0.0,
    }

    for item in results:
        metrics = item.get('metrics', {})
        verdict = item.get('verdict', {})

        totals['relevance'] += float(metrics.get('relevance', 0))
        totals['accuracy'] += float(metrics.get('correctness', 0))
        totals['completeness'] += float(metrics.get('completeness', 0))
        totals['hallucination'] += float(metrics.get('hallucinationRisk', 0))
        totals['overall'] += float(metrics.get('overallScore', 0))

        verdict_text = verdict.get('verdict', '').upper()
        if 'PASS' in verdict_text:
            summary['pass'] += 1
        elif 'NEEDS' in verdict_text:
            summary['needs_improvement'] += 1
        elif 'FAIL' in verdict_text:
            summary['fail'] += 1

    total = len(results)
    summary['average_overall_score'] = round(totals['overall'] / total, 2)
    summary['average_relevance'] = round(totals['relevance'] / total, 2)
    summary['average_accuracy'] = round(totals['accuracy'] / total, 2)
    summary['average_completeness'] = round(totals['completeness'] / total, 2)
    summary['average_hallucination'] = round(totals['hallucination'] / total, 2)

    return summary


def create_pdf_report(results: List[Dict]) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()
    title_style = styles['Title']
    title_style.alignment = TA_CENTER
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles['Heading2'],
        spaceAfter=12,
        alignment=TA_LEFT,
    )
    normal_style = styles['BodyText']
    normal_style.spaceAfter = 8
    small_style = ParagraphStyle(
        'Small',
        parent=styles['BodyText'],
        fontSize=9,
        spaceAfter=4,
    )

    story = []
    story.append(Paragraph('AI Response Quality Evaluator', title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph('Purpose: Evaluation of AI-generated responses using multiple evaluation dimensions.', normal_style))
    story.append(Paragraph(f'Date: {_format_date(datetime.now())}', small_style))
    story.append(Spacer(1, 16))

    summary = _calculate_summary(results)
    recommendations = _build_recommendations(summary)

    story.append(Paragraph('Batch Summary', heading_style))

    summary_table_data = [
        ['Total evaluations', str(summary['total'])],
        ['Average overall score', f"{summary['average_overall_score']}%"],
        ['PASS count', str(summary['pass'])],
        ['NEEDS IMPROVEMENT count', str(summary['needs_improvement'])],
        ['FAIL count', str(summary['fail'])],
        ['Average Relevance', f"{summary['average_relevance']}%"],
        ['Average Accuracy', f"{summary['average_accuracy']}%"],
        ['Average Completeness', f"{summary['average_completeness']}%"],
        ['Average Hallucination', f"{summary['average_hallucination']}%"],
    ]

    summary_table = Table(summary_table_data, colWidths=[2.8 * inch, 3.2 * inch])
    summary_table.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#0f172a')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ])
    )
    story.append(summary_table)
    story.append(Spacer(1, 16))

    story.append(Paragraph('Individual Evaluation Results', heading_style))
    for index, item in enumerate(results, start=1):
        question = item.get('question', 'N/A')
        response = item.get('aiResponse', 'N/A')
        reference = item.get('referenceAnswer', 'N/A')
        metrics = item.get('metrics', {})
        verdict = item.get('verdict', {})

        safe_question = escape(str(question))
        safe_response = escape(str(response)).replace('\n', '<br/>')
        safe_reference = escape(str(reference)).replace('\n', '<br/>')
        safe_relevance = escape(str(metrics.get('relevance', 'N/A')))
        safe_accuracy = escape(str(metrics.get('correctness', 'N/A')))
        safe_completeness = escape(str(metrics.get('completeness', 'N/A')))
        safe_hallucination = escape(str(metrics.get('hallucinationRisk', 'N/A')))
        safe_overall = escape(str(metrics.get('overallScore', 'N/A')))
        safe_verdict = escape(str(verdict.get('verdict', 'N/A')))
        safe_reason = escape(str(verdict.get('summary', 'N/A'))).replace('\n', '<br/>')

        story.append(Paragraph(f'<b>{index}. Question:</b> {safe_question}', normal_style))
        story.append(Paragraph(f'<b>AI Response:</b> {safe_response}', normal_style))
        story.append(Paragraph(f'<b>Reference Answer:</b> {safe_reference}', normal_style))
        story.append(Paragraph(f'<b>Relevance score:</b> {safe_relevance}%', normal_style))
        story.append(Paragraph(f'<b>Accuracy score:</b> {safe_accuracy}%', normal_style))
        story.append(Paragraph(f'<b>Completeness score:</b> {safe_completeness}%', normal_style))
        story.append(Paragraph(f'<b>Hallucination score:</b> {safe_hallucination}%', normal_style))
        story.append(Paragraph(f'<b>Overall score:</b> {safe_overall}%', normal_style))
        story.append(Paragraph(f'<b>Final verdict:</b> {safe_verdict}', normal_style))
        story.append(Paragraph(f'<b>Verdict reason:</b> {safe_reason}', normal_style))
        story.append(Spacer(1, 12))

    story.append(Paragraph('Hallucination Section', heading_style))
    hallucination_cases = [
        item for item in results
        if float(item.get('metrics', {}).get('hallucinationRisk', 0)) > 0
    ]
    if hallucination_cases:
        for item in hallucination_cases:
            question = escape(str(item.get('question', 'N/A')))
            hallucination_score = escape(str(item.get('metrics', {}).get('hallucinationRisk', 'N/A')))
            verdict = item.get('verdict', {})
            safe_reason = escape(str(verdict.get('summary', 'N/A'))).replace('\n', '<br/>')
            safe_verdict = escape(str(verdict.get('verdict', 'N/A')))
            story.append(Paragraph(f'<b>Question:</b> {question}', normal_style))
            story.append(Paragraph(f'<b>Hallucination score:</b> {hallucination_score}%', normal_style))
            story.append(Paragraph(f'<b>Reason / summary:</b> {safe_reason}', normal_style))
            story.append(Paragraph(f'<b>Final verdict:</b> {safe_verdict}', normal_style))
            story.append(Spacer(1, 10))
    else:
        story.append(Paragraph('No significant hallucination cases were detected.', normal_style))
        story.append(Spacer(1, 10))

    story.append(Paragraph('Improvement Recommendations', heading_style))
    for recommendation in recommendations:
        story.append(Paragraph(f'• {recommendation}', normal_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
