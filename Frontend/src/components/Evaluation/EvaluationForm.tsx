import React, { useState, useRef } from 'react';
import { useEvaluation } from '../../store/EvaluationContext';
import { FileUp, Send, X, FileText, Sparkles } from 'lucide-react';

export function EvaluationForm() {
  const { evaluate, settings } = useEvaluation();
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [sourceDocument, setSourceDocument] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setSourceDocument(file);
    }
  };

  const removeFile = () => {
    setSourceDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !aiResponse.trim()) return;

    await evaluate({
      question: question.trim(),
      aiResponse: aiResponse.trim(),
      referenceAnswer: referenceAnswer.trim() || undefined,
      sourceDocument,
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 lg:p-10">
      {/* Framework Badge */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-cyan-400" />
          <span className="text-sm text-slate-400">Framework:</span>
          <span className="badge badge-cyan text-xs">{settings.framework}</span>
        </div>
        <div className="text-xs text-slate-500">
          All fields marked <span className="text-red-400">*</span> are required
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Question */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Question
            <span className="text-red-400">*</span>
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question that was asked to the AI..."
            className="input-field h-28 resize-none"
            required
          />
        </div>

        {/* AI Response */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            AI Generated Response
            <span className="text-red-400">*</span>
          </label>
          <textarea
            value={aiResponse}
            onChange={(e) => setAiResponse(e.target.value)}
            placeholder="Paste the AI-generated response here..."
            className="input-field h-44 resize-none"
            required
          />
        </div>

        {/* Reference Answer */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Reference Answer
            <span className="badge badge-purple text-xs ml-2">Optional</span>
          </label>
          <textarea
            value={referenceAnswer}
            onChange={(e) => setReferenceAnswer(e.target.value)}
            placeholder="Provide the correct ground truth answer for comparison..."
            className="input-field h-28 resize-none"
          />
        </div>

        {/* Source Document Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Source Document
            <span className="badge badge-emerald text-xs ml-2">PDF or TXT</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {sourceDocument ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <FileText size={20} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-emerald-300 font-medium">{sourceDocument.name}</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(sourceDocument.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 rounded-xl border-2 border-dashed border-slate-600 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800/50 group-hover:bg-cyan-500/10 transition-colors">
                  <FileUp size={24} className="transition-transform group-hover:scale-110" />
                </div>
                <span className="font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-slate-500">PDF or TXT files only</span>
              </div>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!question.trim() || !aiResponse.trim()}
          className="w-full group button-gradient py-5 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Send size={22} className="transition-transform group-hover:translate-x-1" />
          Evaluate Response
        </button>
      </form>
    </div>
  );
}
