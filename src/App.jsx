import React, { useState, useEffect } from 'react';
import { 
  Users, Image as ImageIcon, Settings, FileText, LayoutGrid, 
  Award, CheckCircle2, ChevronRight, Plus, Download, 
  Star, TrendingUp, Calendar, ClipboardList, Search, Trash2, Camera, Lock, ChevronLeft
} from 'lucide-react';

const App = () => {
  // --- 状態管理 ---
  const [userMode, setUserMode] = useState('先生');
  const [isAuth, setIsAuth] = useState(false);
  const [view, setView] = useState('ボード'); 
  const [modal, setModal] = useState(null); 
  const [passInput, setPassInput] = useState('');

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class-log-v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: '1カナミ', points: 33, grade: 'B' },
      { id: 2, name: '2ソウタ', points: 21, grade: 'B' },
      { id: 3, name: '3アヤノ', points: 45, grade: 'A' },
      { id: 4, name: '4エイト', points: 12, grade: 'B' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('class-log-v3', JSON.stringify(students));
  }, [students]);

  const handleAuth = () => {
    if (passInput === '1234') {
      setIsAuth(true);
      setModal(null);
      setPassInput('');
    } else {
      alert('パスワードが違います');
    }
  };

  // --- モーダル (認証) ---
  const PasswordModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl">
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

  // --- メイン画面のレンダリング ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-32 text-slate-900">
      {/* ヘッダー */}
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
            <LayoutGrid className="w-5 h-5" />
            <Award className="w-5 h-5" />
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </header>

      {modal === 'password' && <PasswordModal />}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {userMode === '先生' && isAuth ? (
          <div className="space-y-10">
            {/* アクションボタン */}
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
              <button onClick={() => setView('ギャラリー')} className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all ${view === 'ギャラリー' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-500 text-orange-500'}`}>
                <LayoutGrid className="w-4 h-4"/>ギャラリー
              </button>
              <button onClick={() => setView('採点')} className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all ${view === '採点' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border border-indigo-600 text-indigo-600'}`}>
                <Award className="w-4 h-4"/>評価
              </button>
            </div>

            {/* ボード表示 */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">氏名</th>
                    <th className="px-10 py-6 text-center">累積PT</th>
                    <th className="px-10 py-6">最新ログ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-10 py-8 font-black text-slate-700 text-lg">{s.name}</td>
                      <td className="px-10 py-8 text-center text-3xl font-black text-blue-600">{s.points}</td>
                      <td className="px-10 py-8 text-slate-400 font-medium">---</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : userMode === '児童' ? (
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
            <p className="text-center font-bold text-slate-400 mb-10 italic uppercase tracking-widest text-xs">Activity Log</p>
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
                <select className="w-full bg-transparent p-4 font-black text-slate-700 outline-none text-lg">
                  <option>ミッションを選択</option>
                  <option>自学ログを1回投稿する</option>
                </select>
              </div>
              <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group hover:border-indigo-200 transition-all cursor-pointer">
                <Camera className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-bold text-sm">証拠写真を撮影</p>
              </div>
              <button className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] text-xl shadow-xl shadow-indigo-100">
                ログを保存する
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-300">
            <Lock className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold">先生モードを使用するにはパスワードを入力してください</p>
          </div>
        )}
      </main>

      {/* ナビゲーションバー */}
      {userMode === '先生' && isAuth && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl px-12 py-5 rounded-full flex gap-14 text-slate-300 z-[150]">
          <button onClick={() => setView('ボード')} className={view === 'ボード' ? 'text-indigo-600' : ''}><FileText className="w-7 h-7" /></button>
          <button onClick={() => setView('ギャラリー')} className={view === 'ギャラリー' ? 'text-indigo-600' : ''}><LayoutGrid className="w-7 h-7" /></button>
          <button onClick={() => setView('採点')} className={view === '採点' ? 'text-indigo-600' : ''}><Award className="w-7 h-7" /></button>
          <button className="hover:scale-110 transition-transform"><Plus className="bg-indigo-600 text-white rounded-full p-2 w-10 h-10 shadow-lg" /></button>
        </nav>
      )}
    </div>
  );
};

export default App;