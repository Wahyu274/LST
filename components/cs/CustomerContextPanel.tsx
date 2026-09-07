'use client';

import { Phone, Mail, MapPin, Sparkles, UserPlus, Clock, XCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CustomerContextProps {
  conversation: {
    id: string;
    status: string;
    summary?: string | null;
    intentCategory?: string | null;
    customer?: {
      name: string;
      institution?: string | null;
      phone: string;
      email?: string | null;
      location?: string | null;
    } | null;
  };
  onMarkAsLead: () => void;
  onSetFollowUp: () => void;
  onCloseChat: () => void;
  onReturnToAI: () => void;
}

export default function CustomerContextPanel({
  conversation,
  onMarkAsLead,
  onSetFollowUp,
  onCloseChat,
  onReturnToAI,
}: CustomerContextProps) {
  const cust = conversation.customer;

  return (
    <div className="w-80 bg-white border-l border-[#E2E8F0] flex flex-col h-full shrink-0 overflow-y-auto p-5 space-y-6 font-sans">
      {/* Customer Bio */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[8px] bg-blue-50 text-[#1769E0] flex items-center justify-center font-bold text-base border border-blue-200">
            {cust?.name ? cust.name.charAt(0) : 'V'}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#071426]">{cust?.name || 'Visitor Unregistered'}</h3>
            <p className="text-xs text-slate-500">{cust?.institution || 'Instansi Belum Ditentukan'}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 pt-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{cust?.phone || '08xxxxxxxxxx'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{cust?.email || 'Belum ada email'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{cust?.location || 'Jawa Tengah'}</span>
          </div>
        </div>
      </div>

      {/* AI Structured Summary */}
      <div className="p-4 rounded-[8px] bg-[#F7F9FC] border border-[#E2E8F0] space-y-2">
        <h4 className="font-display font-bold text-xs text-[#071426] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Handoff Summary</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed italic">
          &quot;{conversation.summary || 'Klien berkonsultasi mengenai solusi teknologi LST.'}&quot;
        </p>
        <div className="pt-2">
          <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-[#1769E0] text-[10px] font-semibold">
            Topik: {conversation.intentCategory || 'Solusi General'}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Aksi Penanganan CS</h4>

        <Button
          variant="primary"
          size="md"
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={onMarkAsLead}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Simpan Ke CRM Leads
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={onSetFollowUp}
          leftIcon={<Clock className="w-4 h-4" />}
        >
          Set Status Follow-Up
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={onReturnToAI}
          leftIcon={<Bot className="w-4 h-4" />}
        >
          Kembalikan Ke AI Bot
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="w-full text-slate-500"
          onClick={onCloseChat}
          leftIcon={<XCircle className="w-4 h-4 text-slate-400" />}
        >
          Tutup Percakapan
        </Button>
      </div>
    </div>
  );
}
