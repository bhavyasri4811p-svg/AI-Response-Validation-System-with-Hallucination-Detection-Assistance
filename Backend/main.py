from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

import tempfile
from fastapi.middleware.cors import CORSMiddleware
from judge_orchestrator import evaluate_response
from batch_evaluator import evaluate_csv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluationRequest(BaseModel):
    question: str
    response: str
    reference: str

@app.post("/evaluate")
def evaluate(request: EvaluationRequest):
    return evaluate_response(
        request.question,
        request.response,
        request.reference
    )
    return result
@app.post("/batch_evaluate")
async def batch_evaluate(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp:

        temp.write(await file.read())

        csv_path = temp.name

    result = evaluate_csv(csv_path)

    return result