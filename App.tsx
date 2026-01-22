
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import VideoTable from './components/VideoTable';
import AIConsultant from './components/AIConsultant';
import ChatInterface from './components/ChatInterface';
import { INITIAL_FILES } from './constants';
import { analyzeVideoFolder, createFolderChat } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Rocket, Sparkles, Folder } from 'lucide-react';

const App: React.FC = () => {
  const [files] = useState(INITIAL_FILES);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const chatSession = useMemo(() => createFolderChat(files), [files]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [files, searchTerm]);

  const fileTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    files.forEach(f => {
      const type = f.type.split('/').pop() || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [files]);

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  const handleStartAnalysis = useCallback(async () => {
    setStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeVideoFolder(files);
      setAnalysis(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  }, [files]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <Rocket size={18} />
            </div>
            <h1 className="text-lg font-bold text-slate-900">VidiSmart AI</h1>
          </div>
          <button
            onClick={handleStartAnalysis}
            disabled={status === AnalysisStatus.LOADING}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              status === AnalysisStatus.LOADING 
                ? 'bg-slate-100 text-slate-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
            }`}
          >
            {status === AnalysisStatus.LOADING ? 'تحليل...' : 'بدء التحليل الذكي'}
            <Sparkles size={14} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                  <Folder className="text-indigo-500" />
                  مجلد: final video for social media
                </h2>
                <p className="text-slate-500 text-sm">يحتوي هذا المجلد على {files.length} ملفاً جاهزاً للإنتاج.</p>
              </div>
            </div>

            {status === AnalysisStatus.SUCCESS && analysis && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <AIConsultant result={analysis} />
              </div>
            )}

            {status === AnalysisStatus.LOADING && (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-800">جاري قراءة الملفات بعناية...</h3>
                <p className="text-slate-500 text-sm mt-2">يقوم الذكاء الاصطناعي الآن برسم خطة تسويقية لمحتواك</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-700">قائمة الملفات</h3>
                <input 
                  type="text" 
                  placeholder="بحث في الملفات..." 
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg w-48 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <VideoTable files={filteredFiles} />
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <ChatInterface chatSession={chatSession} />

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">توزيع أنواع الملفات</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {fileTypeData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
               <h4 className="font-black text-lg mb-2">نصيحة سريعة 💡</h4>
               <p className="text-sm text-indigo-100 leading-relaxed font-arabic" dir="rtl">
                 الفيديوهات التي تحتوي على "الأهرامات" تحقق تفاعلاً أكبر بنسبة 40%. جرب استخدام أداة <span className="underline font-bold">Luma AI</span> لإنشاء لقطات سينمائية من الصور الثابتة في المجلد.
               </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-20 py-8 text-center text-slate-400 text-xs border-t border-slate-200">
        © 2025 VidiSmart AI Strategy - الذكاء الاصطناعي في خدمتك
      </footer>
    </div>
  );
};

export default App;
