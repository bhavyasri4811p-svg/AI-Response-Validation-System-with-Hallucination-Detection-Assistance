import React from 'react';
import { BookOpen, FileText, Upload, Search, FolderOpen, Database, Info, CheckCircle } from 'lucide-react';

const features = [
  { icon: CheckCircle, text: 'Faithfulness - Does the AI accurately reflect source material?', color: 'text-cyan-400' },
  { icon: CheckCircle, text: 'Hallucination Detection - Identify unsupported claims', color: 'text-purple-400' },
  { icon: CheckCircle, text: 'Context Relevance - Verify retrieved context quality', color: 'text-emerald-400' },
];

export function KnowledgeBasePage() {
  return (
    <div className="relative overflow-hidden animate-fade-in-up">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
      <div className="bg-glow bg-glow-purple" style={{ width: '300px', height: '300px', bottom: '20%', right: '-50px' }} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500">
          <BookOpen size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Knowledge Base</h1>
          <p className="text-slate-400">Manage documents for RAG evaluation</p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Upload Section */}
        <div className="glass-card rounded-3xl p-8 hover:border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <Upload size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Upload Documents</h2>
          </div>

          <div className="border-2 border-dashed border-slate-600 hover:border-cyan-500/50 rounded-2xl p-12 text-center transition-all cursor-pointer group">
            <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 group-hover:bg-cyan-500/10 transition-colors mb-5">
              <FolderOpen size={48} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-slate-300 text-lg mb-2 font-medium">Drag and drop files here</p>
            <p className="text-slate-500">or click to browse</p>
            <div className="flex justify-center gap-3 mt-4">
              <span className="badge badge-cyan text-xs">PDF</span>
              <span className="badge badge-purple text-xs">TXT</span>
            </div>
            <input type="file" className="hidden" accept=".pdf,.txt" multiple />
          </div>
        </div>

        {/* Search */}
        <div className="glass-card rounded-3xl p-6 hover:border-cyan-500/30">
          <div className="relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              className="input-field pl-14"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="glass-card rounded-3xl p-8 hover:border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <FileText size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Documents</h2>
          </div>

          <div className="text-center py-16">
            <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 mb-5 animate-float">
              <FileText size={48} className="text-slate-500" />
            </div>
            <p className="text-slate-400 mb-2">No documents uploaded yet</p>
            <p className="text-slate-500 text-sm">
              Upload documents to build your knowledge base for evaluation
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card-highlight rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Info size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">About Knowledge Base</h2>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">
            The knowledge base stores documents that can be used for RAG (Retrieval-Augmented
            Generation) evaluation. When evaluating AI responses, source documents help assess:
          </p>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-400">
                <feature.icon size={18} className={feature.color} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-start gap-3">
              <Database size={18} className="text-cyan-400 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Documents are processed and chunked into smaller segments for efficient retrieval
                and comparison. This enables semantic search and similarity matching during evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
