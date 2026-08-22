'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import MetricCard from '@/components/MetricCard';
import {
  Building2,
  ShieldCheck,
  BarChart3,
  HardDrive,
  Users,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function SuperAdminPage() {
  const { state } = useStore();

  const totalProperties = state.properties.length;
  const totalCertificates = state.certificates.length;
  const totalPayments = state.payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Super Admin Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800/50">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLATAFORMA SAAS GLOBAL • SUPER ADMIN</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-white">
            Consola Global de Administración SaaS MuniTrack
          </h1>
          <p className="text-sm text-purple-200">
            Gestión centralizada de inquilinos gubernamentales, suscripciones, almacenamiento y salud de servicios.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-purple-900/50 p-3 rounded-2xl border border-purple-700">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-bold block text-white">Estado Global de Infraestructura</span>
            <span className="text-emerald-400 font-semibold">100% Operativo • RLS Activo</span>
          </div>
        </div>
      </div>

      {/* Global SaaS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Municipios Inquilinos"
          value={state.municipalities.length}
          subtitle="Tenants SaaS activos"
          icon={Building2}
          color="purple"
        />
        <MetricCard
          title="Propiedades Globales"
          value={totalProperties}
          subtitle="Expedientes en el sistema"
          icon={Layers}
          color="blue"
        />
        <MetricCard
          title="Certificados QR Emitidos"
          value={totalCertificates}
          subtitle="Firma PKI validada"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Recaudación SaaS Global"
          value={`$${totalPayments.toFixed(2)}`}
          subtitle="Transacciones procesadas"
          icon={BarChart3}
          color="indigo"
        />
      </div>

      {/* Tenants Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Municipios Registrados en la Infraestructura SaaS
            </h2>
            <p className="text-xs text-slate-500">
              Cada municipio posee aislamiento de datos mediante RLS, esquema de colores y marca propia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.municipalities.map((muni) => (
            <div key={muni.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: muni.primaryColor }}
                  >
                    {muni.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{muni.name}</h3>
                    <p className="text-xs text-slate-500">Slug: {muni.slug}.munitrack.gov.pr</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  PLAN ENTERPRISE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Email de Contacto</span>
                  <span className="font-semibold text-slate-800">{muni.contactEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Teléfono</span>
                  <span className="font-semibold text-slate-800">{muni.contactPhone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Módulos Habilitados:</span>
                <div className="flex flex-wrap gap-1.5">
                  {muni.activeModules.map((mod) => (
                    <span key={mod} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
