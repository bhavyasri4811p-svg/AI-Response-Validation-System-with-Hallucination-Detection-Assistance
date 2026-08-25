# AI Response Quality Evaluator Agent

An AI-powered response evaluation system that analyzes Large Language Model (LLM) outputs using multiple judge agents. The application evaluates AI-generated responses based on relevance, factual accuracy, hallucination risk, and overall response quality.

## Features

- Multi-Agent Evaluation Pipeline
- Relevance Judge Agent
- Accuracy Judge Agent
- Hallucination Detection Agent
- AI Judge Orchestrator
- FastAPI Backend
- React + TypeScript Frontend
- Interactive Dashboard
- Evaluation History
- Downloadable Reports
- ChromaDB-based Retrieval Support

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- ChromaDB

### AI
- Groq LLM
- Prompt Engineering
- Multi-Agent Evaluation

## Project Structure

```
AI_RESPONSE_EVALUATOR
│
├── Backend
│   ├── agents
│   ├── rag
│   ├── documents
│   ├── data_loader
│   ├── main.py
│   ├── judge_orchestrator.py
│   └── requirements.txt
│
├── Frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Evaluation Metrics

- Correctness
- Relevance
- Hallucination Risk
- Overall Score
- Faithfulness
- Completeness
- Fluency

## Workflow

1. User enters Question
2. AI Response is submitted
3. Judge Orchestrator calls all evaluation agents
4. Scores are generated
5. Frontend displays evaluation report

## Future Improvements

- Additional Judge Agents
- RAGAS Integration
- TruLens Support
- PDF Report Export
- Authentication
- Persistent Database

## 🔗 Live Deployment & Links

* **Live Web Application:** [AI Response Validator Frontend](https://ai-response-validator-frontend.onrender.com)
* **Backend API Base URL:** `https://ai-response-validation-backend-s70w.onrender.com`
* **Interactive API Documentation:** [Swagger UI Docs](https://ai-response-validation-backend-s70w.onrender.com/docs)

## Author

**Bhavya Sri Pampana**

B.Tech - Artificial Intelligence and Machine Learning
