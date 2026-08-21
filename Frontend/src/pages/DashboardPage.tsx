import { EvaluationDashboard } from '../components/Evaluation/EvaluationDashboard';

export function DashboardPage() {
  return (
    <div className="animate-fade-in-up">
      <EvaluationDashboard showCurrentEvaluation={false} />
    </div>
  );
}
