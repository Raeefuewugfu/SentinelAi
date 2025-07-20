

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getHelpdeskResponseStream } from '../services/geminiService';
import { HelpMessage } from '../types';
import { ShieldCheckIcon, XCircleIcon, PaperAirplaneIcon, QuestionMarkCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from './icons';

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'init', sender: 'agent', content: "Hallo! Ik ben de Sentinel AI Helper. Waarmee kan ik u helpen?" }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: HelpMessage = { id: Date.now().toString(), sender: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const agentMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: agentMessageId, sender: 'agent', content: '', isStreaming: true }]);

    try {
        const stream = await getHelpdeskResponseStream(newMessages);
        let contentBuffer = '';
        for await (const chunk of stream) {
            contentBuffer += chunk.text || '';
            setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, content: contentBuffer } : msg));
        }
    } catch (error) {
        setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, content: "Sorry, er is iets misgegaan. Probeer het later opnieuw.", isStreaming: false } : msg));
    } finally {
        setIsLoading(false);
        setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, isStreaming: false } : msg));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-accent text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
        aria-label="Open help chat"
      >
        <QuestionMarkCircleIcon className="w-8 h-8" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center" onClick={() => setIsOpen(false)}>
          <div
            className="w-full h-full sm:max-w-md sm:h-[70vh] bg-surface-1 sm:rounded-2xl shadow-2xl border border-surface-2 flex flex-col m-0 sm:m-4 animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-surface-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 text-accent" />
                    <h2 className="text-lg font-bold text-text-primary">Sentinel Helpdesk</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-text-tertiary hover:text-accent"><XCircleIcon className="w-7 h-7" /></button>
            </header>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                   {msg.sender === 'agent' && <div className="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center flex-shrink-0"><ShieldCheckIcon className="w-5 h-5 text-accent" /></div>}
                   <div className={`px-4 py-2.5 rounded-2xl max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'bg-accent text-white' : 'bg-surface-2 text-text-primary'}`}>
                      <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 text-inherit">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        {msg.isStreaming && <span className="inline-block w-2 h-4 bg-text-primary/70 animate-pulse ml-1"></span>}
                      </div>
                   </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-surface-2 flex-shrink-0">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Stel een vraag..."
                        disabled={isLoading}
                        className="w-full bg-background text-text-primary placeholder-text-tertiary border border-surface-2 rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-accent text-white rounded-full flex items-center justify-center transition-opacity disabled:opacity-50">
                       {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <PaperAirplaneIcon className="w-5 h-5" />}
                    </button>
                </form>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpWidget;