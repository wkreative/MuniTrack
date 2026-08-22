'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { loginUser } from '@/lib/firebase';
import { Role } from '@/lib/types';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { state, setCurrentUserRole, setActiveMunicipality } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('CITIZEN');
  const [selectedMuniId, setSelectedMuniId] = useState(state.activeMunicipalityId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Intentar autenticación real en Firebase
      const profile = await loginUser(email, password);

      // Actualizar el estado global con el perfil y rol devuelto
      if (profile) {
        setCurrentUserRole(profile.role);
        setActiveMunicipality(profile.municipalityId || selectedMuniId);
      } else {
        setCurrentUserRole(selectedRole);
        setActiveMunicipality(selectedMuniId);
      }

      setSuccessMsg('¡Autenticación exitosa! Redirigiendo...');
      setTimeout(() => {
        const targetRole = profile?.role || selectedRole;
        if (targetRole === 'CITIZEN') router.push('/citizen');
        else if (targetRole === 'SUPERADMIN') router.push('/superadmin');
        else router.push('/municipal');
      }, 1000);
    } catch (err: any) {
      console.warn('[Firebase Auth] Autenticación local fallback:', err);
      // Fallback para testing de la demostración si no ha creado la cuenta en Firebase aún
      setCurrentUserRole(selectedRole);
      setActiveMunicipality(selectedMuniId);
      setSuccessMsg('Acceso de demostración concedido. Redirigiendo...');
      setTimeout(() => {
        if (selectedRole === 'CITIZEN') router.push('/citizen');
        else if (selectedRole === 'SUPERADMIN') router.push('/superadmin');
        else router.push('/municipal');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: Role, muniId: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(role);
    setSelectedMuniId(muniId);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-900/5 py-12 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white text-center space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-white">MuniTrack</h1>
            <p className="text-xs text-slate-400 mt-1">
              Plataforma Municipal de Registro y Cumplimiento de Propiedades
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@municipio.gov.pr"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Municipality Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Municipio de Jurisdicción
            </label>
            <select
              value={selectedMuniId}
              onChange={(e) => setSelectedMuniId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {state.municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
          </div>

          {/* Role Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Rol de Acceso al Sistema
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-sky-900 focus:outline-none"
            >
              <option value="CITIZEN">Propietario / Ciudadano</option>
              <option value="OFFICIAL">Funcionario Municipal</option>
              <option value="SUPERVISOR">Supervisor Municipal</option>
              <option value="ADMIN">Administrador Municipal</option>
              <option value="SUPERADMIN">Super Admin SaaS Global</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Autenticando en Firebase...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Selectors */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Prueba Rápida con Usuarios de Demostración:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin('CITIZEN', 'muni-sanjuan', 'carlos.rivera@gmail.com')}
              className="p-2 rounded-lg border bg-white hover:bg-sky-50 text-left font-semibold text-slate-700"
            >
              👤 Carlos Rivera (Ciudadano)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('OFFICIAL', 'muni-sanjuan', 'h.ortiz@sanjuan.pr')}
              className="p-2 rounded-lg border bg-white hover:bg-sky-50 text-left font-semibold text-slate-700"
            >
              🏛️ Lcdo. Héctor (Funcionario)
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="p-4 text-center text-xs text-slate-500 border-t">
          ¿No tiene cuenta aún?{' '}
          <Link href="/register" className="font-bold text-sky-700 hover:underline">
            Regístrese aquí gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}
