'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    status: 'PUBLISHED',
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', sortOrder: 0, status: 'PUBLISHED' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sortOrder: cat.sortOrder || 0,
      status: cat.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/categories?id=${editingId}` : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert(data.error || 'Gagal menyimpan kategori');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || 'Gagal menghapus kategori');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Nama Kategori & Slug',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-mono block">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Deskripsi Singkat',
      cell: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1">
          {row.description || 'Tidak ada deskripsi'}
        </span>
      ),
    },
    {
      header: 'Urutan (Sort)',
      cell: (row) => <span className="text-xs font-mono font-bold text-slate-700">{row.sortOrder}</span>,
    },
    {
      header: 'Status',
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
            title="Edit Kategori"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCategory(row.id, row.name)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Kategori"
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
          <h1 className="page-h1 text-[#071426]">Kategori Produk IT & Hardware</h1>
          <p className="text-xs text-slate-500">
            Kelola pengelompokan produk seperti Smart Classroom, Fiber Optic, CCTV, dan Network Infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchCategories} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Kategori
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyText="Belum ada kategori produk terdaftar."
      />

      {/* Modal Form Create / Edit Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Kategori Produk' : 'Tambah Kategori Produk Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Nama Kategori"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Smart Classroom & IFP"
          />

          <Input
            label="URL Slug (Otomatis)"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="font-mono bg-slate-50"
          />

          <Input
            label="Urutan Tampil (Sort Order)"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value || '0', 10) })}
          />

          <Textarea
            label="Deskripsi Kategori"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Perangkat interaktif papan tulis digital dan perangkat audio visual kelas modern..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update Kategori' : 'Simpan Kategori'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
