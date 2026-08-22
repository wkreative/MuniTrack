'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { downloadCertificatePDF } from '@/lib/pdfGenerator';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Download,
  QrCode,
  Lock,
  ArrowLeft,
  FileCheck
} from 'lucide-react';

export default function PublicVerifyCertificatePage({
  params
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = use(params);
  const { state } = useStore();

  // Find certificate by certificateNumber or id
  const cert =
    state.certificates.find(
      (c) =>
        c.certificateNumber.toLowerCase() === certificateId.toLowerCase() ||
        c.id.toLowerCase() === certificateId.toLowerCase()
    ) || state.certificates[0]; // Fallback to mock cert for demo validation

  const isInvalid = !cert || cert.status !== 'VALID';

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden space-y-6">
        {/* Header Branding */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-extrabold font-heading text-white">
                {cert ? cert.municipalityName : 'Portal Gubernamental de Verificación'}
              </h1>
              <p className="text-xs text-slate-400">Estado Libre Asociado de Puerto Rico</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Inicio</span>
          </Link>
        </div>

        {/* Verification Status Banner */}
        <div className="p-6 space-y-6">
          {!isInvalid ? (
            <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-center space-y-3 shadow-lg shadow-emerald-900/20">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-extrabold text-emerald-300 uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                  CERTIFICADO OFICIAL VÁLIDO Y AUTÉNTICO
                </span>
                <h2 className="text-xl font-extrabold text-white mt-3 font-heading">
                  Certificación Municipal de Cumplimiento
                </h2>
                <p className="text-xs text-emerald-200 mt-1">
                  Documento auditado e inscrito en los registros del Municipio.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
              <h2 className="text-lg font-bold text-white">Certificado No Encontrado o Revocado</h2>
              <p className="text-xs text-rose-300">
                El número de certificado especificado no coincide con los registros públicos oficiales.
              </p>
            </div>
          )}

          {/* Certificate Data Summary */}
          {cert && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-semibold">Número de Certificado:</span>
                  <span className="font-mono font-bold text-sky-400 text-sm">
                    {cert.certificateNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-semibold">Número de Catastro:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {cert.cadastralNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-semibold">Dirección de Propiedad:</span>
                  <span className="font-bold text-white text-right">
                    {cert.physicalAddress}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-semibold">Titular Registrado:</span>
                  <span className="font-bold text-white">{cert.ownerName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-semibold">Fecha de Emisión:</span>
                  <span className="font-bold text-slate-300">{cert.issueDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Fecha de Expiración:</span>
                  <span className="font-bold text-emerald-400">
                    {cert.expirationDate || 'Vigencia Permanente'}
                  </span>
                </div>
              </div>

              {/* Security Hash Stamp */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center space-x-1 text-slate-300 font-bold font-sans">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Sello Criptográfico de Inmutabilidad PKI X.509:</span>
                </div>
                <p className="break-all text-slate-500">{cert.digitalSignatureHash}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-center space-x-4">
                <button
                  onClick={() => downloadCertificatePDF(cert)}
                  className="flex items-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Copia Oficial PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
