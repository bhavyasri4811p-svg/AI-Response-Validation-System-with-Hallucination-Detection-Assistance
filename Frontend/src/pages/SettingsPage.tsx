import React from 'react';
import { useEvaluation } from '../store/EvaluationContext';
import { Moon, Sun, Check, Settings as SettingsIcon, Layers, Sparkles } from 'lucide-react';
import { EvaluationFramework } from '../types';

const frameworks: EvaluationFramework[] = ['RAGAS', 'TruLens', 'Custom'];

const frameworkDescriptions: Record<EvaluationFramework, { desc: string; features: string[] }> = {
  RAGAS: {
    desc: 'RAG Assessment Framework - Industry standard for evaluating RAG applications',
    features: ['Faithfulness metrics', 'Answer relevancy', 'Context precision', 'Context recall'],
  },
  TruLens: {
    desc: 'TruLens - Comprehensive evaluation toolkit for LLM applications',
    features: ['Groundedness analysis', 'Context relevance', 'Answer quality', 'Harm detection'],
  },
  Custom: {
    desc: 'Custom Framework - Define your own evaluation metrics tailored to your needs',
    features: ['Flexible metrics', 'Custom weights', 'Domain-specific', 'Extensible'],
  },
};

const frameworkColors: Record<EvaluationFramework, string> = {
  RAGAS: 'from-cyan-500 to-blue-500',
  TruLens: 'from-purple-500 to-pink-500',
  Custom: 'from-emerald-500 to-teal-500',
};

export function SettingsPage() {
  const { settings, updateSettings } = useEvaluation();

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-purple" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px' }} />

      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500">
            <SettingsIcon size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-slate-400">Configure your evaluation preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${settings.darkMode ? 'bg-cyan-500/20' : 'bg-yellow-500/20'}`}>
                  {settings.darkMode ? (
                    <Moon size={24} className="text-cyan-400" />
                  ) : (
                    <Sun size={24} className="text-yellow-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Dark Mode</h2>
                  <p className="text-slate-400 text-sm">Toggle between dark and light themes</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  settings.darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
                    settings.darkMode ? 'left-9' : 'left-1'
                  }`}
                >
                  {settings.darkMode ? (
                    <Moon size={14} className="text-cyan-500" />
                  ) : (
                    <Sun size={14} className="text-yellow-500" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Evaluation Framework */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Layers size={24} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Evaluation Framework</h2>
                <p className="text-slate-400 text-sm">Choose the evaluation framework for analyzing responses</p>
              </div>
            </div>

            <div className="space-y-3">
              {frameworks.map((framework, index) => (
                <button
                  key={framework}
                  onClick={() => updateSettings({ framework })}
                  className={`w-full p-5 rounded-xl text-left transition-all duration-300 group ${
                    settings.framework === framework
                      ? 'glass-card-highlight'
                      : 'glass-card hover:border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${frameworkColors[framework]} transition-transform group-hover:scale-105`}>
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{framework}</h3>
                        {settings.framework === framework && (
                          <span className="badge badge-cyan text-xs">Active</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{frameworkDescriptions[framework].desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {frameworkDescriptions[framework].features.map((feature) => (
                          <span key={feature} className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-slate-400">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        settings.framework === framework
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-600'
                      }`}
                    >
                      {settings.framework === framework && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Advanced Options</h2>

            <div className="space-y-1">
              {[
                { title: 'Auto-save Evaluations', desc: 'Automatically save all evaluations to history', enabled: true },
                { title: 'Detailed Reports', desc: 'Include detailed analysis in downloaded reports', enabled: true },
                { title: 'Show Suggestions', desc: 'Display improvement suggestions after evaluation', enabled: true },
                { title: 'Enable Notifications', desc: 'Show notifications when evaluation completes', enabled: false },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-slate-700/30 last:border-0">
                  <div>
                    <h3 className="text-white font-medium">{setting.title}</h3>
                    <p className="text-slate-500 text-sm">{setting.desc}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${setting.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
