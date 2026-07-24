import React, { useState } from 'react';
import { useEvaluation } from '../store/EvaluationContext';
import { EvaluationForm } from '../components/Evaluation/EvaluationForm';
import { EvaluationDashboard } from '../components/Evaluation/EvaluationDashboard';
import { EvaluationLoadingOverlay } from '../components/Evaluation/EvaluationLoadingOverlay';
import { BrainCircuit, Plus } from 'lucide-react';

export function DashboardPage() {
  const { currentEvaluation, clearCurrentEvaluation } = useEvaluation();
  const [showForm, setShowForm] = useState(!currentEvaluation);

  if (currentEvaluation && !showForm) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <button
            onClick={() => {
              clearCurrentEvaluation();
              setShowForm(true);
            }}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl glass-card text-cyan-400 hover:border-cyan-500/30 transition-all"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
              <Plus size={20} />
            </div>
            <span className="font-medium">New Evaluation</span>
          </button>
        </div>
        <EvaluationDashboard />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '500px', height: '500px', top: '-100px', right: '-150px' }} />
      <div className="bg-glow bg-glow-purple" style={{ width: '400px', height: '400px', bottom: '0', left: '-100px' }} />

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 animate-pulse-glow">
              <BrainCircuit size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Evaluation Dashboard
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Enter your question and AI response to evaluate quality metrics
          </p>
        </div>

        {/* Form */}
        <EvaluationForm />
      </div>

      {/* Loading Overlay */}
      <EvaluationLoadingOverlay />
    </div>
  );
}
