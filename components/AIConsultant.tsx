
import React from 'react';
import { AnalysisResult } from '../types';
import { Sparkles, CheckCircle, Smartphone, PenTool } from 'lucide-react';

// Lucide-react components (simulated for simplicity since they aren't standard library)
const IconWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-2 rounded-lg ${className}`}>
    {children}
  </div>
);

interface AIConsultantProps {
  result: AnalysisResult;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Summary */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
        <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
           Summary Analysis
        </h3>
        <p className="text-amber-800 leading-relaxed text-lg">
          {result.summary}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Themes */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Major Content Themes
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.contentThemes.map((theme, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                #{theme}
              </span>
            ))}
          </div>
        </section>

        {/* Strategy */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Social Media Strategy
          </h4>
          <p className="text-slate-600 leading-relaxed italic">
            "{result.socialMediaStrategy}"
          </p>
        </section>
      </div>

      {/* Recommended Tools */}
      <section>
        <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Best AI Smart Tools for Your Workflow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.recommendedTools.map((tool, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span className="font-bold">{i + 1}</span>
              </div>
              <h5 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h5>
              <p className="text-slate-500 text-sm mb-4">{tool.description}</p>
              <div className="mt-auto">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">Use Case</span>
                <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {tool.useCase}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIConsultant;
