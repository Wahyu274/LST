/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Edit2, Archive, RefreshCw, Star } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  categoryId: string;
  category?: Category;
  brand: string;
  shortDescription?: string;
  description: string;
  specifications: string;
  price?: number;
  showPrice: boolean;
  availability: string;
  status: string;
  isFeatured: boolean;
  imageUrl?: string;
  deletedAt?: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: '',
    brand: '',
    shortDescription: '',
    description: '',
    specifications: '{}',
    price: '',
    showPrice: false,
    availability: 'IN_STOCK',
    status: 'PUBLISHED',
    isFeatured: false,
    imageUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Confirm Archive State
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Load Categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      categoryId: categories[0]?.id || '',
      brand: '',
      shortDescription: '',
      description: '',
      specifications: '{\n  "Warranty": "1 Tahun Reseller"\n}',
      price: '',
      showPrice: false,
      availability: 'IN_STOCK',
      status: 'PUBLISHED',
      isFeatured: false,
      imageUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      categoryId: product.categoryId,
      brand: product.brand,
      shortDescription: product.shortDescription || '',
      description: product.description,
      specifications: product.specifications || '{}',
      price: product.price ? product.price.toString() : '',
      showPrice: product.showPrice,
      availability: product.availability,
      status: product.status,
      isFeatured: product.isFeatured,
      imageUrl: product.imageUrl || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name: val, slug }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      const url = editingProduct
        ? `/api/admin/products?id=${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setFormErrors({ form: data.error || 'Gagal menyimpan produk' });
      }
    } catch (err: any) {
      setFormErrors({ form: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/products?id=${archiveTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setArchiveTarget(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsArchiving(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'Produk & SKU',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">No Pic</span>
            )}
          </div>
          <div>
            <span className="font-bold text-xs text-[#071426] block line-clamp-1">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-mono block">SKU: {row.sku || '-'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Brand & Kategori',
      cell: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-700 block">{row.brand}</span>
          <span className="text-[11px] text-slate-500 block">{row.category?.name || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Harga (B2B)',
      cell: (row) => (
        <div>
          {row.price ? (
            <span className="text-xs font-bold text-[#1769E0] block">
              Rp {row.price.toLocaleString('id-ID')}
            </span>
          ) : (
            <span className="text-xs text-slate-400 block font-mono">By Request</span>
          )}
          <span className="text-[10px] text-slate-500 block">
            {row.showPrice ? 'Tampil Publik' : 'Sembunyi Publik'}
          </span>
        </div>
      ),
    },
    {
      header: 'Ketersediaan',
      cell: (row) => (
        <Badge
          variant={
            row.availability === 'IN_STOCK'
              ? 'success'
              : row.availability === 'BY_REQUEST'
              ? 'warning'
              : 'info'
          }
          size="sm"
        >
          {row.availability.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Badge
            variant={
              row.status === 'PUBLISHED'
                ? 'success'
                : row.status === 'ARCHIVED'
                ? 'danger'
                : 'neutral'
            }
            size="sm"
          >
            {row.status}
          </Badge>
          {row.isFeatured && (
            <span title="Featured Product" className="text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Aksi',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Produk"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={() => setArchiveTarget(row)}
            title="Arsipkan Produk"
          >
            <Archive className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="page-h1 text-[#071426]">Katalog Produk IT B2B</h1>
          <p className="text-xs text-slate-500">
            Kelola data produk hardware, Smart Board, jaringan, dan perangkat IT resmi CV Life Solution Technology.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchProducts} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyText="Belum ada produk IT yang sesuai."
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(page) => setCurrentPage(page)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Cari berdasarkan nama, brand, SKU..."
        filterElements={
          <>
            <Select
              options={[
                { label: 'Semua Kategori', value: '' },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ]}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs w-44"
            />
            <Select
              options={[
                { label: 'Semua Status', value: '' },
                { label: 'PUBLISHED', value: 'PUBLISHED' },
                { label: 'DRAFT', value: 'DRAFT' },
                { label: 'ARCHIVED', value: 'ARCHIVED' },
              ]}
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs w-36"
            />
          </>
        }
      />

      {/* Modal Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Produk IT' : 'Tambah Produk IT Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          {formErrors.form && (
            <div className="p-3 rounded-[6px] bg-red-50 border border-red-200 text-xs text-[#D64545]">
              {formErrors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Produk"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Contoh: Interactive Flat Panel 75 Inch"
            />

            <Input
              label="Slug URL"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="SKU / Kode Produk"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="LST-IFP-75"
            />

            <Input
              label="Brand / Merk"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Hikvision, Cisco, Lenovo..."
            />

            <Select
              label="Kategori Produk"
              required
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Harga B2B (Rp)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Kosongkan jika By Request"
            />

            <Select
              label="Ketersediaan"
              options={[
                { label: 'Ready Stock (IN_STOCK)', value: 'IN_STOCK' },
                { label: 'Inden / Request (BY_REQUEST)', value: 'BY_REQUEST' },
                { label: 'Khusus Proyek (PROJECT_BASED)', value: 'PROJECT_BASED' },
              ]}
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            />

            <Select
              label="Status Publikasi"
              options={[
                { label: 'PUBLISHED', value: 'PUBLISHED' },
                { label: 'DRAFT', value: 'DRAFT' },
                { label: 'ARCHIVED', value: 'ARCHIVED' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#111827] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showPrice}
                onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#1769E0] focus:ring-[#1769E0]"
              />
              Tampilkan Harga di Website Publik
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#111827] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#1769E0] focus:ring-[#1769E0]"
              />
              Jadikan Featured Product
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Unggah Gambar Utama Produk
            </label>
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <Input
            label="Deskripsi Singkat"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Ringkasan spesifikasi 1-2 kalimat"
          />

          <Textarea
            label="Deskripsi Lengkap"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Textarea
            label="Spesifikasi Teknis (JSON Format)"
            rows={3}
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog for Soft Delete */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        title="Arsipkan Produk?"
        description={`Apakah Anda yakin ingin mengarsipkan produk "${archiveTarget?.name}"? Produk tidak akan ditampilkan di katalog publik.`}
        confirmText="Arsipkan"
        isLoading={isArchiving}
      />
    </div>
  );
}
