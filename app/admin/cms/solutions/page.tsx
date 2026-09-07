'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, RefreshCw, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    iconName: 'Cpu',
    tagline: '',
    problemText: '',
    scopeText: '',
    processText: '',
    imageUrl: '',
    status: 'PUBLISHED',
    isFeatured: true,
    sortOrder: 0,
  });

  const fetchSolutions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/solutions');
      const data = await res.json();
      if (data.success) setSolutions(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      iconName: 'Cpu',
      tagline: '',
      problemText: '',
      scopeText: '',
      processText: '',
      imageUrl: '',
      status: 'PUBLISHED',
      isFeatured: true,
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sol: any) => {
    setEditingId(sol.id);
    setFormData({
      title: sol.title,
      slug: sol.slug,
      iconName: sol.iconName || 'Cpu',
      tagline: sol.tagline || '',
      problemText: sol.problemText || '',
      scopeText: sol.scopeText || '',
      processText: sol.processText || '',
      imageUrl: sol.imageUrl || '',
      status: sol.status || 'PUBLISHED',
      isFeatured: sol.isFeatured ?? true,
      sortOrder: sol.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/solutions?id=${editingId}` : '/api/admin/solutions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchSolutions();
      } else {
        alert(data.error || 'Gagal menyimpan solusi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteSolution = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus solusi "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/solutions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSolutions();
      } else {
        alert(data.error || 'Gagal menghapus solusi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Gambar & Solusi',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <span className="font-bold text-xs text-[#071426] block">{row.title}</span>
            <span className="text-[11px] text-slate-500 block line-clamp-1">{row.tagline}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Masalah Yang Diselesaikan',
      cell: (row) => (
        <span className="text-xs text-slate-600 line-clamp-2">
          {row.problemText}
        </span>
      ),
    },
    {
      header: 'Status & Unggulan',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={row.status === 'PUBLISHED' ? 'success' : 'neutral'} size="sm">
            {row.status}
          </Badge>
          {row.isFeatured && (
            <Badge variant="info" size="sm">
              Featured
            </Badge>
          )}
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
            title="Edit Solusi"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteSolution(row.id, row.title)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Solusi"
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
          <h1 className="page-h1 text-[#071426]">Layanan & Solusi Integrasi IT</h1>
          <p className="text-xs text-slate-500">
            Kelola penawaran paket solusi enterprise lengkap dengan gambar banner, spesifikasi, dan SLA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchSolutions} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Solusi Baru
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={solutions}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyText="Belum ada solusi integrasi terdaftar."
      />

      {/* Modal Form Create / Edit Solution */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Solusi Integrasi' : 'Tambah Solusi Integrasi Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSolution} className="space-y-4">
          <Input
            label="Judul Solusi Integrasi"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Smart Classroom & Digital Learning"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tagline Ringkas"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Transformasi Ruang Kelas Modern Berbasis Interactive Board"
            />
            <Select
              label="Ikon Visual"
              options={[
                { label: 'Cpu (Processor / Tech)', value: 'Cpu' },
                { label: 'GraduationCap (Pendidikan)', value: 'GraduationCap' },
                { label: 'Network (Jaringan FO)', value: 'Network' },
                { label: 'ShieldCheck (Keamanan CCTV)', value: 'ShieldCheck' },
                { label: 'Server (Infrastruktur Data)', value: 'Server' },
              ]}
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#071426] mb-1.5">
              Gambar Sampul / Visual Solusi
            </label>
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <Textarea
            label="Masalah Utama Yang Diselesaikan"
            required
            rows={2}
            value={formData.problemText}
            onChange={(e) => setFormData({ ...formData, problemText: e.target.value })}
            placeholder="Pembelajaran konvensional kurang interaktif dan sulit mengintegrasikan materi digital..."
          />

          <Textarea
            label="Lingkup Pekerjaan (Scope of Work)"
            required
            rows={2}
            value={formData.scopeText}
            onChange={(e) => setFormData({ ...formData, scopeText: e.target.value })}
            placeholder="Penyediaan 75 inch Interactive Board, Mini PC OPS, Soundbar System, Training Pengajar..."
          />

          <Textarea
            label="Tahapan Implementasi & SLA"
            required
            rows={2}
            value={formData.processText}
            onChange={(e) => setFormData({ ...formData, processText: e.target.value })}
            placeholder="Survey lokasi -> Instalasi braket & kabeling -> Calibration -> Handover garansi 3 tahun..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update Solusi' : 'Simpan Solusi'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
