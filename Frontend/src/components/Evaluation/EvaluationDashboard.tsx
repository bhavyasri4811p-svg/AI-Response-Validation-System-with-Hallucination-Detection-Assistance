import React, { useEffect, useMemo, useState } from 'react';
import { useEvaluation } from '../../store/EvaluationContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Lightbulb,
  FileCheck,
} from 'lucide-react';

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-cyan-400';
  if (score >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

const extractScore = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const safeAverage = (total: number, count: number): number => {
  if (count === 0) return 0;
  return Math.round((total / count) * 10) / 10;
};

const normalizeVerdict = (text: string | undefined): 'PASS' | 'NEEDS IMPROVEMENT' | 'FAIL' | 'OTHER' => {
  const normalized = text?.trim().toUpperCase() ?? '';
  if (normalized.includes('PASS')) return 'PASS';
  if (normalized.includes('NEEDS')) return 'NEEDS IMPROVEMENT';
  if (normalized.includes('FAIL')) return 'FAIL';
  return 'OTHER';
};

const SummaryCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} mb-4`}>
      <TrendingUp size={20} className="text-white" />
    </div>
    <p className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-3xl font-semibold text-white">{value}</p>
  </div>
);

const MetricCard = ({
  label,
  value,
  accent,
  note,
}: {
  label: string;
  value: number;
  accent: string;
  note?: boolean;
}) => (
  <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <span className={`text-3xl font-semibold ${note ? 'text-purple-300' : 'text-white'}`}>{value}%</span>
    </div>
    {note && <p className="text-xs text-slate-500">Higher values indicate more hallucination risk; lower is better.</p>}
    <div className="mt-4 h-2 rounded-full bg-slate-800/60 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export function EvaluationDashboard({ singleOnly = false, showCurrentEvaluation = true }: { singleOnly?: boolean; showCurrentEvaluation?: boolean }) {
  const { currentEvaluation, history } = useEvaluation();
  const [verdictFilter, setVerdictFilter] = useState<'All' | 'PASS' | 'NEEDS IMPROVEMENT' | 'FAIL'>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    try {
      return history.filter((item) => {
        if (verdictFilter !== 'All') {
          return normalizeVerdict(item.verdict.verdict) === verdictFilter;
        }
        return true;
      });
    } catch (err) {
      setError('Unable to calculate dashboard metrics from history.');
      return [];
    }
  }, [history, verdictFilter]);

  const hasTimestamps = useMemo(() => history.some((item) => item.evaluatedAt != null), [history]);

  const trendData = useMemo(() => {
    if (!hasTimestamps) return [];
    return [...history]
      .map((item) => ({
        label: new Date(item.evaluatedAt).toLocaleDateString(),
        score: item.metrics.overallScore,
        timestamp: new Date(item.evaluatedAt).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [history, hasTimestamps]);

  const metricsSummary = useMemo(() => {
    const total = filteredHistory.length;
    const passCount = filteredHistory.filter((item) => normalizeVerdict(item.verdict.verdict) === 'PASS').length;
    const needsImprovementCount = filteredHistory.filter((item) => normalizeVerdict(item.verdict.verdict) === 'NEEDS IMPROVEMENT').length;
    const failCount = filteredHistory.filter((item) => normalizeVerdict(item.verdict.verdict) === 'FAIL').length;
    const totalOverall = filteredHistory.reduce((sum, item) => sum + item.metrics.overallScore, 0);
    const totalRelevance = filteredHistory.reduce((sum, item) => sum + extractScore(item.metrics.relevance), 0);
    const totalAccuracy = filteredHistory.reduce((sum, item) => sum + extractScore(item.metrics.correctness), 0);
    const totalCompleteness = filteredHistory.reduce((sum, item) => sum + extractScore(item.metrics.completeness), 0);
    const totalHallucination = filteredHistory.reduce((sum, item) => sum + extractScore(item.metrics.hallucinationRisk), 0);
    const hallucinationCount = filteredHistory.filter((item) => extractScore(item.metrics.hallucinationRisk) > 0).length;

    return {
      total,
      passCount,
      needsImprovementCount,
      failCount,
      passPercentage: total ? Math.round((passCount / total) * 100) : 0,
      needsImprovementPercentage: total ? Math.round((needsImprovementCount / total) * 100) : 0,
      failPercentage: total ? Math.round((failCount / total) * 100) : 0,
      averageOverallScore: safeAverage(totalOverall, total),
      averageRelevance: safeAverage(totalRelevance, total),
      averageAccuracy: safeAverage(totalAccuracy, total),
      averageCompleteness: safeAverage(totalCompleteness, total),
      averageHallucination: safeAverage(totalHallucination, total),
      hallucinationFrequency: total ? Math.round((hallucinationCount / total) * 100) : 0,
      hallucinationCount,
    };
  }, [filteredHistory]);

  const verdictPieData = [
    { name: 'PASS', value: metricsSummary.passCount, fill: '#22c55e' },
    { name: 'NEEDS IMPROVEMENT', value: metricsSummary.needsImprovementCount, fill: '#facc15' },
    { name: 'FAIL', value: metricsSummary.failCount, fill: '#ef4444' },
  ];

  const dimensionBarData = [
    { name: 'Relevance', value: metricsSummary.averageRelevance, fill: '#3b82f6' },
    { name: 'Accuracy', value: metricsSummary.averageAccuracy, fill: '#22c55e' },
    { name: 'Completeness', value: metricsSummary.averageCompleteness, fill: '#10b981' },
    { name: 'Hallucination Frequency', value: metricsSummary.averageHallucination, fill: '#a855f7' },
  ];

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(timer);
  }, [history.length, verdictFilter]);

  const recentEvaluations = filteredHistory.slice(0, 5);
  const showEmptyState = history.length === 0;

  const downloadPdfReport = async () => {
    setExportError(null);
    if (history.length === 0) {
      setExportError('No evaluation results available to export.');
      return;
    }

    setExporting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/export_report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results: history }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to generate PDF report.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AI_Response_Evaluation_Report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err?.message || 'Failed to generate PDF report.');
    } finally {
      setExporting(false);
    }
  };

  const handleVerdictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVerdictFilter(event.target.value as 'All' | 'PASS' | 'NEEDS IMPROVEMENT' | 'FAIL');
  };

  if (showEmptyState) {
    return (
      <div className="relative overflow-hidden">
        <div className="bg-glow bg-glow-purple" style={{ width: '400px', height: '400px', top: '20%', right: '-100px' }} />
        <div className="relative z-10 max-w-3xl mx-auto py-20 text-center animate-fade-in-up">
          <div className="glass-card rounded-3xl p-12">
            <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 mb-6 animate-float">
              <Lightbulb size={48} className="text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">No evaluation data available yet.</h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Run a single or batch evaluation to populate the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {!singleOnly && <>
      <div className="glass-card rounded-3xl p-8 animate-fade-in-up">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">Evaluation Scoring Dashboard</h1>
            <p className="text-slate-400 text-lg">Monitor AI response quality across evaluations.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-3xl p-6 border border-red-500/20 bg-red-500/5 text-red-100">
          <p className="font-semibold">Dashboard error:</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      <div className="glass-card rounded-3xl p-6 animate-fade-in-up">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Filters</h2>
            <p className="text-slate-400 text-sm">Refine dashboard results by available evaluation values.</p>
          </div>
          <button
            type="button"
            onClick={downloadPdfReport}
            disabled={history.length === 0 || exporting}
            className="button-gradient px-5 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {exporting ? 'Generating Report...' : 'Export PDF Report'}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full mt-6">
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Verdict</label>
            <select value={verdictFilter} onChange={handleVerdictChange} className="input-field w-full">
              <option value="All">All</option>
              <option value="PASS">PASS</option>
              <option value="NEEDS IMPROVEMENT">NEEDS IMPROVEMENT</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>
        </div>
        {exportError && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {exportError}
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <SummaryCard label="Total Evaluations" value={metricsSummary.total} accent="from-cyan-500 to-blue-500" />
        <SummaryCard label="PASS" value={metricsSummary.passCount} accent="from-emerald-500 to-cyan-500" />
        <SummaryCard label="NEEDS IMPROVEMENT" value={metricsSummary.needsImprovementCount} accent="from-yellow-500 to-orange-500" />
        <SummaryCard label="FAIL" value={metricsSummary.failCount} accent="from-red-500 to-pink-500" />
        <SummaryCard label="Average Overall Score" value={metricsSummary.averageOverallScore} accent="from-violet-500 to-fuchsia-500" />
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Average Relevance" value={metricsSummary.averageRelevance} accent="from-blue-500 to-cyan-500" />
        <MetricCard label="Average Accuracy" value={metricsSummary.averageAccuracy} accent="from-cyan-500 to-sky-500" />
        <MetricCard label="Average Completeness" value={metricsSummary.averageCompleteness} accent="from-emerald-500 to-teal-500" />
        <MetricCard label="Hallucination Frequency" value={metricsSummary.averageHallucination} accent="from-purple-500 to-pink-500" note />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl xl:col-span-2">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Verdict Distribution</h2>
              <p className="text-slate-400 text-sm">How evaluations are grouped by outcome.</p>
            </div>
            {loading && <span className="text-sm text-cyan-300">Updating chart...</span>}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={verdictPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {verdictPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }} itemStyle={{ color: '#f8fafc' }} />
                <Legend formatter={(value) => <span className="text-white">{value}</span>} wrapperStyle={{ color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Hallucination Frequency</h2>
          <p className="text-slate-400 mb-4">Shows how many evaluations contain hallucination or unsupported information.</p>
          <div className="w-full h-4 rounded-full bg-slate-800/60 overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${metricsSummary.hallucinationFrequency}%` }} />
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-slate-900/70 p-4 border border-white/5">
              <p className="text-sm text-slate-400">Evaluations with hallucination</p>
              <p className="text-3xl font-semibold text-white">{metricsSummary.hallucinationCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 border border-white/5">
              <p className="text-sm text-slate-400">Average hallucination risk</p>
              <p className="text-3xl font-semibold text-purple-300">{metricsSummary.averageHallucination}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Dimension Score Comparison</h2>
            <p className="text-slate-400 text-sm">Relevance, accuracy, completeness, and hallucination.</p>
          </div>
          {loading && <span className="text-sm text-cyan-300">Refreshing metrics...</span>}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dimensionBarData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }} itemStyle={{ color: '#f8fafc' }} />
              <Legend formatter={(value) => <span className="text-white">{value}</span>} wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={24}>
                {dimensionBarData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Quality Trend</h2>
            <p className="text-slate-400 text-sm">Overall score progression over time.</p>
          </div>
          {!hasTimestamps && <p className="text-slate-500 text-sm">Quality trend will be available when evaluation timestamps are recorded.</p>}
        </div>
        {hasTimestamps ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }} itemStyle={{ color: '#f8fafc' }} />
                <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl overflow-x-auto">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Evaluations</h2>
            <p className="text-slate-400 text-sm">Latest evaluation records from history.</p>
          </div>
          <span className="text-slate-500 text-sm">Showing {recentEvaluations.length} of {filteredHistory.length}</span>
        </div>
        <div className="min-w-full overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/40 text-slate-400 uppercase tracking-[0.15em] text-xs">
              <tr>
                <th className="px-4 py-4">Question</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Verdict</th>
                <th className="px-4 py-4">Relevance</th>
                <th className="px-4 py-4">Accuracy</th>
                <th className="px-4 py-4">Completeness</th>
                <th className="px-4 py-4">Hallucination</th>
              </tr>
            </thead>
            <tbody>
              {recentEvaluations.map((item) => (
                <tr key={item.id} className="border-t border-white/5 hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-4 max-w-[280px] truncate">{item.question}</td>
                  <td className={`px-4 py-4 font-semibold ${getScoreColor(item.metrics.overallScore)}`}>{item.metrics.overallScore}%</td>
                  <td className="px-4 py-4">{item.verdict.verdict}</td>
                  <td className="px-4 py-4">{item.metrics.relevance}%</td>
                  <td className="px-4 py-4">{item.metrics.correctness}%</td>
                  <td className="px-4 py-4">{item.metrics.completeness}%</td>
                  <td className="px-4 py-4">{item.metrics.hallucinationRisk}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>}

      {showCurrentEvaluation && currentEvaluation && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <FileCheck size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Evaluation Report</h2>
            </div>
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
              {Object.entries(currentEvaluation.metrics).slice(0, 5).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl bg-slate-800/30 text-center">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{key}</h3>
                  <p className={`text-2xl font-bold ${getScoreColor(value as number)}`}>{value}%</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Overall Score</h3>
                <p className={`text-4xl font-bold ${getScoreColor(currentEvaluation.metrics.overallScore)}`}>{currentEvaluation.metrics.overallScore}%</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/30">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Hallucination Level</h3>
                <p className={`text-2xl font-bold ${
                  currentEvaluation.hallucinationLevel === 'Low' ? 'text-emerald-400' :
                  currentEvaluation.hallucinationLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>{currentEvaluation.hallucinationLevel} Risk</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/30">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {currentEvaluation.recommendations.map((rec, index) => (
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
      )}
    </div>
  );
}
