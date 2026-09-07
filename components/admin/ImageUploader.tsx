'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Unggah Gambar (Otomatis Kompresi & WebP)',
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image on client canvas before uploading
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal memproses canvas gambar'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first, fallback to JPEG
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Gagal mengompresi gambar'));
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => reject(new Error('Format file gambar tidak valid'));
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (JPG, PNG, WebP, GIF)');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      // 1. Compress Image
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
        type: 'image/webp',
      });

      // 2. Upload to server
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setPreviewUrl(data.url);
        onChange(data.url);
      } else {
        setErrorMsg(data.error || 'Gagal mengunggah gambar');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center gap-4">
          <img
            src={previewUrl}
            alt="Preview Upload"
            className="w-20 h-20 rounded-lg object-contain bg-white border border-slate-200 shrink-0"
          />
          <div className="flex-1 overflow-hidden space-y-1">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Gambar Terunggah & Terkompresi
            </span>
            <p className="text-[11px] text-slate-500 truncate font-mono">{previewUrl}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Hapus Gambar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-brand-50/50 transition-all flex flex-col items-center justify-center space-y-2"
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Mengompresi & Mengunggah Gambar...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Klik atau Drag & Drop Gambar di sini</p>
                <p className="text-[11px] text-slate-500">Format JPG, PNG, WebP (Otomatis konversi & kompresi WebP)</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
    </div>
  );
}
