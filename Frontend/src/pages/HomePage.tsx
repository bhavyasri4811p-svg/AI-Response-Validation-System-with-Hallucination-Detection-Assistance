import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  FileQuestion,
  Brain,
  Shield,
  Zap,
  Target,
  FileText,
  ArrowRight,
  Star,
  CheckCircle2,
  Download,
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    { icon: Target, label: 'Correctness', desc: 'Verify factual accuracy of responses', color: 'from-cyan-500 to-blue-500' },
    { icon: FileQuestion, label: 'Relevance', desc: 'Measure alignment with questions', color: 'from-blue-500 to-purple-500' },
    { icon: Shield, label: 'Faithfulness', desc: 'Check adherence to source data', color: 'from-purple-500 to-pink-500' },
    { icon: FileText, label: 'Completeness', desc: 'Assess comprehensive coverage', color: 'from-emerald-500 to-teal-500' },
    { icon: Zap, label: 'Fluency', desc: 'Evaluate readability and flow', color: 'from-yellow-500 to-orange-500' },
    { icon: Brain, label: 'Hallucination', desc: 'Detect fabricated claims', color: 'from-red-500 to-pink-500' },
  ];

  const highlights = [
    'Industry-leading accuracy metrics',
    'Real-time hallucination detection',
    'Comprehensive quality reports',
    'Multi-framework support',
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-cyan" style={{ width: '600px', height: '600px', top: '-200px', left: '-100px' }} />
      <div className="bg-glow bg-glow-purple" style={{ width: '500px', height: '500px', bottom: '-150px', right: '-100px' }} />
      <div className="bg-glow bg-glow-blue" style={{ width: '400px', height: '400px', top: '40%', right: '10%' }} />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 mb-8 backdrop-blur-sm">
            <Sparkles size={18} className="text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">AI-Powered Quality Assessment</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white">AI Response</span>
            <br />
            <span className="gradient-text">Quality Evaluator</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Evaluate AI-generated responses using comprehensive quality metrics.
            Detect hallucinations, measure accuracy, and ensure reliability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="group button-gradient px-10 py-5 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3"
            >
              <PlayCircle size={24} />
              Start Evaluation
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="button-secondary px-10 py-5 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3"
            >
              <FileQuestion size={24} />
              About Project
            </button>
          </div>

          {/* Download Project ZIP */}
          <a
            href="/project-download.zip"
            download="project-download.zip"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white font-medium transition-all duration-300 backdrop-blur-sm mb-12"
          >
            <Download size={20} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            Download Project ZIP
          </a>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-6">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-slate-500 text-sm uppercase tracking-widest">
              <Star size={14} className="text-cyan-400" />
              <span>Evaluation Metrics</span>
              <Star size={14} className="text-cyan-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className="glass-card rounded-2xl p-5 lg:p-6 text-center hover-scale group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">{feature.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl mx-auto mt-20">
          <div className="glass-card-highlight rounded-3xl p-8 lg:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">6</div>
                <div className="text-slate-400 text-sm">Evaluation Metrics</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">3</div>
                <div className="text-slate-400 text-sm">Framework Options</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">95%</div>
                <div className="text-slate-400 text-sm">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">&lt;2s</div>
                <div className="text-slate-400 text-sm">Evaluation Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="w-full max-w-4xl mx-auto mt-16 text-center">
          <div className="glass-card rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Ready to evaluate your AI responses?
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Start your evaluation journey today and ensure your AI generates accurate,
                reliable, and high-quality content.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="button-gradient px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-3"
              >
                <Brain size={22} />
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
