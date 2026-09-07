'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Edit, Trash2, Sparkles } from 'lucide-react';

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    categoryId: '',
    syncToAI: true,
    status: 'PUBLISHED',
    sortOrder: 0,
  });

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/faq');
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
        if (data.categories) setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      categoryId: categories[0]?.id || '',
      syncToAI: true,
      status: 'PUBLISHED',
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      categoryId: faq.categoryId || '',
      syncToAI: faq.syncToAI ?? true,
      status: faq.status || 'PUBLISHED',
      sortOrder: faq.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/faq?id=${editingId}` : '/api/admin/faq';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert(data.error || 'Gagal menyimpan FAQ');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteFaq = async (id: string, question: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus FAQ "${question}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchFaqs();
      } else {
        alert(data.error || 'Gagal menghapus FAQ');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Pertanyaan FAQ',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block">{row.question}</span>
          <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.answer}</span>
        </div>
      ),
    },
    {
      header: 'Kategori',
      cell: (row) => <span className="text-xs text-slate-700">{row.category?.name || 'Umum'}</span>,
    },
    {
      header: 'Status Publish',
      cell: (row) => (
        <Badge variant={row.status === 'PUBLISHED' ? 'success' : 'neutral'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'AI Knowledge Sync',
      cell: (row) => (
        row.syncToAI ? (
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold flex items-center gap-1 w-max border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-600" /> Sync to AI
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">
            Manual Only
          </span>
        )
      ),
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit FAQ"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteFaq(row.id, row.question)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus FAQ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="page-h1 text-[#071426]">FAQ & Knowledge Sync Manager</h1>
          <p className="text-xs text-slate-500">
            Kelola pertanyaan yang sering diajukan & sinkronkan jawaban untuk AI Virtual Consultant.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchFaqs} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah FAQ Baru
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={faqs}
        keyExtractor={(f) => f.id}
        isLoading={isLoading}
        emptyText="Belum ada FAQ terdaftar."
      />

      {/* Modal Form Create / Edit FAQ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFaq} className="space-y-4">
          <Input
            label="Pertanyaan FAQ *"
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Bagaimana prosedur garansi SLA 1x24 jam LST?"
          />

          <Textarea
            label="Jawaban FAQ *"
            required
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Tim teknisi LST akan melakukan penanganan kendala maksimal 1x24 jam sejak laporan diterima..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori FAQ"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            />
            <Input
              label="Urutan Sort"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value || '0', 10) })}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.syncToAI}
                onChange={(e) => setFormData({ ...formData, syncToAI: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Sinkronkan ke AI Virtual Consultant Knowledge Base</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update FAQ' : 'Simpan FAQ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
