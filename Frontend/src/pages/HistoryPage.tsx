import React from 'react';
import { useEvaluation } from '../store/EvaluationContext';
import { Calendar, Trash2, Clock, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-cyan-400';
  if (score >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

const getScoreGradient = (score: number) => {
  if (score >= 85) return 'from-cyan-500 to-blue-500';
  if (score >= 70) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-pink-500';
};

export function HistoryPage() {
  const { history, deleteFromHistory } = useEvaluation();

  if (history.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <div className="bg-glow bg-glow-purple" style={{ width: '400px', height: '400px', top: '20%', right: '-100px' }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center py-20 animate-fade-in-up">
          <div className="glass-card rounded-3xl p-12">
            <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 mb-6 animate-float">
              <Clock size={48} className="text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">No Evaluation History</h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Your evaluation history will appear here once you start evaluating AI responses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden animate-fade-in-up">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '300px', height: '300px', top: '10%', right: '-50px' }} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500">
          <BarChart3 size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Evaluation History</h1>
          <p className="text-slate-400">{history.length} evaluation{history.length !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4 relative z-10">
        {history.map((evaluation, index) => (
          <div
            key={evaluation.id}
            className="glass-card rounded-2xl p-6 hover:border-cyan-500/30 group transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Timestamp */}
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <Calendar size={14} />
                  <span>{new Date(evaluation.evaluatedAt).toLocaleString()}</span>
                </div>

                {/* Question */}
                <h3 className="text-white font-medium mb-2 line-clamp-2 text-lg">
                  {evaluation.question}
                </h3>

                {/* AI Response Preview */}
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  {evaluation.aiResponse}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-cyan-400" />
                    <span className="text-slate-400">Score:</span>
                    <span className={`font-bold ${getScoreColor(evaluation.metrics.overallScore)}`}>
                      {evaluation.metrics.overallScore}%
                    </span>
                  </div>
                  <div className="text-slate-600">|</div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Hallucination:</span>
                    <span className={`${
                      evaluation.hallucinationLevel === 'Low' ? 'text-emerald-400' :
                      evaluation.hallucinationLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    } font-medium`}>
                      {evaluation.hallucinationLevel}
                    </span>
                  </div>
                </div>

                {/* Mini Metrics Bar */}
                <div className="flex gap-1.5 mt-4">
                  {['correctness', 'relevance', 'faithfulness', 'completeness', 'fluency'].map((metric) => {
                    const value = evaluation.metrics[metric as keyof typeof evaluation.metrics] as number;
                    return (
                      <div key={metric} className="flex-1">
                        <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(value)} transition-all duration-500`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => deleteFromHistory(evaluation.id)}
                className="p-3 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                title="Delete evaluation"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
