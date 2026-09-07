'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Edit, Trash2, Sparkles, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AIKnowledgeBasePage() {
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'DOCUMENT',
    content: '',
    category: 'General',
    priority: 1,
    isApproved: true,
    status: 'ACTIVE',
  });

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge-base');
      const data = await res.json();
      if (data.success) setSources(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setUploadStatus(null);
    setFormData({
      title: '',
      type: 'DOCUMENT',
      content: '',
      category: 'General',
      priority: 1,
      isApproved: true,
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (src: any) => {
    setEditingId(src.id);
    setUploadStatus(null);
    setFormData({
      title: src.title,
      type: src.type || 'DOCUMENT',
      content: src.content || '',
      category: src.category || 'General',
      priority: src.priority || 1,
      isApproved: src.isApproved ?? true,
      status: src.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setUploadStatus(`Membaca dokumen "${file.name}"...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setFormData((prev) => ({
          ...prev,
          title: prev.title || fileTitle,
          content: text,
        }));
        setUploadStatus(`Dokumen "${file.name}" berhasil dibaca (${(text.length / 1024).toFixed(1)} KB)`);
      } else {
        setUploadStatus('Gagal membaca isi file dokumen.');
      }
    };

    reader.onerror = () => {
      setUploadStatus('Error saat membaca file dokumen.');
    };

    // Read as plain text for document formats
    reader.readAsText(file);
  };

  const handleSaveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/knowledge-base?id=${editingId}` : '/api/admin/knowledge-base';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchSources();
      } else {
        alert(data.error || 'Gagal menyimpan AI Knowledge Source');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteSource = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus sumber AI Knowledge "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/knowledge-base?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSources();
      } else {
        alert(data.error || 'Gagal menghapus AI Knowledge Source');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Judul Dokumen Pengetahuan',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block">{row.title}</span>
          <span className="text-[11px] text-slate-500 font-mono block">Kategori: {row.category}</span>
        </div>
      ),
    },
    {
      header: 'Tipe Sumber',
      cell: (row) => (
        <Badge variant="info" size="sm">
          {row.type}
        </Badge>
      ),
    },
    {
      header: 'Prioritas & Status',
      cell: (row) => (
        <div className="space-y-1">
          <Badge variant={row.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
            {row.status}
          </Badge>
          <span className="text-[10px] text-slate-500 font-mono block">Priority #{row.priority}</span>
        </div>
      ),
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit Source"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteSource(row.id, row.title)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Source"
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
          <h1 className="page-h1 text-[#071426]">AI Knowledge Base Manager</h1>
          <p className="text-xs text-slate-500">
            Unggah dokumen atau tambahkan sumber pengetahuan terverifikasi agar LST Virtual Consultant dapat mempelajari informasi secara otomatis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchSources} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Knowledge / Unggah Dokumen
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-base">Knowledge Document Learning</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI LST Consultant membaca isi dokumen PDF, TXT, DOCX, JSON, atau Markdown yang Anda unggah secara otomatis untuk memberikan jawaban ilmiah & akurat kepada calon pelanggan.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Status Pengindeksan Database</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Total Sources Active:</span>
            <span className="font-mono font-bold text-blue-600">{sources.length} Verified Sources</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Last Synced:</span>
            <span className="font-mono font-bold text-emerald-600">{formatDate(new Date())}</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sources}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyText="Belum ada AI Knowledge Source terdaftar."
      />

      {/* Modal Form Create / Edit AI Knowledge Source */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit AI Knowledge Source' : 'Tambah Knowledge / Unggah Dokumen AI'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSource} className="space-y-4">
          {/* Document File Drag & Drop Upload Zone */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-dashed border-blue-300 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1769E0] flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1769E0] hover:underline cursor-pointer">
                <span>Pilih / Drag Dokumen (.txt, .pdf, .docx, .md, .json)</span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.csv,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dokumen yang diunggah akan otomatis dibaca & dipelajari oleh model AI LST Consultant.
              </p>
            </div>
            {uploadStatus && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          <Input
            label="Judul Dokumen Pengetahuan *"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Katalog Produk Smart Classroom 75 Inch & Garansi SLA"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Tipe Sumber"
              options={[
                { label: 'Document (Panduan / Brosur)', value: 'DOCUMENT' },
                { label: 'FAQ Sync', value: 'FAQ_SYNC' },
                { label: 'Policy (Kebijakan SLA)', value: 'POLICY' },
                { label: 'Product Info', value: 'PRODUCT_INFO' },
              ]}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <Input
              label="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Hardware / SLA / Contact"
            />
            <Input
              label="Prioritas Index (1-10)"
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value || '1', 10) })}
            />
          </div>

          <Textarea
            label="Isi Konten Pengetahuan AI *"
            required
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Tuliskan atau unggah file dokumen untuk otomatis mengisi pengetahuan spesifikasi, keunggulan, harga, atau petunjuk penggunaan..."
          />

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Disetujui untuk Dipakai Model AI</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update Knowledge Source' : 'Simpan Knowledge Source'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
