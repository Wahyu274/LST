'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Headset, PhoneCall, Sparkles, CheckCircle2, Wrench, Code2, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_INTENTS = [
  'Laptop & PC Kantor',
  'Smart Classroom (IFP)',
  'CCTV & Access Control',
  'Jaringan Fiber Optic & WiFi',
  'Software & ERP Custom',
  'Teknisi Hardware',
  'Teknisi Software',
  'Hubungi CS Manusia',
];

export default function AIConsultantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Halo! Saya LST Virtual Technology Consultant. Saya siap membantu Anda berkonsultasi seputar pengadaan Laptop/PC, Smart Classroom, Jaringan Fiber Optic, CCTV AI, maupun Software ERP. Ada yang bisa saya bantu hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoffOption, setShowHandoffOption] = useState(false);
  const [handoffSuccess, setHandoffSuccess] = useState(false);
  const [showWaTechnicianMenu, setShowWaTechnicianMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Settings for WhatsApp numbers
  const [contacts, setContacts] = useState({
    whatsappCS: '6282135550007',
    whatsappTechSoftware: '6282135550008',
    whatsappTechHardware: '6282135550009',
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setContacts({
            whatsappCS: res.data.whatsappCS || '6282135550007',
            whatsappTechSoftware: res.data.whatsappTechSoftware || '6282135550008',
            whatsappTechHardware: res.data.whatsappTechHardware || '6282135550009',
          });
        }
      })
      .catch((err) => console.error('Failed to fetch public contact settings:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Realtime Polling when connected to CS
  useEffect(() => {
    if (!activeConversationId) return;

    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/public/chat?conversationId=${activeConversationId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            const formatted: ChatMessage[] = data.messages.map((m: any) => ({
              id: m.id,
              sender: m.senderType === 'VISITOR' ? 'user' : 'ai',
              text: m.senderType === 'CS' ? `🎧 [Customer Service - ${m.senderName}]:\n${m.content}` : m.content,
              timestamp: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }));
            setMessages(formatted);
          }
        }
      } catch (err) {
        console.error('Polling CS messages error:', err);
      }
    };

    pollMessages();
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    // Check if user requested technician or CS
    if (/teknisi software/i.test(textToSend) || /teknisi hardware/i.test(textToSend) || /hubungi cs/i.test(textToSend)) {
      setShowHandoffOption(true);
      setShowWaTechnicianMenu(true);
    }

    // If already handed off to CS, send directly to CS conversation
    if (activeConversationId) {
      try {
        await fetch('/api/public/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeConversationId,
            content: textToSend,
          }),
        });
      } catch (err) {
        console.error('Failed to send visitor message to CS:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.content || 'Maaf, terjadi masalah koneksi. Apakah Anda ingin langsung dihubungkan dengan Customer Service kami?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.shouldEscalateToCS) {
        setShowHandoffOption(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, terjadi gangguan sementara. Anda dapat langsung berkonsultasi via WhatsApp ke CS atau Teknisi kami.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setShowHandoffOption(true);
      setShowWaTechnicianMenu(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateToCS = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversationId) {
          setActiveConversationId(data.conversationId);
        }
        setHandoffSuccess(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'ai',
            text: '✓ Permintaan Terkirim! Percakapan Anda telah diteruskan ke Antrean Live CS. Tim kami sedang terhubung dan akan membalas pesan ini secara langsung di jendela chat ini.',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white font-medium shadow-2xl shadow-blue-700/30 hover:scale-105 transition-all duration-300 border border-white/20"
          aria-label="Open AI Consultant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>
          <span className="text-sm font-semibold tracking-wide hidden sm:inline">
            Tanya AI Consultant
          </span>
          <span className="flex h-2 w-2 relative sm:hidden">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[430px] h-[620px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md border border-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 text-white">
                  LST Virtual Consultant
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-blue-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  AI Technology Advisor (24/7)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Intent Pills */}
          <div className="bg-slate-50 border-b border-slate-200/80 p-2.5 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {QUICK_INTENTS.map((intent) => (
              <button
                key={intent}
                onClick={() => {
                  if (intent === 'Teknisi Software') {
                    handleSend('Saya butuh bantuan kendala teknis Software / ERP.');
                    setShowWaTechnicianMenu(true);
                  } else if (intent === 'Teknisi Hardware') {
                    handleSend('Saya butuh bantuan kendala teknis Hardware / Jaringan.');
                    setShowWaTechnicianMenu(true);
                  } else if (intent === 'Hubungi CS Manusia') {
                    handleSend('Saya ingin berkonsultasi langsung dengan Customer Service manusia.');
                  } else {
                    handleSend(`Tolong jelaskan solusi LST mengenai ${intent}.`);
                  }
                }}
                className="px-3 py-1 rounded-full text-xs bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 font-medium shrink-0 transition-colors shadow-xs"
              >
                {intent}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-700 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs font-medium">
                <div className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>LST AI sedang mengetik...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Handoff & WhatsApp Technician Menu */}
          {(showHandoffOption || showWaTechnicianMenu) && !handoffSuccess && (
            <div className="p-3 bg-blue-50/80 border-t border-blue-200 flex flex-col gap-2.5">
              <p className="text-xs text-blue-900 font-semibold text-center flex items-center justify-center gap-1">
                <Headset className="w-3.5 h-3.5 text-blue-700" />
                <span>Pilih Kontak Bantuan Resmi LST:</span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleEscalateToCS}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Headset className="w-3.5 h-3.5" />
                  <span>Live CS</span>
                </button>

                <a
                  href={`https://wa.me/${contacts.whatsappTechSoftware}?text=Halo%20Teknisi%20Software%20LST,%20saya%20butuh%20bantuan...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Teknisi Software</span>
                </a>

                <a
                  href={`https://wa.me/${contacts.whatsappTechHardware}?text=Halo%20Teknisi%20Hardware%20LST,%20saya%20butuh%20bantuan...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Teknisi Hardware</span>
                </a>
              </div>
            </div>
          )}

          {handoffSuccess && (
            <div className="p-2.5 bg-emerald-50 border-t border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sudah terhubung ke antrean Customer Service</span>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tuliskan pertanyaan / kebutuhan..."
              className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
