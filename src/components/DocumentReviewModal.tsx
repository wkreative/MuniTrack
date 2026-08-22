'use client';

import React, { useState } from 'react';
import { PropertyDocument } from '@/lib/types';
import {
  X,
  CheckCircle,
  XCircle,
  FileText,
  History,
  Sparkles,
  Bot,
  AlertTriangle,
  UserCheck,
  Calendar,
  Clock
} from 'lucide-react';

interface DocumentReviewModalProps {
  document: PropertyDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (docId: string) => void;
  onReject: (docId: string, reason: string) => void;
}

export default function DocumentReviewModal({
  document: doc,
  isOpen,
  onClose,
  onApprove,
  onReject
}: DocumentReviewModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isAnalysingOCR, setIsAnalysingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    cadastralMatched: boolean;
    validityChecked: boolean;
    confidenceScore: number;
    extractedText: string;
  } | null>(null);

  if (!isOpen || !doc) return null;

  const handleOCRAnalysis = () => {
    setIsAnalysingOCR(true);
    setTimeout(() => {
      setIsAnalysingOCR(false);
      setOcrResult({
        cadastralMatched: true,
        validityChecked: true,
        confidenceScore: 98.4,
        extractedText: `DEED / ESCRITURA NOTARIAL\nNúmero de Catastro: 040-025-112-05-001\nFinca Registrada: #402, Folio 12, Tomo 88\nNotario Autorizante: Lcdo. Vélez`
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-800 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-heading">{doc.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 font-mono font-bold">
                  v{doc.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Archivo: <span className="text-slate-200 font-medium">{doc.fileName}</span> ({doc.fileSize})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Document Status Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 border-slate-200">
            <div className="flex items-center space-x-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  doc.status === 'APPROVED'
                    ? 'bg-emerald-500'
                    : doc.status === 'REJECTED'
                    ? 'bg-rose-500'
                    : 'bg-amber-500 animate-ping'
                }`}
              />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Estado Actual</p>
                <p className="text-sm font-bold text-slate-800">{doc.status}</p>
              </div>
            </div>

            <button
              onClick={handleOCRAnalysis}
              disabled={isAnalysingOCR}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>{isAnalysingOCR ? 'Analizando Document AI...' : 'Pre-validar con Document AI (OCR)'}</span>
            </button>
          </div>

          {/* AI OCR Pre-validation Result Box */}
          {ocrResult && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md animate-fade-in">
              <div className="flex items-center justify-between mb-3 border-b border-indigo-700/50 pb-2">
                <div className="flex items-center space-x-2 text-sky-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Resultado de Pre-validación Document AI</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  {ocrResult.confidenceScore}% Confianza
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 bg-indigo-950/60 p-2 rounded-lg border border-indigo-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Catastro Coincide con Registro</span>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-950/60 p-2 rounded-lg border border-indigo-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Certificación Vigente (2026)</span>
                </div>
              </div>

              <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                <p className="text-slate-500 font-sans font-semibold mb-1">Texto Extraído Automáticamente:</p>
                <pre className="whitespace-pre-wrap">{ocrResult.extractedText}</pre>
              </div>
            </div>
          )}

          {/* Document Preview Placeholder Graphic */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">{doc.fileName}</p>
            <p className="text-xs text-slate-500 mt-1">
              Visualización de documento PDF securizado. Subido el{' '}
              {new Date(doc.uploadedAt).toLocaleString('es-PR')}
            </p>
          </div>

          {/* Rejection Reason Form */}
          {showRejectForm && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 animate-slide-up">
              <label className="block text-xs font-bold text-rose-900 mb-1">
                Indique la Razón Oficial del Rechazo:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej. El documento adjunto no corresponde al año en curso o no es legible..."
                className="w-full p-2.5 bg-white rounded-lg border border-rose-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (rejectReason.trim()) {
                      onReject(doc.id, rejectReason);
                      onClose();
                    }
                  }}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm disabled:opacity-50"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          )}

          {/* Version History */}
          {doc.versionsHistory && doc.versionsHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <History className="w-4 h-4 text-slate-500" />
                <span>Historial de Versiones</span>
              </h4>
              <div className="space-y-2">
                {doc.versionsHistory.map((v) => (
                  <div
                    key={v.version}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-white"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        v{v.version}
                      </span>
                      <span className="font-semibold text-slate-800">{v.fileName}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500">
                      <span>{new Date(v.uploadedAt).toLocaleDateString('es-PR')}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          v.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Cerrar
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Rechazar / Solicitar Corrección</span>
            </button>

            <button
              onClick={() => {
                onApprove(doc.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Aprobar Documento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
