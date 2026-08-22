'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRScannerModal from '@/components/QRScannerModal';
import { QrCode, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VerifySearchPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certInput.trim()) {
      router.push(`/verify/${certInput.trim()}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Portal Público de Verificación de Certificados
        </h1>
        <p className="text-sm text-slate-600">
          Ingrese el número de certificado o utilice la cámara para escanear el código QR impreso.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Número Único de Certificado Municipal:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="Ej. CERT-2026-SJ-00912"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!certInput.trim()}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl shadow-md disabled:opacity-50 flex items-center space-x-2"
            >
              <span>Verificar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="relative border-t border-slate-100 pt-6 text-center">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 text-sky-900 font-bold text-xs hover:bg-sky-100 flex items-center justify-center space-x-2 transition-colors"
          >
            <QrCode className="w-5 h-5 text-sky-600" />
            <span>Abrir Escáner de Cámara para Código QR</span>
          </button>
        </div>
      </div>

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}
