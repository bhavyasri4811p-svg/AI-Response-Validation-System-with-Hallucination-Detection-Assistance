export interface EvaluationMetrics {
  correctness: number;
  relevance: number;
  faithfulness: number;
  completeness: number;
  fluency: number;
  hallucinationRisk: number;
  overallScore: number;
}

export interface EvaluationResult {
  id: string;
  question: string;
  aiResponse: string;
  referenceAnswer: string;
  sourceDocument?: string;
  metrics: EvaluationMetrics;
  verdict: {
    overall_score: number;
    verdict: string;
    summary: string;
  };
  hallucinationLevel: 'Low' | 'Medium' | 'High';
  suggestions: string[];
  recommendations: string[];
  evaluatedAt: Date;
}

export interface EvaluationInput {
  question: string;
  aiResponse: string;
  referenceAnswer?: string;
  sourceDocument?: File | null;
}

export type EvaluationFramework = 'RAGAS' | 'TruLens' | 'Custom';

export interface AppSettings {
  darkMode: boolean;
  framework: EvaluationFramework;
}
