'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Role } from '@/lib/types';
import {
  Building2,
  UserCheck,
  Bell,
  ShieldCheck,
  Compass,
  FileCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { state, activeMunicipality, setActiveMunicipality, setCurrentUserRole } = useStore();

  const unreadNotifs = state.notifications.filter((n) => !n.read).length;

  const roles: { role: Role; label: string }[] = [
    { role: 'CITIZEN', label: 'Propietario / Ciudadano' },
    { role: 'OFFICIAL', label: 'Funcionario Municipal' },
    { role: 'SUPERVISOR', label: 'Supervisor' },
    { role: 'ADMIN', label: 'Administrador Municipal' },
    { role: 'SUPERADMIN', label: 'Super Admin SaaS' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      {/* Top Tenant Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-sky-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PLATAFORMA MULTI-TENANT</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Municipio Activo:</span>
          <select
            value={state.activeMunicipalityId}
            onChange={(e) => setActiveMunicipality(e.target.value)}
            className="bg-slate-800 text-white font-medium px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {state.municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-slate-400">Modo de Vista (Rol):</span>
          <select
            value={state.currentUser.role}
            onChange={(e) => setCurrentUserRole(e.target.value as Role)}
            className="bg-sky-950 text-sky-200 font-semibold px-2 py-0.5 rounded border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand & Dynamic Municipality Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: activeMunicipality.primaryColor }}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-heading">
                MuniOne
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600 border border-slate-200">
                GovSaaS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {activeMunicipality.name}
            </p>
          </div>
        </Link>

        {/* Portal Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname === '/'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Portal Público
          </Link>

          <Link
            href="/citizen"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/citizen')
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Portal Ciudadano</span>
          </Link>

          <Link
            href="/municipal"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/municipal')
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Portal Municipal</span>
          </Link>

          <Link
            href="/superadmin"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith('/superadmin')
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Super Admin</span>
          </Link>
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/verify/search"
            className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Verificar QR</span>
          </Link>

          <div className="relative">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={state.currentUser.avatarUrl}
              alt={state.currentUser.name}
              className="w-8 h-8 rounded-full border border-slate-300 object-cover"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {state.currentUser.name}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {state.currentUser.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
