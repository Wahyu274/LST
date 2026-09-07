'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, RefreshCw, UserCheck, Shield, Key } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER_SERVICE',
    status: 'ACTIVE',
    mfaEnabled: false,
  });

  // Edit / Password Reset Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          status: newStatus,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Nama & Email',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-[#071426] block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-mono block">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Role Akses (RBAC)',
      cell: (row) => (
        <Badge
          variant={
            row.role === 'SUPER_ADMIN'
              ? 'danger'
              : row.role === 'SALES'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {row.role}
        </Badge>
      ),
    },
    {
      header: 'Status Akun',
      cell: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Terakhir Update',
      cell: (row) => (
        <span className="text-[11px] text-slate-500 font-mono">
          {new Date(row.updatedAt).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Aksi Management',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedUser(row);
              setNewRole(row.role);
              setNewStatus(row.status);
              setNewPassword('');
            }}
          >
            Kelola Akses
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
              try {
                const res = await fetch(`/api/admin/users?id=${row.id}`, { method: 'DELETE' });
                if (res.ok) fetchUsers();
                else alert('Gagal menghapus pengguna.');
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Hapus
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
          <h1 className="page-h1 text-[#071426]">Pengguna & Hak Akses (RBAC)</h1>
          <p className="text-xs text-slate-500">
            Kelola akun internal (Super Admin, Admin, Sales, Customer Service, & Content Editor).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchUsers} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            + Pengguna Baru
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        emptyText="Belum ada pengguna terdaftar."
      />

      {/* Modal Create User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Akun Pengguna Baru"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nama Lengkap"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ahmad Zulkarnain"
          />

          <Input
            label="Email Pengguna"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ahmad@lst.co.id"
          />

          <Input
            label="Password Awal"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimal 6 karakter"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Role Akses"
              options={[
                { label: 'CUSTOMER_SERVICE', value: 'CUSTOMER_SERVICE' },
                { label: 'SALES', value: 'SALES' },
                { label: 'CONTENT_EDITOR', value: 'CONTENT_EDITOR' },
                { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
              ]}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />

            <Select
              label="Status Akun"
              options={[
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'DISABLED', value: 'DISABLED' },
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
              Buat Pengguna
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Manage User */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Kelola Akses: ${selectedUser?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
          <Select
            label="Ubah Role Akses"
            options={[
              { label: 'CUSTOMER_SERVICE', value: 'CUSTOMER_SERVICE' },
              { label: 'SALES', value: 'SALES' },
              { label: 'CONTENT_EDITOR', value: 'CONTENT_EDITOR' },
              { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
            ]}
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />

          <Select
            label="Ubah Status Akun"
            options={[
              { label: 'ACTIVE (Aktif)', value: 'ACTIVE' },
              { label: 'DISABLED (Dinonaktifkan)', value: 'DISABLED' },
            ]}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />

          <Input
            label="Reset Password Baru (Opsional)"
            type="password"
            placeholder="Isi hanya jika ingin mereset password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedUser(null)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUpdating}>
              Simpan Akses
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
