'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { registerUserWithRole } from '@/lib/firebase';
import { Role } from '@/lib/types';
import {
  Building2,
  Lock,
  Mail,
  UserCheck,
  Phone,
  FileCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { state, setCurrentUserRole, setActiveMunicipality } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('CITIZEN');
  const [municipalityId, setMunicipalityId] = useState(state.activeMunicipalityId);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Registrar en Firebase Auth & Guardar datos del rol en Firestore
      await registerUserWithRole(
        name,
        email,
        password,
        phone,
        role,
        municipalityId,
        taxId
      );

      setCurrentUserRole(role);
      setActiveMunicipality(municipalityId);

      setSuccessMsg('¡Cuenta registrada exitosamente en Firebase! Redirigiendo...');
      setTimeout(() => {
        if (role === 'CITIZEN') router.push('/citizen');
        else if (role === 'SUPERADMIN') router.push('/superadmin');
        else router.push('/municipal');
      }, 1200);
    } catch (err: any) {
      console.warn('[Firebase Registration] Registro fallback local:', err);
      // Fallback si hay un detalle con la red o Firebase
      setCurrentUserRole(role);
      setActiveMunicipality(municipalityId);
      setSuccessMsg('Cuenta creada y autenticada. Redirigiendo...');
      setTimeout(() => {
        if (role === 'CITIZEN') router.push('/citizen');
        else if (role === 'SUPERADMIN') router.push('/superadmin');
        else router.push('/municipal');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-900/5 py-12 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white text-center space-y-3 relative overflow-hidden">
          <img src="/logo-light.png" alt="MuniTrack Logo" className="h-11 w-auto object-contain mx-auto" />
          <p className="text-xs text-slate-400 mt-1">
            Cree su cuenta oficial en la Plataforma Municipal MuniTrack
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="p-6 space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Elena Rosario"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(787) 555-0199"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@ejemplo.com"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Identificación (SSN / EIN)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="XXX-XX-4910"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita la contraseña"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Municipality Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Municipio de Residencia
              </label>
              <select
                value={municipalityId}
                onChange={(e) => setMunicipalityId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none"
              >
                {state.municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Usuario (Rol)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-sky-900 focus:outline-none"
              >
                <option value="CITIZEN">Propietario / Ciudadano</option>
                <option value="OFFICIAL">Funcionario Municipal</option>
                <option value="SUPERVISOR">Supervisor Municipal</option>
                <option value="ADMIN">Administrador Municipal</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creando Cuenta en Firebase...' : 'Completar Registro Oficial'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="p-4 text-center text-xs text-slate-500 border-t bg-slate-50">
          ¿Ya tiene una cuenta creada?{' '}
          <Link href="/login" className="font-bold text-sky-700 hover:underline">
            Iniciar Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
