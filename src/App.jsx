import React, { useState, useEffect } from 'react';
import { 
  Users, Image as ImageIcon, Settings, FileText, LayoutGrid, 
  Award, CheckCircle2, ChevronRight, Plus, Download, 
  Star, TrendingUp, Calendar, ClipboardList, Search, Trash2, Lock, ChevronLeft, ExternalLink
} from 'lucide-react';

const App = () => {
  // --- 基本状態 ---
  const [userMode, setUserMode] = useState('先生');
  const [isAuth, setIsAuth] = useState(false);
  const [view, setView] = useState('ボード'); 
  const [modal, setModal] = useState(null); 
  const [passInput, setPassInput] = useState('');

  // 児童データ (LocalStorageで管理し1040エラーを防止)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class-log-final-system');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: '1カナミ', points: 33, grade: 'B', lastLog: '色の対比' },
      { id: 2, name: '2ソウタ', points: 21, grade: 'B', lastLog: 'タイポグラフィ' },
      { id: 3, name: '3アヤノ', points: 45, grade: 'A', lastLog: '余白のルール' },
      { id: 4, name: '4エイト', points: 12, grade: 'B', lastLog: '' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('class-log-final-system', JSON.stringify(students));
  }, [students]);

  const handleAuth = () => {
    if (passInput === '1234') { // 先生用パスワード
      setIsAuth(true);
      setModal(null);
      setPassInput('');
    } else {
      alert('パスワードが違います');
    }
  };

  const updatePoints = (id, amount) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, points: Math.max(0, s.points + amount) } : s
    ));
  };

  // --- モーダル (認証) ---
  const PasswordModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-8">先生用パスワード</h2>
          <input 
            type="password" 
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Password" 
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-6 py-4 outline-none text-center mb-8"
          />
          <div className="flex gap-4 w-full">
            <button onClick={() => {setUserMode('児童'); setModal(null)}} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">戻る</button>
            <button onClick={handleAuth} className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200">認証</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-32 text-slate-900 overflow-x-hidden">
      {/* 1. 紫のヘッダー (完璧再現) */}
      <header className="bg-[#4e46e5] text-white p-4 sticky top-0 z-[100] shadow-xl shadow-indigo-900/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
            <h1 className="text-xl font-black italic tracking-tighter">自学デザイン・ログ</h1>
          </div>

          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => { if(!isAuth) setModal('password'); setUserMode('先生'); }} 
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '先生' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60'}`}
            >
              先生
            </button>
            <button 
              onClick={() => {setUserMode('児童'); setIsAuth(false)}} 
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${userMode === '児童' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60'}`}
            >
              児童
            </button>
          </div>

          <div className="hidden md:flex gap-6 opacity-60">
            <LayoutGrid className="w-5 h-5" />
            <Award className="w-5 h-5" />
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </header>

      {modal === 'password' && <PasswordModal />}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {userMode === '先生' && isAuth ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* 2. アクションボタン (配色・スタイル完璧再現) */}
            <div className="flex flex-wrap gap-3 justify-end items-center">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-indigo-600 shadow-sm">
                <Download className="w-4 h-4"/>データ出力
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-600 text-emerald-600 rounded-2xl text-xs font-bold shadow-sm">
                <Settings className="w-4 h-4"/>設定
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-indigo-600 text-indigo-600 rounded-2xl text-xs font-bold shadow-sm">
                <Users className="w-4 h-4"/>名簿
              </button>
              <button 
                onClick={() => setView('ギャラリー')} 
                className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all ${view === 'ギャラリー' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-500 text-orange-500'}`}
              >
                <LayoutGrid className="w-4 h-4"/>ギャラリー
              </button>
              <button 
                onClick={() => setView('採点')} 
                className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all ${view === '採点' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border border-indigo-600 text-indigo-600'}`}
              >
                <Award className="w-4 h-4"/>評価
              </button>
            </div>

            {/* 3. ポイントボード (累積PT強調) */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">氏名</th>
                    <th className="px-10 py-6 text-center">累積PT</th>
                    <th className="px-10 py-6">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map(s => (
                    <tr key={s.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-10 py-8 font-black text-slate-700 text-lg">{s.name}</td>
                      <td className="px-10 py-8 text-center text-3xl font-black text-blue-600">{s.points}</td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => updatePoints(s.id, 1)} className="bg-indigo-600 text-white w-10 h-10 rounded-full font-bold shadow-md hover:scale-110 transition-transform">+</button>
                          <button onClick={() => updatePoints(s.id, -1)} className="bg-white border border-slate-200 text-slate-400 w-10 h-10 rounded-full font-bold hover:text-red-500 transition-colors">-</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : userMode === '児童' ? (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* 4. 児童用：活動報告 (ロイロノート連携版) */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
              <div className="flex flex-col items-center text-center mb-10">
                <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs mb-2">Step 1: Activity</p>
                <h2 className="text-2xl font-black text-slate-800">今日の学びを記録しよう</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                  <label className="text-[10px] font-black text-slate-300 uppercase block mb-2 px-2">Mission Select</label>
                  <select className="w-full bg-transparent font-black text-slate-700 outline-none text-lg cursor-pointer">
                    <option>ミッションを選択してください</option>
                    <option>自学ログを1回投稿する (+10pt)</option>
                    <option>新しいデザインの発見 (+5pt)</option>
                  </select>
                </div>

                {/* ロイロノート誘導エリア */}
                <div className="bg-emerald-50 rounded-[2.5rem] p-8 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-emerald-700 text-center">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <ImageIcon className="w-10 h-10 text-emerald-500" />
                  </div>
                  <p className="font-black text-lg mb-2">写真はロイロノートへ！</p>
                  <p className="text-sm font-medium opacity-70 leading-relaxed mb-6">
                    「提出箱」に証拠写真を入れ終わったら、<br/>下のボタンを押してログを完了させてね。
                  </p>
                  <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100">
                    ロイロノートを開く <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <button className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] text-xl shadow-xl shadow-slate-200 mt-4 active:scale-95 transition-transform">
                  ログを保存して完了！
                </button>
              </div>
            </div>

            {/* 5. 児童用：チケット進捗バー (完璧再現) */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1.5">Next Ticket</p>
                    <h2 className="text-5xl font-black tracking-tighter">累計 33 Pt</h2>
                  </div>
                  <span className="text-sm font-black bg-white/20 px-4 py-2 rounded-2xl">33 / 50</span>
                </div>
                <div className="h-4 bg-black/20 rounded-full overflow-hidden border-2 border-white/5">
                  <div className="h-full bg-white w-[66%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                </div>
              </div>
              <Star className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-300">
            <Lock className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold">先生モードを使用するにはパスワードが必要です</p>
          </div>
        )}
      </main>

      {/* 6. 底面のフローティング・ナビ (完璧再現) */}
      {userMode === '先生' && isAuth && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl px-12 py-5 rounded-full flex gap-14 text-slate-300 z-[150] shadow-indigo-900/10">
          <button onClick={() => setView('ボード')} className={view === 'ボード' ? 'text-indigo-600 scale-125 transition-transform' : 'hover:text-slate-400'}><FileText className="w-7 h-7" /></button>
          <button onClick={() => setView('ギャラリー')} className={view === 'ギャラリー' ? 'text-indigo-600 scale-125 transition-transform' : 'hover:text-slate-400'}><LayoutGrid className="w-7 h-7" /></button>
          <button className="hover:text-slate-400"><Calendar className="w-7 h-7" /></button>
          <button onClick={() => setView('採点')} className={view === '採点' ? 'text-indigo-600 scale-125 transition-transform' : 'hover:text-slate-400'}><Award className="w-7 h-7" /></button>
          <button className="hover:scale-110 transition-transform"><Plus className="bg-indigo-600 text-white rounded-full p-2 w-10 h-10 shadow-lg" /></button>
        </nav>
      )}
    </div>
  );
};

export default App;