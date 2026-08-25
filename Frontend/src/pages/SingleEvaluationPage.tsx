import { EvaluationForm } from '../components/Evaluation/EvaluationForm';
import { EvaluationDashboard } from '../components/Evaluation/EvaluationDashboard';
import { EvaluationLoadingOverlay } from '../components/Evaluation/EvaluationLoadingOverlay';
import { useEvaluation } from '../store/EvaluationContext';
import { Plus } from 'lucide-react';
import { API_BASE_URL } from '../../api';
export default function SingleEvaluationPage() {
  const { currentEvaluation, clearCurrentEvaluation } = useEvaluation();

  if (!currentEvaluation) {
    return (
      <>
        <EvaluationForm />
        <EvaluationLoadingOverlay />
      </>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <button
          onClick={clearCurrentEvaluation}
          className="group flex items-center gap-3 px-5 py-3 rounded-xl glass-card text-cyan-400 hover:border-cyan-500/30 transition-all"
        >
          <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-medium">New Evaluation</span>
        </button>
      </div>
      <EvaluationDashboard singleOnly />
    </div>
  );
}
