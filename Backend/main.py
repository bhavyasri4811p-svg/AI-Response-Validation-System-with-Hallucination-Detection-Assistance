import os
import tempfile
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dashboard import calculate_dashboard
from judge_orchestrator import evaluate_response
from batch_evaluator import evaluate_csv
from report_generator import create_pdf_report

app = FastAPI()

# Collect allowed origins from environment and defaults
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
custom_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

origins = [
    "https://ai-response-validator-frontend.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
] + custom_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvaluationRequest(BaseModel):
    question: str
    response: str
    reference: str = ""


@app.post("/evaluate")
def evaluate(request: EvaluationRequest):
    return evaluate_response(
        request.question,
        request.response,
        request.reference
    )


@app.post("/batch_evaluate")
async def batch_evaluate(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp:
        temp.write(await file.read())
        csv_path = temp.name

    result = evaluate_csv(csv_path)
    return result


@app.post("/dashboard")
async def dashboard(data: dict):
    results = data.get("results", [])
    dashboard_data = calculate_dashboard(results)
    return dashboard_data


class ExportReportRequest(BaseModel):
    results: list


@app.post("/export_report")
async def export_report(request: ExportReportRequest):
    results = request.results
    if not isinstance(results, list) or len(results) == 0:
        raise HTTPException(
            status_code=400,
            detail="No evaluation results provided for report generation."
        )

    try:
        pdf_bytes = create_pdf_report(results)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {exc}")

    buffer = BytesIO(pdf_bytes)
    filename = "AI_Response_Evaluation_Report.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )