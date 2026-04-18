import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Image as ImageIcon, Settings, FileText, LayoutGrid, 
  Award, CheckCircle2, ChevronRight, Plus, Download, 
  Star, TrendingUp, Calendar, ClipboardList, Search, Trash2, Camera, LogOut
} from 'lucide-react';

// --- モックデータ（LocalStorageがない場合の初期データ） ---
const initialStudents = [
  { id: 1, name: '1カナミ', points: 33, lastLog: '色のコントラストについて', avatar: 'https://i.pravatar.cc/150?u=kanami' },
  { id: 2, name: '2ソウタ', points: 21, lastLog: 'プログラミングの基礎', avatar: 'https://i.pravatar.cc/150?u=souta' },
  { id: 3, name: '3アヤノ', points: 45, lastLog: 'デザインの4原則', avatar: 'https://i.pravatar.cc/150?u=ayano' },
  { id: 4, name: '4エイト', points: 12, lastLog: '', avatar: 'https://i.pravatar.cc/150?u=eito' },
  { id: 5, name: '5ミライ', points: 28, lastLog: '考え方の整理法', avatar: 'https://i.pravatar.cc/150?u=mirai' },
];

const App = () => {
  // --- 状態管理 ---
  const [userMode, setUserMode] = useState('先生'); // 先生 or 児童
  const [teacherView, setTeacherView] = useState('ボード'); // ボード or ギャラリー
  const [selectedStudentId, setSelectedStudentId] = useState(1); // 児童モード時に誰としてログインするか
  
  // 児童データ（LocalStorageで管理。1040エラーを完全に回避）
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class-management-final');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // データの保存
  useEffect(() => {
    localStorage.setItem('class-management-final', JSON.stringify(students));
  }, [students]);

  // 現在ログイン中の児童データ（児童モード用）
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // ポイント増減（先生用機能）
  const updatePoints = (id, amount) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, points: Math.max(0, s.points + amount) } : s
    ));
  };

  // --- 再用コンポーネント: アクションバー（先生用） ---
  const ActionActionBar = () => (
    <div className="flex flex-wrap gap-3 mb-10 justify-end">
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-indigo-600 shadow-sm"><Download className="w-4 h-4"/>データ出力</button>
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-600 shadow-sm"><Settings className="w-4 h-4"/>設定</button>
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-600 shadow-sm"><Users className="w-4 h-4"/>名簿</button>
      <button 
        onClick={() => setTeacherView(teacherView === 'ギャラリー' ? 'ボード' : 'ギャラリー')}
        className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all ${teacherView === 'ギャラリー' ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white border border-orange-500 text-orange-500 shadow-sm'}`}
      >
        <LayoutGrid className="w-4 h-4"/>ギャラリー
      </button>
      <button className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-200"><Award className="w-4 h-4"/>評価</button>
    </div>
  );

  // --- 画面1: 先生：ポイント・ボード ---
  const TeacherBoard = () => (
    <div className="space-y-6">
      <ActionActionBar />
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
              <th className="px-10 py-6">氏名</th>
              <th className="px-10 py-6 text-center">累積PT</th>
              <th className="px-10 py-6">最新ログ</th>
              <th className="px-10 py-6 text-right">ポイント操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map(s => (
              <tr key={s.id} className="group hover:bg-indigo-50/50 transition-colors">
                <td className="px-10 py-6 flex items-center gap-4">
                  <img src={s.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-100" />
                  <span className="font-bold text-slate-700 text-lg">{s.name}</span>
                </td>
                <td className="px-10 py-6 text-center">
                  <span className="text-3xl font-black text-blue-600 w-20 inline-block">{s.points}</span>
                </td>
                <td className="px-10 py-6 text-slate-500 text-sm font-medium">{s.lastLog || '---'}</td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => updatePoints(s.id, -1)} className="w-9 h-9 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold">-1</button>
                    <button onClick={() => updatePoints(s.id, 1)} className="w-9 h-9 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-100 font-bold">+</button>
                    <button onClick={() => updatePoints(s.id, 5)} className="px-4 h-9 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-100 font-bold text-xs">+5</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- 画面2: 先生：ギャラリー ---
  const GalleryView = () => (
    <div className="space-y-6">
      <ActionActionBar />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {students.map(s => (
          <div key={s.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group">
            <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] mb-4 flex flex-col items-center justify-center text-slate-200 group-hover:bg-indigo-50 border border-slate-100">
              <Camera className="w-16 h-16 mb-2 opacity-50" />
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">No Log Image</span>
            </div>
            <div className="flex items-center gap-3 px-1">
              <img src={s.avatar} alt="" className="w-7 h-7 rounded-full" />
              <p className="text-sm font-bold text-slate-600">{s.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- 画面3: 児童：ミッション＆チケット ---
  const StudentView = () => (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* ログイン・シミュレーション（デバッグ用） */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between text-sm">
        <label className="font-bold text-slate-500">ログイン中:</label>
        <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(Number(e.target.value))} className="bg-slate-100 px-4 py-2 rounded-lg font-bold outline-none">
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* チケット・進捗カード */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1.5">Next Ticket</p>
              <h2 className="text-5xl font-black tracking-tighter">累計 <span className="text-6xl">{currentStudent.points}</span> Pt</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-black bg-white/20 px-5 py-2.5 rounded-2xl inline-block">{currentStudent.points % 50} / 50 Pt</p>
              <p className="text-xs font-bold opacity-60 mt-1">（あと {50 - (currentStudent.points % 50)} Ptでチケット）</p>
            </div>
          </div>
          <div className="h-5 bg-black/20 rounded-full overflow-hidden border-2 border-white/10 p-0.5">
            <div className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-500" style={{ width: `${(currentStudent.points % 50) / 50 * 100}%` }}></div>
          </div>
        </div>
        <Star className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
      </div>

      {/* 今週のミッション */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-emerald-600 text-2xl font-black flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7" /> 今週のミッション
          </h3>
          <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider">0 / 4 達成</span>
        </div>
        <div className="space-y-4">
          {[
            { text: '自学ログを1回投稿する', done: false },
            { text: '友達の作品にスターを送る', done: false },
            { text: '3日連続でログインする', done: false },
            { text: '新しいカテゴリーを作成する', done: false }
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 transition-colors border border-slate-100/50">
              <span className="font-bold text-slate-700 text-lg">{m.text}</span>
              <div className={`w-9 h-9 rounded-full border-4 shadow-inner flex items-center justify-center ${m.done ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-white border-slate-100 text-slate-200'}`}>
                {m.done && <CheckCircle2 className="w-5 h-5" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-32">
      {/* --- 画像再現: 紫のstickyヘッダー --- */}
      <header className="bg-[#4e46e5] text-white p-4 sticky top-0 z-50 shadow-xl shadow-indigo-900/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter">自学デザイン・ログ</h1>
          </div>

          {/* モード切り替え（画像通りのスタイル） */}
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setUserMode('先生')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '先生' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              先生
            </button>
            <button 
              onClick={() => setUserMode('児童')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '児童' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              児童
            </button>