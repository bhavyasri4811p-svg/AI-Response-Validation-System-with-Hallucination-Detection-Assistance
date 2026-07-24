import React from 'react';
import { useEvaluation, EvaluationStage } from '../../store/EvaluationContext';
import { Sparkles, CheckCircle, BrainCircuit, Target, Shield, BarChart3, FileCheck } from 'lucide-react';

const stageIcons: Record<EvaluationStage, React.ElementType> = {
  idle: Sparkles,
  analyzing: BrainCircuit,
  correctness: Target,
  hallucination: Shield,
  computing: BarChart3,
  generating: FileCheck,
  complete: CheckCircle,
};

const stageColors: Record<EvaluationStage, string> = {
  idle: 'from-slate-500 to-slate-600',
  analyzing: 'from-cyan-500 to-blue-500',
  correctness: 'from-blue-500 to-purple-500',
  hallucination: 'from-purple-500 to-pink-500',
  computing: 'from-pink-500 to-orange-500',
  generating: 'from-emerald-500 to-teal-500',
  complete: 'from-emerald-500 to-green-500',
};

const allStages = [
  { stage: 'analyzing' as EvaluationStage, label: 'Analyzing Response' },
  { stage: 'correctness' as EvaluationStage, label: 'Checking Correctness' },
  { stage: 'hallucination' as EvaluationStage, label: 'Detecting Hallucinations' },
  { stage: 'computing' as EvaluationStage, label: 'Computing Scores' },
  { stage: 'generating' as EvaluationStage, label: 'Generating Report' },
];

export function EvaluationLoadingOverlay() {
  const { currentStage, isEvaluating } = useEvaluation();

  if (!isEvaluating) return null;

  const Icon = stageIcons[currentStage.stage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 animate-fade-in-scale">
        {/* Main Spinner */}
        <div className="relative w-40 h-40 mx-auto mb-10">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse" />

          {/* Background circles */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-700/50" />
          <div className="absolute inset-4 rounded-full border border-slate-700/30" />

          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-400 spin-slow" />
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent border-b-purple-400 border-l-pink-400 spin-slow"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />

          {/* Center icon */}
          <div className="absolute inset-8 rounded-full bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stageColors[currentStage.stage]} transition-all duration-500`}>
              <Icon size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Current Stage Label */}
        <h2 className="text-2xl font-semibold text-white mb-3">
          {currentStage.label || 'Initializing...'}
        </h2>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span>{currentStage.progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${stageColors[currentStage.stage]} transition-all duration-500 ease-out`}
              style={{ width: `${currentStage.progress}%` }}
            />
          </div>
        </div>

        {/* Stage Steps */}
        <div className="flex justify-center gap-2 mb-6">
          {allStages.map((s, index) => {
            const currentIndex = allStages.findIndex((item) => item.stage === currentStage.stage);
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div
                key={s.stage}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={16} />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-cyan-400' : 'border-slate-600'}`} />
                )}
                <span className="text-sm font-medium hidden sm:inline">{s.label.replace('...', '')}</span>
              </div>
            );
          })}
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
