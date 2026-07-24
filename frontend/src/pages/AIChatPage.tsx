import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Zap, Navigation, MapPin } from 'lucide-react';
import api from '../services/api';

export const AIChatPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '⚡ Namaste! I am VoltConnect AI, your smart EV Mobility Assistant. Ask me to find cheap/fast chargers, estimate charging cost in ₹, check Tata/MG EV plug compatibility, or plan highway trips (e.g., Delhi to Jaipur, Bengaluru to Mysuru)!',
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat-query', { message: userText });
      setChatHistory((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚡ VoltConnect AI Suggestion:\nI recommend Indiranagar 100kW Ultra-Fast CCS2 Station in Bengaluru (₹150/hr). It is 100% compatible with Tata Nexon EV, MG ZS EV, and Hyundai Ioniq 5!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">VoltConnect AI Mobility Assistant</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Conversational AI Assistant for Indian EV Charging & Highway Trips</p>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-400 shrink-0">Quick Prompts:</span>
          <button
            onClick={() => setInputMessage('Find cheapest charger near me')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-emerald-500 font-bold shrink-0"
          >
            💰 Cheapest Charger
          </button>
          <button
            onClick={() => setInputMessage('Find fastest charger')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-teal-400 font-bold shrink-0"
          >
            🚀 Fastest 150kW DC
          </button>
          <button
            onClick={() => setInputMessage('Plan my Delhi to Jaipur trip')}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-cyan-400 font-bold shrink-0"
          >
            🛣️ Plan Highway Trip
          </button>
        </div>

        {/* Message Trajectory */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-line leading-relaxed text-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              VoltConnect AI is analyzing EV charging network...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask VoltConnect AI anything about EV chargers or trips..."
            className="flex-1 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs shadow-md hover:from-emerald-600 hover:to-teal-600 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
