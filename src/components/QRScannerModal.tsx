'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, QrCode, Camera, CheckCircle2, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = (certNumber: string) => {
    onClose();
    router.push(`/verify/${certNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold font-heading">Escanear o Verificar Certificado QR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          {/* Simulated Camera Viewfinder */}
          <div className="relative w-56 h-56 mx-auto rounded-2xl bg-slate-950 border-2 border-sky-500 flex flex-col items-center justify-center overflow-hidden shadow-inner group">
            {/* Animated Laser Scanner Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-pulse top-1/2 shadow-[0_0_15px_#38bdf8]" />

            <Camera className="w-10 h-10 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-sky-300 font-semibold px-4">
              Apunte la cámara hacia el código QR impreso en el certificado PDF
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">O seleccione un certificado emitido de prueba para verificar:</div>

          {/* Quick Test Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleSimulateScan('CERT-2026-SJ-00912')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-left flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-bold text-slate-800">CERT-2026-SJ-00912</p>
                <p className="text-[11px] text-slate-500">Municipio de San Juan • VIGENTE</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-left">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              O Ingrese el Número de Certificado Manualmente:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Ej. CERT-2026-SJ-00912"
                className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                onClick={() => certInput.trim() && handleSimulateScan(certInput.trim())}
                disabled={!certInput.trim()}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 disabled:opacity-50"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
