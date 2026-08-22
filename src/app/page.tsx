'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import QRScannerModal from '@/components/QRScannerModal';
import {
  Building2,
  ShieldCheck,
  Search,
  FileCheck,
  ArrowRight,
  Compass,
  QrCode,
  Lock,
  CreditCard,
  Sparkles,
  Layers,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { activeMunicipality, setCurrentUserRole } = useStore();
  const [certSearch, setCertSearch] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Active Tenant Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeMunicipality.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-8">
          {/* Tenant Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-sky-300">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>{activeMunicipality.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Código Municipal #{activeMunicipality.code}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Plataforma Municipal de Registro y Cumplimiento de Propiedades
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Digitalice al 100% el registro de sus propiedades, entrega de documentos, trámites de permisos, pagos municipales y emisión instantánea de Certificados de Cumplimiento verificables por código QR.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-4xl">
            <Link
              href="/citizen"
              onClick={() => setCurrentUserRole('CITIZEN')}
              className="p-5 rounded-2xl bg-white text-slate-900 hover:shadow-xl transition-all group flex flex-col justify-between border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900 font-heading">Portal Ciudadano</h3>
                <p className="text-xs text-slate-500 mt-1">Registrar propiedades, subir documentos y descargar certificados.</p>
              </div>
            </Link>

            <Link
              href="/municipal"
              onClick={() => setCurrentUserRole('OFFICIAL')}
              className="p-5 rounded-2xl bg-white text-slate-900 hover:shadow-xl transition-all group flex flex-col justify-between border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900 font-heading">Portal Municipal</h3>
                <p className="text-xs text-slate-500 mt-1">Revisión de solicitudes, inspecciones, expedientes y aprobación.</p>
              </div>
            </Link>

            <button
              onClick={() => setIsQRModalOpen(true)}
              className="p-5 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 hover:shadow-xl transition-all text-left flex flex-col justify-between border border-slate-700 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300 group-hover:scale-110 transition-transform">
                  <QrCode className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-white font-heading">Verificación QR</h3>
                <p className="text-xs text-slate-400 mt-1">Escanear o validar certificado oficial en tiempo real.</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Public Search & Verification Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center space-x-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>Consulta Pública y Verificación Oficial</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
                Verifique la Validez de cualquier Certificado
              </h2>
            </div>

            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-md"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Abrir Escáner de Cámara QR</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="Ingrese número de certificado (ej. CERT-2026-SJ-00912)..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <Link
              href={certSearch.trim() ? `/verify/${certSearch.trim()}` : '#'}
              className={`px-6 py-3 rounded-2xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2 ${
                !certSearch.trim() ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <span>Consultar Registro</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Core Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-sky-600 uppercase tracking-widest">
            Arquitectura de Grado Gubernamental
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Diseñada para Municipios Modernos y Eficientes
          </h2>
          <p className="text-sm text-slate-600">
            Una infraestructura unificada que elimina trámites presenciales y garantiza máxima seguridad jurídica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-heading">Aislamiento Multi-Tenant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada municipio opera en su propio entorno aislado con marcas personalizadas, tarifas, firmas, flujos y políticas RLS dinámicas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-heading">Pagos ATH Móvil & Tarjetas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integración nativa con pasarelas digitales y generación de boletines para pago presencial en la Caja Municipal con conciliación en tiempo real.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-heading">Auditoría Criptográfica</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trazabilidad append-only con firmas PKI X.509 e inmutabilidad garantizada a nivel de base de datos contra borrados o alteraciones.
            </p>
          </div>
        </div>
      </section>

      {/* QR Scanner Modal */}
      <QRScannerModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
}
