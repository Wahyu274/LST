'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, Briefcase, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    sector: 'Education',
    location: '',
    value: 0,
    progress: 0,
    paymentStatus: 'UNPAID',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'PLANNING',
  });

  // Progress Update Modal State
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const res = await fetch(`/api/admin/projects?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsUpdatingProgress(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: updateProgress,
          status: updateStatus,
          updateNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Judul Proyek & Klien',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block line-clamp-1">{row.title}</span>
          <span className="text-[11px] text-slate-600 block">{row.clientName} ({row.sector})</span>
        </div>
      ),
    },
    {
      header: 'Nilai & Pembayaran',
      cell: (row) => (
        <div>
          <span className="text-xs font-bold text-[#1769E0] block">{formatCurrency(row.value)}</span>
          <Badge
            variant={
              row.paymentStatus === 'PAID'
                ? 'success'
                : row.paymentStatus === 'PARTIAL'
                ? 'warning'
                : 'neutral'
            }
            size="sm"
          >
            {row.paymentStatus}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Progress Layanan',
      cell: (row) => (
        <div className="w-36 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-[#071426]">
            <span>{row.progress}%</span>
            <span>{row.status}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-300 ${
                row.progress === 100 ? 'bg-emerald-500' : 'bg-[#1769E0]'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Tanggal Pelaksanaan',
      cell: (row) => (
        <div className="text-[11px] font-mono text-slate-600">
          <div>Mulai: {new Date(row.startDate).toLocaleDateString('id-ID')}</div>
          {row.endDate && <div>Selesai: {new Date(row.endDate).toLocaleDateString('id-ID')}</div>}
        </div>
      ),
    },
    {
      header: 'Aksi Update',
      className: 'text-right',
      cell: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedProject(row);
            setUpdateProgress(row.progress);
            setUpdateStatus(row.status);
            setUpdateNote('');
          }}
        >
          Update Progress
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="page-h1 text-[#071426]">Manajemen & Monitoring Proyek</h1>
          <p className="text-xs text-slate-500">
            Pelacakan progres instalasi Smart Classroom, Jaringan Fiber Optic, CCTV, dan Pengadaan Perangkat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchProjects} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Buat Proyek Baru
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyText="Belum ada proyek aktif."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul proyek, klien, atau lokasi..."
      />

      {/* Modal Create Project */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Proyek Implementasi Baru"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Judul Proyek"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Pengadaan Smart Classroom & IFP 75 Inch"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Klien / Institusi"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
            <Select
              label="Sektor Institusi"
              options={[
                { label: 'Pendidikan (Education)', value: 'Education' },
                { label: 'Korporasi (Corporate)', value: 'Corporate' },
                { label: 'Pemerintah (Government)', value: 'Government' },
                { label: 'Yayasan (Foundation)', value: 'Foundation' },
              ]}
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Lokasi Proyek"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Temanggung, Jawa Tengah"
            />
            <Input
              label="Nilai Proyek (Rp)"
              type="number"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Estimasi Selesai"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <Select
              label="Status Awal"
              options={[
                { label: 'PLANNING', value: 'PLANNING' },
                { label: 'PROCUREMENT', value: 'PROCUREMENT' },
                { label: 'INSTALLATION', value: 'INSTALLATION' },
                { label: 'TESTING', value: 'TESTING' },
                { label: 'COMPLETED', value: 'COMPLETED' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Proyek
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Progress Update */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={`Update Progres: ${selectedProject?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#111827]">
              Persentase Progres ({updateProgress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={updateProgress}
              onChange={(e) => setUpdateProgress(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1769E0]"
            />
          </div>

          <Select
            label="Status Milestone"
            options={[
              { label: 'PLANNING', value: 'PLANNING' },
              { label: 'PROCUREMENT', value: 'PROCUREMENT' },
              { label: 'INSTALLATION', value: 'INSTALLATION' },
              { label: 'TESTING', value: 'TESTING' },
              { label: 'COMPLETED', value: 'COMPLETED' },
              { label: 'ON_HOLD', value: 'ON_HOLD' },
              { label: 'CANCELLED', value: 'CANCELLED' },
            ]}
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value)}
          />

          <Textarea
            label="Catatan Perkembangan Lapangan"
            required
            rows={3}
            value={updateNote}
            onChange={(e) => setUpdateNote(e.target.value)}
            placeholder="Pemasangan kabel FO selesai 100%, lanjut tes koneksi bandwith..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedProject(null)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUpdatingProgress}>
              Simpan Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
