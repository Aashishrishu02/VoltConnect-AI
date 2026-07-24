import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';
import api from '../../services/api';

export const AIChatbotModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '⚡ Namaste! I am VoltConnect AI, your smart EV Mobility Assistant. Ask me to find cheap/fast chargers, estimate charging cost in ₹, check Tata/MG EV plug compatibility, or plan highway trips!',
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
    <>
      {/* Floating AI Trigger Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all flex items-center gap-2 font-extrabold text-xs"
          title="Open VoltConnect AI Assistant"
        >
          <Sparkles className="w-5 h-5 fill-white animate-pulse" />
          <span className="hidden sm:inline font-bold">VoltConnect AI</span>
        </button>
      )}

      {/* Chatbot Popup Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px] text-white animate-in slide-in-from-bottom duration-200">
          {/* Top Header */}
          <div className="p-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-400">VoltConnect AI Assistant</h4>
                <span className="text-[9px] text-slate-400">Smart EV Mobility Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputMessage('Find cheapest charger near me')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold whitespace-nowrap"
            >
              💰 Cheapest Charger
            </button>
            <button
              onClick={() => setInputMessage('Find fastest charger')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold whitespace-nowrap"
            >
              🚀 Fastest 150kW DC
            </button>
            <button
              onClick={() => setInputMessage('Plan my Delhi to Jaipur trip')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold whitespace-nowrap"
            >
              🛣️ Plan Trip
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white font-medium rounded-br-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                VoltConnect AI is analyzing charging network...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-800/90 border-t border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask VoltConnect AI..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
