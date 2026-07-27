import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

const suggestions = [
  'How can I save more money this month?',
  'Analyse my spending patterns.',
  'Can I afford a ₹1 lakh laptop?',
  'Suggest next month\'s budget.',
  'Which category am I overspending on?',
  'How is my savings goal progressing?',
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your FinPilot AI Advisor. Ask me anything about your finances!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || pendingRef.current) return;

    pendingRef.current = true;
    setInput('');
    setError(null);

    const userMsg = { role: 'user', content: msg };
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get AI response. Please try again.';
      setError(errMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
    } finally {
      setLoading(false);
      pendingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-200">AI Advisor</h1>
          <p className="text-xs text-slate-500">Powered by Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-500/15 border border-emerald-500/20 text-slate-200'
                  : 'glass border border-white/[0.07] text-slate-300'
              }`}
            >
              {msg.role === 'assistant' && i === 0 && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">FinPilot AI</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass border border-white/[0.07] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <RefreshCw size={14} className="animate-spin" />
                Thinking...
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions (only show at start) */}
        {messages.length === 1 && !loading && (
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 mb-2">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {/* Input */}
      <div className="relative mt-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI advisor anything..."
          rows={1}
          className="w-full glass border border-white/[0.1] rounded-2xl px-4 py-3 pr-12 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          style={{ minHeight: 48, maxHeight: 120 }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="absolute right-2 bottom-2 p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
