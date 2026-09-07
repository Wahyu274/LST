'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lock, Headset, Share2, Code2, Wrench, ChevronDown } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MessageItem {
  id: string;
  senderType: 'VISITOR' | 'AI' | 'CS' | 'SYSTEM';
  senderName: string;
  content: string;
  isInternalNote: boolean;
  createdAt: string;
}

interface ChatTimelineProps {
  conversationId: string;
  messages: MessageItem[];
  onSendMessage: (text: string, isInternal: boolean) => void;
  status: string;
  onAcceptChat?: () => void;
}

export default function ChatTimeline({
  conversationId,
  messages,
  onSendMessage,
  status,
  onAcceptChat,
}: ChatTimelineProps) {
  const [input, setInput] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showForwardMenu, setShowForwardMenu] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const [techContacts, setTechContacts] = useState({
    whatsappTechSoftware: '6282135550008',
    whatsappTechHardware: '6282135550009',
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setTechContacts({
            whatsappTechSoftware: res.data.whatsappTechSoftware || '6282135550008',
            whatsappTechHardware: res.data.whatsappTechHardware || '6282135550009',
          });
        }
      })
      .catch((err) => console.error('Error fetching settings for CS timeline:', err));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input, isInternalNote);
    setInput('');
  };

  const handleForwardToTechnician = (type: 'software' | 'hardware') => {
    const isSoftware = type === 'software';
    const targetPhone = isSoftware ? techContacts.whatsappTechSoftware : techContacts.whatsappTechHardware;
    const techLabel = isSoftware ? 'Teknisi Software & Systems' : 'Teknisi Hardware & Infrastructure';

    // Summary of last few visitor messages
    const lastVisitorMsgs = messages
      .filter((m) => m.senderType === 'VISITOR')
      .slice(-3)
      .map((m) => `- ${m.content}`)
      .join('%0A');

    const waText = `FORWARD PERCAKAPAN PELANGGAN LST%0AID Percakapan: ${conversationId.slice(0, 8)}%0APesan Pelanggan:%0A${lastVisitorMsgs || 'Pelanggan minta bantuan teknis'}`;

    // 1. Post internal note in CS Timeline
    onSendMessage(`[FORWARDED] Percakapan ini telah diteruskan ke WA ${techLabel} (${targetPhone}).`, true);

    // 2. Open WhatsApp link to technician
    window.open(`https://wa.me/${targetPhone}?text=${waText}`, '_blank');
    setShowForwardMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F9FC] relative font-sans border-r border-[#E2E8F0]">
      {/* Header Bar */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between shadow-xs z-10">
        <div>
          <h3 className="font-display font-bold text-[#071426] text-sm flex items-center gap-2">
            <span>Timeline Live Chat Pelanggan</span>
            <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-[#1769E0] font-mono text-[11px]">
              ID: {conversationId.slice(0, 8)}
            </span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Riwayat percakapan AI Virtual Consultant & Customer Service
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Forward to Technician Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowForwardMenu(!showForwardMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1769E0]" />
              <span>Forward ke Teknisi</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showForwardMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-[10px] shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Teruskan Pesan Pelanggan
                </div>
                <button
                  type="button"
                  onClick={() => handleForwardToTechnician('software')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Teknisi Software & ERP</div>
                    <div className="text-[10px] text-slate-400 font-mono">{techContacts.whatsappTechSoftware}</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleForwardToTechnician('hardware')}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Teknisi Hardware & FO</div>
                    <div className="text-[10px] text-slate-400 font-mono">{techContacts.whatsappTechHardware}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {status === 'WAITING_FOR_CS' && (
            <Button variant="primary" size="sm" onClick={onAcceptChat} leftIcon={<Headset className="w-4 h-4" />}>
              Terima Chat (Accept)
            </Button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          if (msg.isInternalNote) {
            return (
              <div key={msg.id} className="p-3.5 rounded-[8px] bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1 my-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Catatan Internal CS ({msg.senderName})</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                <span className="block text-[10px] text-amber-600 text-right">{formatDateTime(msg.createdAt)}</span>
              </div>
            );
          }

          if (msg.senderType === 'SYSTEM') {
            return (
              <div key={msg.id} className="text-center my-4 flex items-center justify-center gap-3">
                <div className="h-px bg-[#E2E8F0] flex-1" />
                <span className="px-3 py-1 rounded-[6px] bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {msg.content}
                </span>
                <div className="h-px bg-[#E2E8F0] flex-1" />
              </div>
            );
          }

          const isVisitor = msg.senderType === 'VISITOR';
          const isAI = msg.senderType === 'AI';

          return (
            <div key={msg.id} className={`flex gap-3 ${isVisitor ? 'justify-start' : 'justify-end'}`}>
              {isVisitor && (
                <div className="w-8 h-8 rounded-[8px] bg-[#071426] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}

              {isAI && (
                <div className="w-8 h-8 rounded-[8px] bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[75%] p-3.5 rounded-[10px] text-xs sm:text-sm leading-relaxed border ${
                  isVisitor
                    ? 'bg-white text-[#111827] border-[#E2E8F0]'
                    : isAI
                    ? 'bg-slate-100 text-[#071426] border-slate-200'
                    : 'bg-[#1769E0] text-white border-[#1769E0]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] font-semibold opacity-80 mb-1">
                  <span className="uppercase tracking-wider">{msg.senderType}: {msg.senderName}</span>
                </div>
                <p className="whitespace-pre-line">{msg.content}</p>
                <span className="block text-[10px] text-right mt-1.5 opacity-70">
                  {formatDateTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Message Composer */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsInternalNote(!isInternalNote)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors ${
              isInternalNote
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isInternalNote ? 'Catatan Internal (Rahasia)' : 'Kirim Ke Pelanggan'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isInternalNote ? 'Tulis catatan internal untuk tim CS/Admin...' : 'Tulis balasan untuk pelanggan...'}
            className={`flex-1 h-11 px-3.5 rounded-[8px] border text-xs sm:text-sm focus:outline-none transition-all ${
              isInternalNote
                ? 'bg-amber-50 border-amber-300 focus:ring-2 focus:ring-amber-500'
                : 'bg-white border-[#E2E8F0] focus:border-[#1769E0]'
            }`}
          />
          <Button
            variant={isInternalNote ? 'secondary' : 'primary'}
            size="md"
            type="submit"
            disabled={!input.trim()}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Kirim
          </Button>
        </div>
      </form>
    </div>
  );
}
