import React, { useRef } from 'react';
import { useEvaluation } from '../../store/EvaluationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Target,
  FileQuestion,
  Shield,
  FileText,
  Zap,
  Brain,
  Download,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Lightbulb,
  FileCheck,
} from 'lucide-react';

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

const CircularProgress = ({ value, size = 180, strokeWidth = 14 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        {/* Background circles */}
        <circle
          className="text-slate-700/50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-slate-700/30"
          stroke="currentColor"
          strokeWidth={strokeWidth - 4}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
        {/* Glow effect */}
        <circle
          className="progress-ring-circle opacity-30"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          filter="blur(4px)"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${getScoreColor(value)}`}>{value}</span>
        <span className="text-slate-500 text-sm font-medium mt-1">Overall Score</span>
      </div>
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  delay?: number;
}) => (
  <div
    className="metric-card group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-right">
        <span className={`text-3xl font-bold ${getScoreColor(value)}`}>{value}</span>
        <span className="text-slate-500 text-lg">%</span>
      </div>
    </div>
    <h3 className="text-white font-medium mb-3">{label}</h3>
    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(value)} transition-all duration-1000 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const HallucinationBadge = ({ level, score }: { level: 'Low' | 'Medium' | 'High'; score: number }) => {
  const config = {
    Low: { color: 'badge-emerald', icon: CheckCircle, text: 'Low Risk' },
    Medium: { color: 'badge-yellow', icon: AlertTriangle, text: 'Medium Risk' },
    High: { color: 'badge-red', icon: AlertCircle, text: 'High Risk' },
  };

  const { color, icon: Icon, text } = config[level];

  return (
    <div className={`${color} inline-flex items-center gap-3 px-5 py-3 rounded-xl`}>
      <Icon size={20} />
      <span className="font-semibold">{text}</span>
      <span className="text-xs opacity-70">({score}%)</span>
    </div>
  );
};

export function EvaluationDashboard() {
  const { currentEvaluation } = useEvaluation();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!currentEvaluation) return null;

  const { metrics, hallucinationLevel, suggestions, recommendations } = currentEvaluation;

  const chartData = [
    { name: 'Correctness', value: metrics.correctness, fill: '#22d3ee' },
    { name: 'Relevance', value: metrics.relevance, fill: '#3b82f6' },
    { name: 'Faithfulness', value: metrics.faithfulness, fill: '#a855f7' },
    { name: 'Completeness', value: metrics.completeness, fill: '#10b981' },
    { name: 'Fluency', value: metrics.fluency, fill: '#eab308' },
  ];

  const downloadReport = () => {
    const reportContent = `
================================================================================
                    AI RESPONSE QUALITY EVALUATION REPORT
================================================================================
Generated: ${new Date().toLocaleString()}
Framework: RAGAS Evaluation System

--------------------------------------------------------------------------------
                              QUESTION
--------------------------------------------------------------------------------
${currentEvaluation.question}

--------------------------------------------------------------------------------
                            AI RESPONSE
--------------------------------------------------------------------------------
${currentEvaluation.aiResponse}

--------------------------------------------------------------------------------
                          REFERENCE ANSWER
--------------------------------------------------------------------------------
${currentEvaluation.referenceAnswer}

--------------------------------------------------------------------------------
                           METRIC SCORES
--------------------------------------------------------------------------------
  Correctness     : ${metrics.correctness}%
  Relevance       : ${metrics.relevance}%
  Faithfulness    : ${metrics.faithfulness}%
  Completeness    : ${metrics.completeness}%
  Fluency         : ${metrics.fluency}%

  Hallucination Risk: ${metrics.hallucinationRisk}%
  Level: ${hallucinationLevel}

--------------------------------------------------------------------------------
                           OVERALL SCORE
--------------------------------------------------------------------------------
  ${metrics.overallScore}%

--------------------------------------------------------------------------------
                           SUGGESTIONS
--------------------------------------------------------------------------------
${suggestions.map((s) => `  • ${s}`).join('\n')}

--------------------------------------------------------------------------------
                          RECOMMENDATIONS
--------------------------------------------------------------------------------
${recommendations.map((r) => `  • ${r}`).join('\n')}

================================================================================
                    END OF EVALUATION REPORT
================================================================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative space-y-8">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '400px', height: '400px', top: '10%', right: '-100px' }} />
      <div className="bg-glow bg-glow-purple" style={{ width: '300px', height: '300px', bottom: '20%', left: '-50px' }} />

      {/* Overall Score Section */}
      <div className="glass-card-highlight rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award size={28} className="text-cyan-400" />
            <h2 className="text-2xl font-semibold text-white">Overall Quality Score</h2>
          </div>
          <div className="flex justify-center">
            <CircularProgress value={metrics.overallScore} />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <MetricCard icon={Target} label="Correctness" value={metrics.correctness} color="from-cyan-500 to-cyan-600" delay={0} />
        <MetricCard icon={FileQuestion} label="Relevance" value={metrics.relevance} color="from-blue-500 to-blue-600" delay={100} />
        <MetricCard icon={Shield} label="Faithfulness" value={metrics.faithfulness} color="from-purple-500 to-purple-600" delay={200} />
        <MetricCard icon={FileText} label="Completeness" value={metrics.completeness} color="from-emerald-500 to-emerald-600" delay={300} />
        <MetricCard icon={Zap} label="Fluency" value={metrics.fluency} color="from-yellow-500 to-yellow-600" delay={400} />
      </div>

      {/* Hallucination Section */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Brain size={24} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Hallucination Detection</h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
          <HallucinationBadge level={hallucinationLevel} score={metrics.hallucinationRisk} />
          <div className="text-sm text-slate-400">
            Detection confidence: <span className="text-white font-medium">High</span>
          </div>
        </div>

        {/* Risk Level Bar */}
        <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-slate-800">
          <div
            className={`transition-all duration-500 ${hallucinationLevel === 'Low' ? 'bg-emerald-500' : 'bg-slate-700'}`}
            style={{ width: '33.33%' }}
          />
          <div
            className={`transition-all duration-500 ${hallucinationLevel === 'Medium' ? 'bg-yellow-500' : 'bg-slate-700'}`}
            style={{ width: '33.33%' }}
          />
          <div
            className={`transition-all duration-500 ${hallucinationLevel === 'High' ? 'bg-red-500' : 'bg-slate-700'}`}
            style={{ width: '33.33%' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Low Risk</span>
          <span>Medium Risk</span>
          <span>High Risk</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-semibold text-white mb-8">Metrics Comparison</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="#64748b" width={100} tick={{ fill: '#94a3b8', fontSize: 13 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                }}
                labelStyle={{ color: '#f8fafc', fontWeight: 600 }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <Lightbulb size={24} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Suggestions</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
            >
              <div className="p-1.5 rounded-full bg-cyan-500/20 mt-0.5">
                <CheckCircle size={14} className="text-cyan-400" />
              </div>
              <span className="text-slate-300 leading-relaxed">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report Section */}
      <div ref={reportRef} className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <FileCheck size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Evaluation Report</h2>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-6 py-3 rounded-xl button-secondary text-cyan-400 font-medium hover:border-cyan-500/40 transition-all"
          >
            <Download size={18} />
            Download Report
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Question</h3>
            <p className="text-white leading-relaxed">{currentEvaluation.question}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">AI Response</h3>
            <p className="text-white leading-relaxed whitespace-pre-wrap">{currentEvaluation.aiResponse}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Reference Answer</h3>
            <p className="text-white leading-relaxed whitespace-pre-wrap">{currentEvaluation.referenceAnswer}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(metrics).slice(0, 5).map(([key, value]) => (
              <div key={key} className="p-4 rounded-xl bg-slate-800/30 text-center">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{key}</h3>
                <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}%</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Overall Score</h3>
              <p className={`text-4xl font-bold ${getScoreColor(metrics.overallScore)}`}>{metrics.overallScore}%</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800/30">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Hallucination Level</h3>
              <p className={`text-2xl font-bold ${
                hallucinationLevel === 'Low' ? 'text-emerald-400' :
                hallucinationLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{hallucinationLevel} Risk</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <div className="p-1 rounded-full bg-purple-500/20 mt-1">
                    <TrendingUp size={12} className="text-purple-400" />
                  </div>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
