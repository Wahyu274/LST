'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw } from 'lucide-react';

export default function SalesAnalyticsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    code: `TRX-LST-${Date.now().toString().slice(-6)}`,
    clientName: '',
    category: 'IT Equipment',
    paymentStatus: 'UNPAID',
    items: [
      { productName: '', quantity: 1, price: 0 }
    ],
  });

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/sales');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalRev = transactions.reduce((acc: number, curr: any) => acc + curr.totalRevenue, 0);
  const avgDeal = transactions.length > 0 ? totalRev / transactions.length : 0;

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, price: 0 }],
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    if (field === 'productName') newItems[index].productName = value;
    if (field === 'quantity') newItems[index].quantity = parseInt(value || '0', 10);
    if (field === 'price') newItems[index].price = parseFloat(value || '0');
    
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    // Calculate total revenue from items
    const totalRevenue = formData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const payload = {
      ...formData,
      totalRevenue,
    };

    try {
      const res = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        setIsModalOpen(false);
        setFormData({
          code: `TRX-LST-${Date.now().toString().slice(-6)}`,
          clientName: '',
          category: 'IT Equipment',
          paymentStatus: 'UNPAID',
          items: [{ productName: '', quantity: 1, price: 0 }],
        });
        fetchTransactions();
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan transaksi.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sales & Revenue Analytics</h1>
          <p className="text-xs text-slate-500">
            Laporan transaksi penjualan perangkat hardware, lisensi, & kontrak pengadaan LST.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchTransactions} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue (Gross)</span>
          <h3 className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalRev)}</h3>
          <p className="text-[11px] text-slate-400">Total penjualan terverifikasi</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Deals Closed</span>
          <h3 className="text-2xl font-extrabold text-slate-900">{transactions.length} Transaksi</h3>
          <p className="text-[11px] text-slate-400">Kontrak pengadaan rampung</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-Rata Nilai Deal</span>
          <h3 className="text-2xl font-extrabold text-brand-600">{formatCurrency(avgDeal)}</h3>
          <p className="text-[11px] text-slate-400">Average deal size per instansi</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Rincian Transaksi Penjualan</h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500 text-sm">Memuat data transaksi...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">Belum ada transaksi penjualan.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Kode Transaksi</th>
                  <th className="py-3 px-4">Klien / Pembeli</th>
                  <th className="py-3 px-4">Kategori Solusi</th>
                  <th className="py-3 px-4">Tanggal Transaksi</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.clientName}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.category}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(tx.saleDate)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(tx.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Transaksi Penjualan Manual"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Kode Transaksi" required value={formData.code} readOnly className="bg-slate-50 font-mono" />
            <Input
              label="Nama Klien / Pembeli"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="PT Contoh Solusi"
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="IT Equipment">IT Equipment</option>
                <option value="Software License">Software License</option>
                <option value="Managed Services">Managed Services</option>
                <option value="Project">Project</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Status Pembayaran</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="PAID">Lunas (PAID)</option>
                <option value="UNPAID">Belum Dibayar (UNPAID)</option>
                <option value="PARTIAL">Cicilan (PARTIAL)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs font-bold text-[#071426] uppercase tracking-wider">Item Terjual</span>
              <Button variant="secondary" size="sm" type="button" onClick={handleAddItem}>
                + Tambah Item
              </Button>
            </div>

            {formData.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#F7F9FC] p-3 rounded-[8px] border border-[#E2E8F0]">
                <div className="col-span-5">
                  <Input
                    placeholder="Nama Produk/Layanan"
                    required
                    value={item.productName}
                    onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    required
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    placeholder="Harga Satuan"
                    required
                    min="0"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {/* Remove button could go here */}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-bold text-slate-700">Estimasi Total:</span>
            <span className="text-lg font-extrabold text-brand-600">
              {formatCurrency(formData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0))}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
