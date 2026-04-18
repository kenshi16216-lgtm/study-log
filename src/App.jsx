import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('デザイン');

  // ブラウザの保存領域からデータを読み込む
  useEffect(() => {
    const savedLogs = localStorage.getItem('study-logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // ログが更新されるたびに保存する
  useEffect(() => {
    localStorage.setItem('study-logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newLog = {
      id: Date.now(),
      title,
      content,
      category,
      date: new Date().toLocaleDateString('ja-JP'),
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };

    setLogs([newLog, ...logs]);
    setTitle('');
    setContent('');
  };

  const deleteLog = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600 flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" />
            自学デザイン・ログ
          </h1>
          <p className="text-slate-500 mt-2">日々の学びを記録し、デザインする</p>
        </header>

        {/* 入力フォーム */}
        <form onSubmit={addLog} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">学習タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：色のコントラストについて"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">カテゴリー</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                >
                  <option>デザイン</option>
                  <option>プログラミング</option>
                  <option>考え方</option>
                  <option>その他</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  記録する
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">学んだこと・メモ</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                placeholder="具体的に何を知ったか、どう感じたか"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
            </div>
          </div>
        </form>

        {/* ログ一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            これまでの学習記録
          </h2>
          {logs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              まだ記録がありません。最初の学びを書き留めましょう！
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                    {log.category}
                  </span>
                  <h3 className="text-lg font-bold mt-1">{log.title}</h3>
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                {log.content}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 border-t pt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {log.date}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  完了
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;