'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, RefreshCw, Edit, Trash2, Building2 } from 'lucide-react';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    category: 'PARTNER',
    sortOrder: 0,
    status: 'PUBLISHED',
  });

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      if (data.success) setPartners(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      logoUrl: '',
      category: 'PARTNER',
      sortOrder: 0,
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      logoUrl: item.logoUrl || '',
      category: item.category || 'PARTNER',
      sortOrder: item.sortOrder || 0,
      status: item.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logoUrl) {
      alert('Silakan unggah gambar logo mitra');
      return;
    }

    try {
      const url = editingId ? `/api/admin/partners?id=${editingId}` : '/api/admin/partners';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPartners();
      } else {
        alert(data.error || 'Gagal menyimpan logo mitra');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus logo mitra "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPartners();
      } else {
        alert(data.error || 'Gagal menghapus logo mitra');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Logo & Nama Mitra / Klien',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
            {row.logoUrl ? (
              <img src={row.logoUrl} alt={row.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <span className="font-bold text-xs text-[#071426] block">{row.name}</span>
            <span className="text-[11px] text-slate-500 font-mono block">Urutan: #{row.sortOrder}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Kategori Institusi',
      cell: (row) => (
        <Badge variant={row.category === 'INSTITUTION' ? 'info' : row.category === 'CLIENT' ? 'success' : 'neutral'} size="sm">
          {row.category}
        </Badge>
      ),
    },
    {
      header: 'Status Tampil',
      cell: (row) => (
        <Badge variant={row.status === 'PUBLISHED' ? 'success' : 'neutral'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit Logo"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeletePartner(row.id, row.name)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Logo"
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
          <h1 className="page-h1 text-[#071426]">Manajemen Logo Mitra & Klien</h1>
          <p className="text-xs text-slate-500">
            Kelola daftar logo institusi, sekolah, kampus, dan perusahaan mitra yang tampil pada marquee beranda publik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchPartners} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Logo Mitra
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={partners}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyText="Belum ada logo mitra terdaftar."
      />

      {/* Modal Form Create / Edit Partner */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Logo Mitra' : 'Tambah Logo Mitra Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSavePartner} className="space-y-4">
          <Input
            label="Nama Institusi / Mitra *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="PT Telkom Indonesia (Persero) / Kemendikbud"
          />

          <div>
            <label className="block text-xs font-semibold text-[#071426] mb-1.5">
              Gambar Logo Mitra *
            </label>
            <ImageUploader
              value={formData.logoUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Mitra"
              options={[
                { label: 'PARTNER (Mitra Teknologi)', value: 'PARTNER' },
                { label: 'INSTITUTION (Pemerintahan/BUMN)', value: 'INSTITUTION' },
                { label: 'CLIENT (Sekolah/Universitas)', value: 'CLIENT' },
              ]}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />

            <Input
              label="Urutan Tampil (Sort Order)"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value || '0', 10) })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update Logo Mitra' : 'Simpan Logo Mitra'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
