'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, RefreshCw, Eye, EyeOff, Edit, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: '',
    sku: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    specifications: '{"Garansi": "1 Tahun Resmi", "Distributor": "CV Life Solution Technology"}',
    price: 0,
    showPrice: false,
    availability: 'IN_STOCK',
    status: 'PUBLISHED',
    isFeatured: false,
    imageUrl: '',
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      brand: 'LST Enterprise',
      sku: '',
      categoryId: categories[0]?.id || '',
      shortDescription: '',
      description: '',
      specifications: '{"Garansi": "1 Tahun Resmi"}',
      price: 0,
      showPrice: false,
      availability: 'IN_STOCK',
      status: 'PUBLISHED',
      isFeatured: false,
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      brand: prod.brand,
      sku: prod.sku || '',
      categoryId: prod.categoryId,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      specifications: typeof prod.specifications === 'string' ? prod.specifications : JSON.stringify(prod.specifications),
      price: prod.price || 0,
      showPrice: prod.showPrice ?? false,
      availability: prod.availability || 'IN_STOCK',
      status: prod.status || 'PUBLISHED',
      isFeatured: prod.isFeatured ?? false,
      imageUrl: prod.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/products?id=${editingId}` : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || 'Gagal menyimpan produk');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || 'Gagal menghapus produk');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Visual',
      cell: (row) => (
        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
          <img src={row.imageUrl || '/images/placeholder-product.png'} alt={row.name} className="max-h-full object-contain" />
        </div>
      ),
    },
    {
      header: 'Nama Produk & Brand',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block">{row.name}</span>
          <span className="text-[11px] text-slate-500 block">Brand: {row.brand} | SKU: {row.sku || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Kategori',
      cell: (row) => <span className="text-xs text-slate-700 font-medium">{row.category?.name || '-'}</span>,
    },
    {
      header: 'Harga B2B',
      cell: (row) => (
        <div>
          <span className="text-xs font-bold text-[#071426] block">
            {row.price ? formatCurrency(row.price) : 'Call Sales'}
          </span>
          {row.showPrice ? (
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Tampil
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> Hidden (B2B)
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="space-y-1">
          <Badge variant={row.status === 'PUBLISHED' ? 'success' : 'neutral'} size="sm">
            {row.status}
          </Badge>
          {row.isFeatured && (
            <Badge variant="info" size="sm" className="block w-max">
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
            title="Edit Produk"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id, row.name)}
            className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Produk"
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
          <h1 className="page-h1 text-[#071426]">CMS Katalog Produk B2B</h1>
          <p className="text-xs text-slate-500">
            Kelola katalog hardware, unggah gambar produk, set spesifikasi, dan harga.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchProducts} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Produk Baru
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk, brand, atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyText="Belum ada produk terdaftar."
      />

      {/* Modal Form Create / Edit Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Produk Katalog B2B' : 'Tambah Produk Katalog Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Foto Perangkat / Produk"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Produk *"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Interactive Flat Panel 75 Inch"
            />
            <Input
              label="Brand / Merek *"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Hikvision / Dahua / Maxhub"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Kategori Produk *"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            />
            <Input
              label="Kode SKU (Opsional)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="LST-IFP-75"
            />
            <Select
              label="Ketersediaan"
              options={[
                { label: 'In Stock', value: 'IN_STOCK' },
                { label: 'By Request', value: 'BY_REQUEST' },
                { label: 'Project Based', value: 'PROJECT_BASED' },
              ]}
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Harga Nominal (Rp)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value || '0') })}
              placeholder="0 jika Hidden / Call Sales"
            />
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showPrice}
                  onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Tampilkan Nominal Harga</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1769E0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Produk Unggulan (Featured)</span>
              </label>
            </div>
          </div>

          <Input
            label="Deskripsi Ringkas"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Papan tulis digital interaktif 4K UHD 75 Inch dengan Dual OS..."
          />

          <Textarea
            label="Deskripsi Lengkap"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Spesifikasi detail dan keunggulan produk untuk pengadaan instansi..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Update Produk' : 'Simpan Produk Baru'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
