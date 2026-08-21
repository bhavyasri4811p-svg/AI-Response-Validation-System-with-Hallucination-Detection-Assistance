import { useMemo, useState } from "react";
import axios from "axios";
import { useEvaluation } from '../../store/EvaluationContext';

interface Result {
  question: string;
  response?: string;
  reference?: string;
  relevance: string;
  accuracy: string;
  hallucination: string;
  completeness: string;

  verdict: {
    overall_score: number;
    verdict: string;
    reason: string;
  };
}

interface Summary {
  total: number;
  average_score: number;
  pass: number;
  needs_improvement: number;
  fail: number;
}

const extractScore = (value: string | number | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

function BatchEvaluation() {
  const { addHistoryItems } = useEvaluation();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const matchQuestion = item.question
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchVerdict =
        filter === "ALL"
          ? true
          : item.verdict.verdict === filter;

      return matchQuestion && matchVerdict;
    });
  }, [results, search, filter]);

  const uploadCSV = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/batch_evaluate",
        formData
      );

      const batchResults = response.data.results;
      const historyItems = batchResults.map((item: Result, index: number) => {
        const relevance = extractScore(item.relevance);
        const accuracy = extractScore(item.accuracy);
        const hallucination = extractScore(item.hallucination);
        const completeness = extractScore(item.completeness);

        const overallScore = Number(item.verdict.overall_score) || 0;
        const hallucinationLevel =
          hallucination <= 2
            ? 'Low'
            : hallucination <= 6
            ? 'Medium'
            : 'High';

        const batchId = `${item.question}|${item.response ?? ''}|${item.reference ?? ''}|${item.verdict.verdict}|${item.verdict.overall_score}|${index}`;

        return {
          id: batchId,
          question: item.question,
          aiResponse: item.response ?? 'Not Provided',
          referenceAnswer: item.reference ?? 'Not Provided',
          sourceDocument: undefined,
          metrics: {
            correctness: accuracy * 10,
            relevance: relevance * 10,
            faithfulness: 100,
            completeness: completeness * 10,
            fluency: 100,
            hallucinationRisk: hallucination * 10,
            overallScore,
          },
          verdict: {
            overall_score: item.verdict.overall_score,
            verdict: item.verdict.verdict,
            summary: item.verdict.reason || 'Batch evaluation result',
          },
          hallucinationLevel,
          suggestions: [item.relevance, item.accuracy, item.hallucination, item.completeness],
          recommendations: ['Batch evaluation loaded from CSV'],
          evaluatedAt: new Date(),
        };
      });

      setResults(batchResults);
      setSummary(response.data.summary);
      addHistoryItems(historyItems);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.detail ??
          "Failed to evaluate the uploaded CSV."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-8 animate-fade-in">
    {/* Header */}
    <div className="glass-card rounded-3xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Batch Evaluation
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Upload a CSV file to evaluate multiple AI responses at once.
          </p>
        </div>

        <div className="hidden lg:flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
          <span className="text-5xl">📊</span>
        </div>
      </div>
    </div>

    {/* Upload Card */}
    <div className="glass-card rounded-3xl p-8">

      <h2 className="text-2xl font-semibold text-white mb-6">
        Upload CSV File
      </h2>

      <div className="border-2 border-dashed border-cyan-500/40 rounded-2xl p-10 text-center hover:border-cyan-400 transition-all">

        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
          className="mb-5"
        />

        {file && (
          <div className="mt-2 text-green-400 font-medium">
            Selected File :
            <span className="text-white ml-2">
              {file.name}
            </span>
          </div>
        )}

        <button
          onClick={uploadCSV}
          disabled={loading}
          className="mt-8 button-gradient px-10 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? "Evaluating..." : "Evaluate CSV"}
        </button>

      </div>
    </div>

    {errorMessage && (
      <div className="glass-card rounded-2xl p-4 bg-red-500/10 border border-red-500/20 text-red-100">
        {errorMessage}
      </div>
    )}

    {/* Summary Cards */}

    {summary && (

      <div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Evaluation Summary</h2>
            <p className="text-slate-400 text-sm">Review the batch results below after evaluation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-slate-400">Total</p>
            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {summary.total}
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-slate-400">Average Score</p>
            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              {summary.average_score}%
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-slate-400">PASS</p>
            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {summary.pass}
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-slate-400">
              Needs Improvement
            </p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {summary.needs_improvement}
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-slate-400">FAIL</p>
            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {summary.fail}
            </h2>
          </div>

        </div>

      </div>

    )}

    {/* Results Section */}

