'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CSQueueSidebar from '@/components/cs/CSQueueSidebar';
import ChatTimeline from '@/components/cs/ChatTimeline';
import CustomerContextPanel from '@/components/cs/CustomerContextPanel';
import { RealtimePollingService } from '@/lib/realtime/polling';

export default function CSInboxPage(): React.ReactNode {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/cs/conversations');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        setConversations(list);
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversation queue:', err);
    }
  }, [selectedId]);

  const fetchMessages = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/cs/messages?conversationId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentMessages(data.messages || []);
        setCurrentConversation(data.conversation || null);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const polling = new RealtimePollingService(3000);
    polling.startPolling({
      onQueueUpdate: () => {
        fetchQueue();
        if (selectedId) fetchMessages(selectedId);
      },
    });

    return () => polling.stopPolling();
  }, [selectedId, fetchQueue, fetchMessages]);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
    }
  }, [selectedId, fetchMessages]);

  const handleSendMessage = async (text: string, isInternal: boolean) => {
    if (!selectedId) return;

    try {
      const res = await fetch('/api/cs/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedId,
          content: text,
          isInternalNote: isInternal,
          senderName: isInternal ? 'CS Senior' : 'Customer Service',
        }),
      });

      if (res.ok) {
        fetchMessages(selectedId);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleAcceptChat = async () => {
    if (!selectedId) return;
    await fetch('/api/cs/conversations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedId, status: 'HUMAN_HANDLING' }),
    });
    fetchQueue();
    fetchMessages(selectedId);
  };

  const handleMarkAsLead = async () => {
    if (!currentConversation) return;
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: currentConversation.customer?.name || 'Client',
        institution: currentConversation.customer?.institution || '',
        phone: currentConversation.customer?.phone || '081234567890',
        interest: currentConversation.intentCategory || 'Smart Classroom / IT',
        source: 'AI_CHAT',
      }),
    });
    alert('Lead berhasil disimpan ke CRM Admin!');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedId) return;
    await fetch('/api/cs/conversations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedId, status: newStatus }),
    });
    fetchQueue();
    fetchMessages(selectedId);
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Left Queue Panel */}
      <CSQueueSidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        activeFilter={activeFilter}
        onFilterChange={(f) => setActiveFilter(f)}
      />

      {/* Center Chat Timeline */}
      {selectedId && currentConversation ? (
        <>
          <ChatTimeline
            conversationId={selectedId}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            status={currentConversation.status}
            onAcceptChat={handleAcceptChat}
          />

          {/* Right Customer Context Panel */}
          <CustomerContextPanel
            conversation={currentConversation}
            onMarkAsLead={handleMarkAsLead}
            onSetFollowUp={() => handleStatusChange('FOLLOW_UP')}
            onCloseChat={() => handleStatusChange('CLOSED')}
            onReturnToAI={() => handleStatusChange('AI_HANDLING')}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Pilih salah satu percakapan di antrean untuk mulai membalas.
        </div>
      )}
    </div>
  );
}
