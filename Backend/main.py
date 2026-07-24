from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from judge_orchestrator import evaluate_response

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