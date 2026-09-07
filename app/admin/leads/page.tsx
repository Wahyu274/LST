'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTATION', 'NEGOTIATION', 'WON', 'LOST'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    institution: '',
    email: '',
    phone: '',
    location: '',
    interest: '',
    source: 'MANUAL',
    stage: 'NEW',
    estimatedValue: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
      };
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/admin/leads?id=${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="page-h1 text-[#071426]">CRM & Prospek Leads Pipeline</h1>
          <p className="text-xs text-slate-500">
            Manajemen prospek terintegrasi dari Web AI Chat, Form Kontak, WhatsApp, dan Input Sales Manual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchLeads} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            + Prospek Baru
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 border border-[#E2E8F0] rounded-[10px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama pelanggan, instansi, atau kebutuhan..."
          className="w-full max-w-sm h-10 px-3.5 bg-[#F7F9FC] text-xs text-[#111827] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:border-[#1769E0]"
        />
      </div>

      {/* Kanban Board View */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className="w-72 bg-[#F7F9FC] p-3.5 rounded-[10px] border border-[#E2E8F0] shrink-0 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                  <span className="font-bold text-xs text-[#071426] tracking-wider uppercase">{stage}</span>
                  <span className="px-2 py-0.5 rounded-[6px] bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs italic">Kosong</div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-[8px] bg-white border border-[#E2E8F0] shadow-xs space-y-2 hover:border-[#1769E0] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#071426] leading-snug">
                            {lead.customer?.name || 'Prospek'}
                          </h4>
                          <Badge variant="neutral" size="sm">
                            {lead.source}
                          </Badge>
                        </div>

                        {lead.customer?.institution && (
                          <p className="text-[11px] text-slate-600 font-medium">
                            {lead.customer.institution}
                          </p>
                        )}

                        <p className="text-[11px] font-semibold text-[#1769E0] bg-blue-50 px-2 py-1 rounded-[4px]">
                          {lead.interest}
                        </p>

                        {lead.estimatedValue && (
                          <span className="block text-[11px] font-bold text-emerald-600">
                            Est: {formatCurrency(lead.estimatedValue)}
                          </span>
                        )}

                        <div className="text-[10px] text-slate-500 space-y-0.5 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{lead.customer?.phone}</span>
                          </div>
                          {lead.customer?.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{lead.customer.email}</span>
                            </div>
                          )}
                          {lead.customer?.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lead.customer.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Move Stage Quick Action */}
                        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-mono">Pindah:</span>
                          <select
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create Lead */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Prospek Leads Baru"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Kontak / PIC"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Bpk. Wahyudi"
            />
            <Input
              label="Nama Sekolah / Perusahaan"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="SMK Negeri 1 Temanggung"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor WhatsApp / Telepon"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08123456789"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="wahyudi@smkn1.sch.id"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kebutuhan Utama (Interest)"
              required
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              placeholder="Smart Classroom 75 Inch, Fiber Optic 100m..."
            />
            <Input
              label="Estimasi Nilai Proyek (Rp)"
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              placeholder="50000000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Sumber Leads"
              options={[
                { label: 'Manual Input (Sales)', value: 'MANUAL' },
                { label: 'Web AI Chat', value: 'AI_CHAT' },
                { label: 'Form Kontak', value: 'CONTACT_FORM' },
                { label: 'Direct WhatsApp', value: 'WHATSAPP' },
              ]}
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
            <Select
              label="Tahap Pipeline (Stage)"
              options={STAGES.map((s) => ({ label: s, value: s }))}
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            />
          </div>

          <Input
            label="Lokasi / Kota"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Temanggung, Jawa Tengah"
          />

          <Textarea
            label="Catatan Prospek"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Catatan tambahan spesifikasi atau jadwal meeting..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Simpan Prospek
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
