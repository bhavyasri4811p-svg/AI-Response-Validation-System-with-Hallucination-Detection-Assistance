import React from 'react';
import {
  BrainCircuit,
  Database,
  Zap,
  Target,
  FileSearch,
  BookOpen,
  Shield,
  Network,
  Layers,
  Cpu,
  CheckCircle2,
  Award,
  Rocket,
} from 'lucide-react';

const concepts = [
  {
    icon: BrainCircuit,
    title: 'LLM Evaluation',
    description:
      'Large Language Model evaluation assesses the quality, accuracy, and safety of AI-generated responses. Our system uses multiple metrics to provide comprehensive analysis.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Database,
    title: 'RAG (Retrieval-Augmented Generation)',
    description:
      'RAG combines information retrieval with text generation. It retrieves relevant documents from a knowledge base and uses them to generate accurate, grounded responses.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: Target,
    title: 'TruthfulQA',
    description:
      'TruthfulQA is a benchmark designed to measure how truthful AI models are. It tests whether models can avoid generating false answers and common misconceptions.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileSearch,
    title: 'SQuAD (Stanford Question Answering Dataset)',
    description:
      'SQuAD is a reading comprehension dataset used to evaluate question answering systems. It tests the ability to extract precise answers from given passages.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Network,
    title: 'Embeddings',
    description:
      'Embeddings are dense vector representations of text that capture semantic meaning. They enable similarity comparisons and are fundamental to RAG systems.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Cpu,
    title: 'Vector Database',
    description:
      'Vector databases store and efficiently search through embeddings. They enable fast similarity-based retrieval of relevant documents for RAG applications.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'RAGAS Framework',
    description:
      'RAGAS is a framework for evaluating RAG applications. It measures faithfulness, answer relevancy, context precision, and context recall.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Shield,
    title: 'TruLens',
    description:
      'TruLens is an evaluation toolkit for LLM apps. It provides tools to assess groundedness, context relevance, and answer quality in RAG systems.',
    color: 'from-red-500 to-orange-500',
  },
];

const features = [
  { icon: Target, title: 'Multi-Metric Analysis', desc: '6 key evaluation dimensions' },
  { icon: BookOpen, title: 'Flexible Frameworks', desc: 'RAGAS, TruLens, Custom' },
  { icon: Database, title: 'Source Integration', desc: 'PDF and TXT support' },
  { icon: Shield, title: 'Hallucination Detection', desc: 'Advanced risk analysis' },
];

export function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '500px', height: '500px', top: '-150px', left: '-100px' }} />
      <div className="bg-glow bg-glow-purple" style={{ width: '400px', height: '400px', bottom: '10%', right: '-50px' }} />

      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 mb-8 animate-pulse-glow">
            <Zap size={56} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            About This Project
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A comprehensive AI response quality evaluation system designed to assess and improve
            the reliability of AI-generated content.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card rounded-3xl p-8 lg:p-10 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <Rocket size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">
            As AI systems become increasingly integrated into critical applications, ensuring the
            quality and reliability of their outputs is paramount. This evaluation system provides
            objective metrics to assess AI responses, helping developers build more trustworthy AI
            applications. By analyzing factors like factual correctness, hallucination detection,
            and response completeness, we enable continuous improvement of AI systems.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 text-center hover:border-cyan-500/30">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
                <feature.icon size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Why It Matters */}
        <div className="glass-card-highlight rounded-3xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Award size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Why Evaluation Matters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Build user trust in AI systems',
              'Reduce misinformation and errors',
              'Improve model performance over time',
              'Meet compliance and safety standards',
              'Enable objective quality benchmarks',
              'Identify and fix hallucination issues',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={18} className="text-cyan-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <BrainCircuit size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Key Concepts</h2>
              <p className="text-slate-400">Understanding the technologies behind AI evaluation</p>
            </div>
          </div>

          <div className="grid gap-6">
            {concepts.map((concept, index) => (
              <div
                key={concept.title}
                className="glass-card rounded-2xl p-6 hover:border-cyan-500/30 group"
              >
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${concept.color} flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <concept.icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">{concept.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{concept.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="glass-card rounded-3xl p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Built with Modern Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'RAGAS', 'TruLens'].map((tech) => (
              <span key={tech} className="badge badge-cyan">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-slate-500 mt-6 text-sm">
            Designed for seamless integration into AI development workflows.
          </p>
        </div>
      </div>
    </div>
  );
}
