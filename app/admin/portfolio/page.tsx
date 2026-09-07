'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Edit, Trash2, ExternalLink } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const INITIAL_FORM_DATA = {
  title: '',
  slug: '',
  sector: 'Education',
  location: '',
  solutionType: 'Smart Classroom',
  challengeText: '',
  scopeText: '',
  resultText: '',
  coverImageUrl: '',
  status: 'PUBLISHED',
  isPublished: true,
};

export default function AdminPortfolioPage() {
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const fetchPortfolio = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      const data = await res.json();
      if (data.success) setPortfolioList(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      sector: item.sector || 'Education',
      location: item.location || '',
      solutionType: item.solutionType || 'Smart Classroom',
      challengeText: item.challengeText || '',
      scopeText: item.scopeText || '',
      resultText: item.resultText || '',
      coverImageUrl: item.coverImageUrl || '',
      status: item.status || 'PUBLISHED',
      isPublished: item.isPublished ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `portofolio-${Date.now()}`;
      const payload = {
        ...formData,
        slug,
        coverImageUrl: formData.coverImageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000',
      };

      const url = editingId ? `/api/admin/portfolio?id=${editingId}` : '/api/admin/portfolio';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        handleCloseModal();
        fetchPortfolio();
      } else {
        alert(data.error || 'Gagal menyimpan portofolio');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat menyimpan portofolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus portofolio "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPortfolio();
      } else {
        alert(data.error || 'Gagal menghapus portofolio');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat menghapus portofolio');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Studi Kasus & Foto',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            <img
              src={row.coverImageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000'}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-xs text-[#071426] block line-clamp-1">{row.title}</span>
            <span className="text-[11px] text-slate-500 block">
              {row.location} ({row.sector})
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Tipe Solusi',
      cell: (row) => (
        <span className="text-xs font-semibold text-[#1769E0]">
          {row.solutionType}
        </span>
      ),
    },
    {
      header: 'Hasil & Impact',
      cell: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">
          {row.resultText}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isPublished ? 'success' : 'neutral'} size="sm">
          {row.isPublished ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <a
            href={`/portfolio/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title="Lihat Halaman Public"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit Portofolio"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeletePortfolio(row.id, row.title)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Portofolio"
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
          <h1 className="page-h1 text-[#071426]">Portofolio & Studi Kasus Proyek</h1>
          <p className="text-xs text-slate-500">
            Showcase rekam jejak sukses implementasi teknologi LST untuk Sekolah, Perguruan Tinggi, dan Perusahaan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchPortfolio} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Portofolio
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={portfolioList}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyText="Belum ada studi kasus portofolio terdaftar."
      />

      {/* Modal Create / Edit Portfolio */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Studi Kasus Portofolio' : 'Tambah Studi Kasus Portofolio Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSavePortfolio} className="space-y-4">
          <Input
            label="Judul Proyek / Studi Kasus *"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Digitalisasi Pembelajaran Smart Classroom Universitas X"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Sektor Klien"
              options={[
                { label: 'Pendidikan (Education)', value: 'Education' },
                { label: 'Korporasi (Corporate)', value: 'Corporate' },
                { label: 'Pemerintah (Government)', value: 'Government' },
                { label: 'Yayasan (Foundation)', value: 'Foundation' },
              ]}
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
            <Input
              label="Lokasi Proyek *"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Temanggung, Jawa Tengah"
            />
            <Input
              label="Tipe Solusi *"
              required
              value={formData.solutionType}
              onChange={(e) => setFormData({ ...formData, solutionType: e.target.value })}
              placeholder="Smart Classroom 75 Inch"
            />
          </div>

          <Textarea
            label="Tantangan / Masalah Awal Klien *"
            required
            rows={2}
            value={formData.challengeText}
            onChange={(e) => setFormData({ ...formData, challengeText: e.target.value })}
            placeholder="Proyektor lama sering redup, ruang kuliah tidak memiliki sistem audio visual terpadu..."
          />

          <Textarea
            label="Lingkup Pekerjaan LST *"
            required
            rows={2}
            value={formData.scopeText}
            onChange={(e) => setFormData({ ...formData, scopeText: e.target.value })}
            placeholder="Instalasi 10 unit Interactive Board 75 Inch, Pemasangan Jaringan LAN & Wifi 6..."
          />

          <Textarea
            label="Hasil & Dampak (Result) *"
            required
            rows={2}
            value={formData.resultText}
            onChange={(e) => setFormData({ ...formData, resultText: e.target.value })}
            placeholder="Efisiensi waktu mengajar meningkat 40%, interaktivitas mahasiswa naik signifikan..."
          />

          {/* Image Uploader for Cover Image */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Foto Utama Proyek (Cover Image)</label>
            <ImageUploader
              value={formData.coverImageUrl}
              onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : editingId ? 'Update Portofolio' : 'Simpan Portofolio Baru'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
