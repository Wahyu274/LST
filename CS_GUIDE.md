# Customer Service Operator Manual
## LST Digital Business Platform — CV Life Solution Technology

Panduan pengoperasian modul CS Workspace untuk staf Customer Service LST.

---

## 1. Membuka CS Workspace (`/cs/inbox`)

Login menggunakan akun bertipe peran `CUSTOMER_SERVICE`. Tampilan terdiri dari **Layout 3 Panel**:

```
+-------------------+------------------------------------+--------------------+
| Queue Sidebar     | Live Chat Timeline                 | Customer Context   |
| (Left)            | (Center)                           | (Right)            |
+-------------------+------------------------------------+--------------------+
| [Waiting] Chat 1  | Conversation transferred from AI  | Nama: Bp. Ahmad    |
| [Active] Chat 2   | Rangkuman AI: Smart Classroom      | Sekolah: SMA 1 Tmg |
| [Closed] Chat 3   | ---------------------------------- | HP: 08123456789    |
|                   | CS [Budi] joined conversation      | Location: Temanggung|
|                   |                                    |                    |
|                   | [CS Input Box] [Internal Note Mode]| [Mark as Lead CTA] |
+-------------------+------------------------------------+--------------------+
```

---

## 2. Alur Kerja Penanganan Chat (Workflow)

1. **Menerima Antrean Eskalasi**:
   - Klik tab **Waiting** di panel kiri.
   - Klik percakapan yang masuk dan tekan tombol **Terima Chat**.

2. **Membaca Rangkuman AI**:
   - Periksa **Rangkuman AI** di bagian atas timeline untuk mengetahui kebutuhan utama klien (misal: pengadaan 10 unit IFP & jaringan fiber optic sekolah) tanpa perlu bertanya dari awal.

3. **Menggunakan Catatan Internal (Internal Note)**:
   - Aktifkan mode **Catatan Internal (Mode Kuning)** saat ingin mencatat pesan diskusi khusus sesama tim CS/teknisi.
   - **Catatan Internal TIDAK AKAN TERLIHAT oleh pengunjung/klien**.

4. **Menyimpan Prospek ke CRM**:
   - Tekan tombol **Simpan Sebagai Lead CRM** pada panel kanan untuk memasukkan data klien langsung ke Kanban Pipeline Admin/Sales.

5. **Menutup Percakapan**:
   - Setelah kebutuhan klien terlayani, ubah status percakapan menjadi **Closed** atau **Follow-Up**.
