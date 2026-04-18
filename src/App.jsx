import React, { useState, useEffect } from 'react';
import { 
  Users, Image as ImageIcon, Settings, FileText, LayoutGrid, 
  Award, CheckCircle2, ChevronRight, Plus, Download, 
  Star, TrendingUp, Calendar, ClipboardList, Search, Trash2, Camera, Lock, ChevronLeft
} from 'lucide-react';

const App = () => {
  // --- 基本状態 ---
  const [userMode, setUserMode] = useState('先生');
  const [isAuth, setIsAuth] = useState(false);
  const [view, setView] = useState('ボード'); // ボード, ギャラリー, 採点, カレンダー
  const [modal, setModal] = useState(null); // password, mission-settings, roster-edit
  const [passInput, setPassInput] = useState('');

  // 児童データ
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class-log-final-v2');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: '1カナミ', points: 33, grade: 'B' },
      { id: 2, name: '2ソウタ', points: 21, grade: 'B' },
      { id: 3, name: '3アヤノ', points: 45, grade: 'A' },
      { id: 4, name: '4エイト', points: 12, grade: 'B' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('class-log-final-v2', JSON.stringify(students));
  }, [students]);

  // パスワード認証 (image_e0f083)
  const handleAuth = () => {
    if (passInput === '1234') { // 仮のパスワード
      setIsAuth(true);
      setModal(null);
      setPassInput('');
    } else {
      alert('パスワードが違います');
    }
  };

  // --- コンポーネント群 ---

  // 1. パスワードモーダル (image_e0f083)
  const PasswordModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-8">先生用パスワード</h2>
          <input 
            type="password" 
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Password" 
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 mb-8 text-center"
          />
          <div className="flex gap-4 w-full">
            <button onClick={() => {setUserMode('児童'); setModal(null)}} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">戻る</button>
            <button onClick={handleAuth} className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200">認証</button>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. カレンダー・アーカイブ (image_e1435c)
  const CalendarView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-indigo-600 flex items-center gap-2 italic">
          <Calendar className="w-7 h-7" /> スタディ・アーカイブ
        </h2>
        <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100">
          <ChevronLeft className="w-5 h-5 text-blue-500" />
          <span className="font-black text-slate-700">2026年 4月</span>
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </div>
        <button onClick={() => setView('ボード')} className="text-indigo-400 font-bold text-sm flex items-center gap-1">← もどる</button>
      </div>
      <div className="bg-[#4e46e5] rounded-[2.5rem] p-1 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 bg-[#4e46e5] text-white/70 text-[10px] font-bold py-4 px-2 text-center">
          {['日','月','火','水','木','金','土'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-px bg-blue-50 p-px">
          {Array.from({length: 31}).map((_, i) => {
            const day = i + 1;
            const hasActivity = [15, 16, 18].includes(day);
            return (
              <div key={i} className="bg-[#fdfdf3] aspect-[4/3] p-3 relative group hover:bg-white transition-colors">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${hasActivity ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>{day}</span>
                {hasActivity && <div className="absolute bottom-3 right-3 flex gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div><div className="w-2 h-2 rounded-full bg-amber-400"></div></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 3. フィードバック・採点 (image_e14316, image_e14339)
  const GradingView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
        <Award className="w-8 h-8 text-indigo-600" /> フィードバック・センター
      </h2>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
              <th className="px-10 py-6 text-left">氏名</th>
              <th className="px-10 py-6 text-left">評定</th>
              <th className="px-10 py-6 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map(s => (
              <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-6 font-bold text-slate-700">{s.name}</td>
                <td className="px-10 py-6">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black ${s.grade === 'A' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{s.grade}</span>
                </td>
                <td className="px-10 py-6 text-right">
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">採点</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. 活動ログ投稿フォーム (image_e146d9)
  const ActivityForm = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 animate-in slide-in-from-bottom-8 duration-700">
      <p className="text-center font-bold text-slate-400 mb-10 italic">2026年4月18日 の活動ログ</p>
      <div className="space-y-8">
        <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
          <span className="text-[8px] font-black bg-white px-3 py-1 rounded-full text-slate-300 mb-4 inline-block tracking-widest uppercase">Activity 1</span>
          <select className="w-full bg-transparent p-4 font-black text-slate-700 outline-none text-lg">
            <option>ミッションを選択</option>
            <option>自学ログを1回投稿する</option>
          </select>
        </div>
        <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
          <Camera className="w-16 h-16 mb-4 opacity-50" />
          <p className="font-bold text-sm">証拠写真を撮影</p>
        </div>
        <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
          <Plus className="w-5 h-5" /> 別の学びを追加
        </button>
        <button className="w-full bg-slate-100 text-slate-300 font-black py-6 rounded-[2rem] text-xl tracking-tighter shadow-sm flex items-center justify-center gap-3">
          ログを保存する <TrendingUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-32 overflow-x-hidden text-slate-900">
      {/* 共通ヘッダー (image_e0f0c4) */}
      <header className="bg-[#4e46e5] text-white p-4 sticky top-0 z-[100] shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
            <h1 className="text-xl font-black italic tracking-tighter">自学デザイン・ログ</h1>
          </div>

          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl">
            <button onClick={() => { if(!isAuth) setModal('password'); setUserMode('先生'); }} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '先生' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60'}`}>先生</button>
            <button onClick={() => {setUserMode('児童'); setIsAuth(false)}} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '児童' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60'}`}>児童</button>
          </div>

          <div className="hidden md:flex gap-6 opacity-60">
            <button onClick={() => setView('ギャラリー')}><LayoutGrid className="w-5 h-5" /></button>
            <button onClick={() => setView('採点')}><Award className="w-5 h-5" /></button>
            <button onClick={() => setView('カレンダー')}><Calendar className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* モーダル表示制御 */}
      {modal === 'password' && <PasswordModal />}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* アクションバー (image_e0f0c4) */}
        {userMode === '先生' && isAuth && (
          <div className="flex flex-wrap gap-3 mb-10 justify-end items-center">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text