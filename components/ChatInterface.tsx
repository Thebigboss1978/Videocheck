
import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface ChatInterfaceProps {
  chatSession: Chat;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatSession }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'مرحباً! أنا مستشارك الذكي. كيف يمكنني مساعدتك في تنظيم أو تحسين فيديوهاتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullText;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">AI Video Assistant</h4>
          <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-tighter">Powered by Gemini 3</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن الفيديوهات..."
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-arabic"
            dir="rtl"
          />
          <button 
            onClick={handleSend}
            className="absolute left-2 top-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-500 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