{results.length > 0 && (
  <div className="glass-card rounded-3xl p-8">

    <h2 className="text-3xl font-bold text-white mb-8">
      Evaluation Results
    </h2>
    <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

  <input
    type="text"
    placeholder="Search Question..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="input-field lg:w-96"
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="input-field w-56"
  >
    <option value="ALL">All Verdicts</option>
    <option value="PASS">PASS</option>
    <option value="FAIL">FAIL</option>
    <option value="NEEDS IMPROVEMENT">
      Needs Improvement
    </option>
  </select>

</div>
    <div className="overflow-x-auto rounded-2xl">

      <table className="min-w-full text-sm">

        <thead>

          <tr className="bg-slate-800 text-cyan-400">

            <th className="px-6 py-4 text-left">Question</th>

            <th className="px-6 py-4 text-center">Relevance</th>

            <th className="px-6 py-4 text-center">Accuracy</th>

            <th className="px-6 py-4 text-center">Hallucination</th>

            <th className="px-6 py-4 text-center">Completeness</th>

            <th className="px-6 py-4 text-center">Overall</th>

            <th className="px-6 py-4 text-center">Verdict</th>

          </tr>

        </thead>

        <tbody>

          {filteredResults.map((row, index) => (

            <tr
              key={index}
              className="border-b border-slate-700 hover:bg-slate-800/40 transition"
            >

              <td className="px-6 py-6 font-medium text-white max-w-xs">
                {row.question}
              </td>

              <td className="px-6 py-6">

                <div className="bg-blue-500/10 rounded-xl p-3">

                  <p className="text-blue-400 font-semibold mb-2">
                    Relevance
                  </p>

                  <p className="text-slate-300 text-xs whitespace-pre-wrap">
                    {row.relevance}
                  </p>

                </div>

              </td>

              <td className="px-6 py-6">

                <div className="bg-green-500/10 rounded-xl p-3">

                  <p className="text-green-400 font-semibold mb-2">
                    Accuracy
                  </p>

                  <p className="text-slate-300 text-xs whitespace-pre-wrap">
                    {row.accuracy}
                  </p>

                </div>

              </td>

              <td className="px-6 py-6">

                <div className="bg-red-500/10 rounded-xl p-3">

                  <p className="text-red-400 font-semibold mb-2">
                    Hallucination
                  </p>

                  <p className="text-slate-300 text-xs whitespace-pre-wrap">
                    {row.hallucination}
                  </p>

                </div>

              </td>

              <td className="px-6 py-6">

                <div className="bg-purple-500/10 rounded-xl p-3">

                  <p className="text-purple-400 font-semibold mb-2">
                    Completeness
                  </p>

                  <p className="text-slate-300 text-xs whitespace-pre-wrap">
                    {row.completeness}
                  </p>

                </div>

              </td>

              <td className="px-6 py-6 text-center">

                <div className="text-3xl font-bold text-cyan-400">

                  {row.verdict.overall_score}%

                </div>

              </td>

              <td className="px-6 py-6 text-center">

                {row.verdict.verdict === "PASS" && (

                  <span className="px-5 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold">
                    PASS
                  </span>

                )}

                {row.verdict.verdict === "FAIL" && (

                  <span className="px-5 py-2 rounded-full bg-red-500/20 text-red-400 font-semibold">
                    FAIL
                  </span>

                )}

                {row.verdict.verdict === "NEEDS IMPROVEMENT" && (

                  <span className="px-5 py-2 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
                    NEEDS IMPROVEMENT
                  </span>

                )}

                <p className="text-xs text-slate-400 mt-4 whitespace-pre-wrap text-left">
                  {row.verdict.reason}
                </p>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
)}

  </div>
);
}

export default BatchEvaluation;