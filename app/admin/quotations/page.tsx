'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: `QUO-LST-${Date.now().toString().slice(-6)}`,
    clientName: '',
    totalAmount: 38850000,
    status: 'DRAFT',
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    subTotal: 35000000,
    discountPercentage: 0,
    taxAmount: 3850000,
    items: [
      { itemTitle: 'Smart Classroom 75 Inch Interactive Board', quantity: 1, unitPrice: 35000000, totalPrice: 35000000 },
    ],
  });

  const fetchQuotations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const res = await fetch(`/api/admin/quotations?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuotations(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemTitle: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    const current = newItems[index];

    let qty = current.quantity;
    let price = current.unitPrice;
    let title = current.itemTitle;

    if (field === 'itemTitle') title = value;
    if (field === 'quantity') qty = parseInt(value || '0', 10);
    if (field === 'unitPrice') price = parseFloat(value || '0');

    const total = qty * price;

    newItems[index] = {
      itemTitle: title,
      quantity: qty,
      unitPrice: price,
      totalPrice: total,
    };

    const subTotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const discountNominal = (subTotal * (formData.discountPercentage || 0)) / 100;
    const taxAmount = (subTotal - discountNominal) * 0.11;
    const grandTotal = (subTotal - discountNominal) + taxAmount;
    setFormData((prev) => ({ ...prev, items: newItems, subTotal, taxAmount, totalAmount: grandTotal }));
  };

  const handleDiscountChange = (val: string) => {
    const discountPct = val === '' ? 0 : parseFloat(val);
    const subTotal = formData.items.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const discountNominal = (subTotal * discountPct) / 100;
    const taxAmount = (subTotal - discountNominal) * 0.11;
    const grandTotal = (subTotal - discountNominal) + taxAmount;
    setFormData((prev) => ({ ...prev, discountPercentage: discountPct, subTotal, taxAmount, totalAmount: grandTotal }));
  };

  const handleEditQuotation = (row: any) => {
    let discount = 0;
    let notes = row.notes || '';
    const match = notes.match(/^Diskon: (\d+(?:\.\d+)?)%\n?/);
    if (match) {
      discount = parseFloat(match[1]);
      notes = notes.replace(/^Diskon: \d+(?:\.\d+)%\n?/, '');
    }

    const subTotal = row.items.reduce((acc: any, curr: any) => acc + curr.totalPrice, 0);
    const discountNominal = (subTotal * discount) / 100;
    const taxAmount = (subTotal - discountNominal) * 0.11;

    setEditId(row.id);
    setFormData({
      code: row.code,
      clientName: row.clientName,
      totalAmount: row.totalAmount,
      status: row.status,
      validUntil: new Date(row.validUntil).toISOString().split('T')[0],
      notes: notes,
      subTotal: subTotal,
      discountPercentage: discount,
      taxAmount: taxAmount,
      items: row.items.map((it: any) => ({
        itemTitle: it.itemTitle,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
      })),
    });
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotations?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchQuotations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    const finalNotes = formData.discountPercentage > 0 
      ? `Diskon: ${formData.discountPercentage}%\n${formData.notes}` 
      : formData.notes;

    const payload = {
      ...formData,
      notes: finalNotes,
      totalAmount: Number(formData.totalAmount),
      items: formData.items.map((it) => ({
        itemTitle: it.itemTitle,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        totalPrice: Number(it.totalPrice),
      })),
    };

    try {
      const url = editId ? `/api/admin/quotations?id=${editId}` : '/api/admin/quotations';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
          code: `QUO-LST-${Date.now().toString().slice(-6)}`,
          clientName: '',
          totalAmount: 38850000,
          status: 'DRAFT',
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
          subTotal: 35000000,
          discountPercentage: 0,
          taxAmount: 3850000,
          items: [
            { itemTitle: 'Smart Classroom 75 Inch Interactive Board', quantity: 1, unitPrice: 35000000, totalPrice: 35000000 },
          ],
        });
        fetchQuotations();
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan penawaran. Periksa kembali form.');
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Kode & Klien',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block font-mono">{row.code}</span>
          <span className="text-[11px] font-semibold text-slate-700 block">{row.clientName}</span>
        </div>
      ),
    },
    {
      header: 'Total Keseluruhan',
      cell: (row) => (
        <span className="text-xs font-bold text-[#1769E0]">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Catatan & Info',
      cell: (row) => (
        <span className="text-[10px] text-slate-500 whitespace-pre-line block max-w-[200px]">
          {row.notes || '-'}
        </span>
      ),
    },
    {
      header: 'Berlaku S.D',
      cell: (row) => (
        <span className="text-xs text-slate-600 font-mono">
          {new Date(row.validUntil).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'APPROVED'
              ? 'success'
              : row.status === 'REJECTED'
              ? 'danger'
              : row.status === 'SENT'
              ? 'info'
              : 'warning'
          }
          size="sm"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Aksi Status',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 text-[11px]"
            onClick={() => handleEditQuotation(row)}
          >
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          {row.status !== 'APPROVED' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:bg-emerald-50 text-[11px]"
              onClick={() => handleStatusUpdate(row.id, 'APPROVED')}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
            </Button>
          )}
          {row.status !== 'REJECTED' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 text-[11px]"
              onClick={() => handleStatusUpdate(row.id, 'REJECTED')}
            >
              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="page-h1 text-[#071426]">Manajemen Surat Penawaran (Quotation)</h1>
          <p className="text-xs text-slate-500">
            Penyusunan penawaran harga resmi (Quotation) untuk pengadaan IT institusi & corporate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchQuotations} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => {
            setEditId(null);
            setFormData({
              code: `QUO-LST-${Date.now().toString().slice(-6)}`,
              clientName: '',
              totalAmount: 38850000,
              status: 'DRAFT',
              validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              notes: '',
              subTotal: 35000000,
              discountPercentage: 0,
              taxAmount: 3850000,
              items: [
                { itemTitle: 'Smart Classroom 75 Inch Interactive Board', quantity: 1, unitPrice: 35000000, totalPrice: 35000000 },
              ],
            });
            setIsModalOpen(true);
          }} leftIcon={<Plus className="w-4 h-4" />}>
            Buat Surat Penawaran
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={quotations}
        keyExtractor={(q) => q.id}
        isLoading={isLoading}
        emptyText="Belum ada surat penawaran harga."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari kode penawaran atau nama klien..."
      />

      {/* Modal Builder */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? "Edit Surat Penawaran Harga (Quotation)" : "Buat Surat Penawaran Harga (Quotation)"}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveQuotation} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Kode Penawaran" required value={formData.code} readOnly className="bg-slate-50 font-mono" />
            <Input
              label="Nama Klien / Institusi"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Universitas X Temanggung"
            />
            <Input
              label="Berlaku Sampai"
              type="date"
              required
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs font-bold text-[#071426] uppercase tracking-wider">Item Penawaran</span>
              <Button variant="secondary" size="sm" type="button" onClick={handleAddItem}>
                + Tambah Baris
              </Button>
            </div>

            {formData.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#F7F9FC] p-3 rounded-[8px] border border-[#E2E8F0]">
                <div className="col-span-5">
                  <Input
                    placeholder="Nama / Judul Item Perangkat"
                    value={item.itemTitle}
                    onChange={(e) => handleItemChange(idx, 'itemTitle', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Harga Satuan"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                  />
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-bold text-[#1769E0]">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sub Total</span>
              <span className="text-sm font-bold text-slate-700">
                {formatCurrency(formData.subTotal || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-slate-500">Diskon (%)</span>
              <div className="w-1/3">
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  max="100"
                  value={formData.discountPercentage === 0 ? '' : formData.discountPercentage}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mt-2">
              <span className="text-xs font-semibold text-slate-500">PPN (11%)</span>
              <span className="text-sm font-bold text-slate-700">
                {formatCurrency(formData.taxAmount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-extrabold text-[#071426]">TOTAL KESELURUHAN</span>
              <span className="text-lg font-extrabold text-[#1769E0]">
                {formatCurrency(formData.totalAmount)}
              </span>
            </div>
          </div>

          <Textarea
            label="Catatan Tambahan & Ketentuan Pembayaran"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="DP 50%, Pelunasan 50% setelah serah terima garansi..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Penawaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
