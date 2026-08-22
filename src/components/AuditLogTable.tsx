'use client';

import React from 'react';
import { AuditLog } from '@/lib/types';
import { ShieldCheck, Lock, Hash, UserCheck, Calendar, Activity } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold font-heading">
              Registro de Auditoría Inmutable (Append-Only PostgreSQL Ledger)
            </h3>
            <p className="text-xs text-slate-400">
              Criptográficamente encadenado (Tamper-evident logs) • Protección anticorrupción
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
          PROTEGIDO CONTRA UPDATE/DELETE
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Fecha y Hora</th>
              <th className="py-3 px-4">Usuario / Rol</th>
              <th className="py-3 px-4">Acción Realizada</th>
              <th className="py-3 px-4">Detalles</th>
              <th className="py-3 px-4">Cadena de Hash Criptográfico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(log.timestamp).toLocaleString('es-PR')}</span>
                  </div>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-bold text-slate-800">{log.userName}</div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold uppercase">
                    {log.userRole}
                  </span>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {log.action}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                  {log.details}
                </td>

                <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-slate-400">Prev: {log.previousHash.slice(0, 16)}...</span>
                    <span className="text-emerald-700 font-bold">Curr: {log.currentHash.slice(0, 16)}...</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
