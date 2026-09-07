'use client';

import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ConversationItem {
  id: string;
  status: string;
  intentCategory: string | null;
  unreadCS: boolean;
  customer?: {
    name: string;
    institution?: string | null;
  } | null;
  updatedAt: string;
}

interface CSQueueSidebarProps {
  conversations: ConversationItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function CSQueueSidebar({
  conversations,
  selectedId,
  onSelect,
  activeFilter,
  onFilterChange,
}: CSQueueSidebarProps) {
  const filtered = conversations.filter((c) => {
    if (activeFilter === 'WAITING') return c.status === 'WAITING_FOR_CS';
    if (activeFilter === 'ACTIVE') return c.status === 'ASSIGNED' || c.status === 'HUMAN_HANDLING';
    if (activeFilter === 'FOLLOW_UP') return c.status === 'FOLLOW_UP';
    if (activeFilter === 'CLOSED') return c.status === 'CLOSED';
    return true; // ALL INBOX
  });

  return (
    <div className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col h-full shrink-0 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] space-y-3">
        <h2 className="font-display font-bold text-[#071426] text-sm flex items-center justify-between">
          <span>Antrean Live Support CS</span>
          <span className="px-2.5 py-0.5 rounded-[6px] bg-blue-50 text-[#1769E0] text-xs font-mono font-bold">
            {filtered.length} Aktif
          </span>
        </h2>

        {/* Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'WAITING', label: 'Menunggu' },
            { id: 'ACTIVE', label: 'Ditangani' },
            { id: 'FOLLOW_UP', label: 'Follow-up' },
            { id: 'CLOSED', label: 'Selesai' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-[#1769E0] text-white'
                  : 'bg-[#F7F9FC] text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Tidak ada antrean percakapan dalam kategori ini.</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = selectedId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full p-4 text-left transition-colors flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-blue-50/70 border-l-4 border-[#1769E0]' : 'hover:bg-[#F7F9FC]'
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#071426] truncate">
                      {conv.customer?.name || 'Visitor Unregistered'}
                    </span>
                    {conv.unreadCS && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {conv.customer?.institution || conv.intentCategory || 'Konsultasi IT'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant={
                        conv.status === 'WAITING_FOR_CS'
                          ? 'warning'
                          : conv.status === 'HUMAN_HANDLING' || conv.status === 'ASSIGNED'
                          ? 'success'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {conv.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
