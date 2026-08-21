import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  BookOpen,
  Settings,
  Info,
  BrainCircuit,
  Menu,
  X,
  ChevronRight,
  Table,
  FileCheck,
  Files,
} from 'lucide-react';
const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "View evaluation analytics",
  },
  {
    path: "/single",
    label: "Single Evaluation",
    icon: FileCheck,
    description: "Evaluate one AI response",
  },
  {
    path: "/batch",
    label: "Batch Evaluation",
    icon: Files,
    description: "Evaluate multiple responses",
  },
  {
    path: "/history",
    label: "History",
    icon: History,
    description: "Past evaluations",
  },
  {
    path: "/knowledge",
    label: "Knowledge Base",
    icon: BookOpen,
    description: "Manage documents",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Configure preferences",
  },
  {
    path: "/about",
    label: "About",
    icon: Info,
    description: "Project details",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl glass-card text-cyan-400 hover:border-cyan-500/30 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-out lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full glass-card rounded-none lg:rounded-r-3xl flex flex-col p-5 lg:p-6 border-r lg:border-r-0 border-slate-700/30">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-4 px-3 py-5 mb-8 group" onClick={() => setIsOpen(false)}>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 group-hover:scale-105 transition-transform duration-300 animate-pulse-glow">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AI Evaluator</h1>
              <p className="text-xs text-slate-500 font-medium">Quality Assessment</p>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'sidebar-link active'
                      : 'sidebar-link'
                  }`
                }
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors duration-300 ${
                    'bg-slate-800/50'
                  } group-hover:bg-cyan-500/10`}>
                    <item.icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div>
                    <span className="font-medium block">{item.label}</span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-700/30">
            <div className="px-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Online</span>
              </div>
              <p className="text-[10px] text-slate-600">
                AI Response Quality Evaluator v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
