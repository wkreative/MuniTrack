'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import MetricCard from '@/components/MetricCard';
import DocumentReviewModal from '@/components/DocumentReviewModal';
import AuditLogTable from '@/components/AuditLogTable';
import { PropertyDocument, Application } from '@/lib/types';
import {
  Building2,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  UserCheck,
  Award,
  Layers,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Settings,
  Eye
} from 'lucide-react';

export default function MunicipalPortalPage() {
  const {
    state,
    activeMunicipality,
    reviewDocument,
    issueCertificate,
    sendMessage
  } = useStore();

  const [activeTab, setActiveTab] = useState<'queue' | 'productivity' | 'workflows' | 'audit'>('queue');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(state.applications[0]?.id || null);
  const [reviewingDoc, setReviewingDoc] = useState<PropertyDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [internalNoteText, setInternalNoteText] = useState('');

  const muniApplications = state.applications.filter(
    (a) => a.municipalityId === state.activeMunicipalityId
  );

  const muniPayments = state.payments.filter(
    (p) => p.municipalityId === state.activeMunicipalityId
  );

  const muniCertificates = state.certificates.filter(
    (c) => c.municipalityId === state.activeMunicipalityId
  );

  const muniAuditLogs = state.auditLogs.filter(
    (l) => l.municipalityId === state.activeMunicipalityId
  );

  // Filtered Applications
  const filteredApps = muniApplications.filter((app) => {
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.cadastralNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedApp = muniApplications.find((a) => a.id === selectedAppId) || filteredApps[0];
  const selectedAppDocs = state.documents.filter((d) => d.applicationId === selectedApp?.id);
  const selectedAppMsgs = state.messages.filter((m) => m.applicationId === selectedApp?.id);

  // Metrics
  const totalRevenue = muniPayments.reduce((acc, p) => acc + p.amount, 0);
  const pendingReviewCount = muniApplications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length;
  const approvedCount = muniApplications.filter((a) => a.status === 'CERTIFICATE_ISSUED' || a.status === 'APPROVED').length;

  const handleSendInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApp && internalNoteText.trim()) {
      sendMessage(selectedApp.id, internalNoteText.trim(), true);
      setInternalNoteText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Municipal Header */}
      <div
        className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ borderLeft: `6px solid ${activeMunicipality.primaryColor}` }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>PORTAL ADMINISTRATIVO MUNICIPAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {activeMunicipality.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Panel de control de solicitudes, inspecciones, dictamen documental y emisión de certificados.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <span className="text-slate-400 block text-[10px]">Funcionario Activo:</span>
            <span className="font-bold text-white">{state.currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Solicitudes Recibidas"
          value={muniApplications.length}
          subtitle="Total acumulado en gestión"
          icon={FileCheck}
          color="blue"
        />
        <MetricCard
          title="Pendientes de Revisión"
          value={pendingReviewCount}
          subtitle="Requieren acción de funcionario"
          icon={Clock}
          trend={pendingReviewCount > 0 ? 'Atención Requerida' : 'Al Día'}
          trendType={pendingReviewCount > 0 ? 'negative' : 'positive'}
          color="amber"
        />
        <MetricCard
          title="Certificados Emitidos"
          value={muniCertificates.length}
          subtitle="Completados con firma QR"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Ingresos Recaudados"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="Arbitrios reconciliados"
          icon={BarChart3}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'queue', label: `Bandeja de Solicitudes (${muniApplications.length})`, icon: FileCheck },
          { id: 'productivity', label: 'Productividad de Funcionarios', icon: BarChart3 },
          { id: 'workflows', label: 'Configurador de Workflows & Tarifas', icon: Settings },
          { id: 'audit', label: 'Auditoría Inmutable', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-t-xl'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BANDEJA DE SOLICITUDES */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Applications List & Filters */}
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por solicitante, catastro o #"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="SUBMITTED">Recibidas / Nuevas</option>
                <option value="UNDER_REVIEW">En Revisión</option>
                <option value="CORRECTION_REQUIRED">Requiere Corrección</option>
                <option value="DOCS_APPROVED">Documentos Aprobados</option>
                <option value="PAID">Pago Recibido</option>
                <option value="CERTIFICATE_ISSUED">Certificado Emitido</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAppId === app.id
                      ? 'bg-indigo-950 text-white border-indigo-900 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-sky-400">#{app.applicationNumber}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        app.status === 'CERTIFICATE_ISSUED'
                          ? 'bg-emerald-900 text-emerald-300'
                          : app.status === 'CORRECTION_REQUIRED'
                          ? 'bg-rose-900 text-rose-300'
                          : 'bg-amber-900 text-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs">{app.ownerName}</h4>
                  <p className="text-[11px] opacity-80 font-mono mt-0.5">Catastro: {app.cadastralNumber}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Dictamen & Review Pane */}
          {selectedApp && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                      Solicitud #{selectedApp.applicationNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                      {selectedApp.applicationTypeName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Solicitante: <span className="font-bold text-slate-800">{selectedApp.ownerName}</span> • Dirección: {selectedApp.propertyAddress}
                    </p>
                  </div>

                  {/* Issue Certificate Action Button */}
                  {(selectedApp.status === 'PAID' || selectedApp.status === 'DOCS_APPROVED') && (
                    <button
                      onClick={() => issueCertificate(selectedApp.id)}
                      className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      <Award className="w-4 h-4" />
                      <span>Emitir Certificado PDF con QR</span>
                    </button>
                  )}
                </div>

                {/* Document Dictamen List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Documentos Expedientes Sometidos para Dictamen
                  </h4>

                  <div className="space-y-3">
                    {selectedAppDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                              v{doc.version}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{doc.fileName} ({doc.fileSize})</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                              doc.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>

                          <button
                            onClick={() => setReviewingDoc(doc)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Examinar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Notes vs Citizen Messages Section */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>Notas Internas del Municipio & Historial</span>
                  </h4>

                  <div className="space-y-3 max-h-52 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    {selectedAppMsgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-xs ${
                          msg.isInternalNote
                            ? 'bg-amber-50 border border-amber-200 text-amber-950 font-medium'
                            : 'bg-white border border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[10px] text-slate-500 mb-1">
                          <span>{msg.senderName} ({msg.senderRole})</span>
                          {msg.isInternalNote && <span className="text-amber-700 font-extrabold">[NOTA INTERNA MUNICIPIO]</span>}
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendInternalNote} className="flex space-x-2">
                    <input
                      type="text"
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder="Escriba una nota interna confidencial para el expediente..."
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-800"
                    >
                      Guardar Nota Interna
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTIVIDAD */}
      {activeTab === 'productivity' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <h2 className="text-lg font-extrabold text-slate-900 font-heading">
            Métricas de Productividad del Personal Municipal
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
                <tr>
                  <th className="py-3 px-4">Funcionario</th>
                  <th className="py-3 px-4">Departamento</th>
                  <th className="py-3 px-4">Casos Asignados</th>
                  <th className="py-3 px-4">Completados</th>
                  <th className="py-3 px-4">Tiempo Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Lcdo. Héctor Ortiz Santos</td>
                  <td className="py-3 px-4 text-slate-500">Ordenamiento Territorial</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">14 solicitudes</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">12 solicitudes</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">1.8 días</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Ing. Sofía Morales Cruz</td>
                  <td className="py-3 px-4 text-slate-500">Catastro e Inspecciones</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">18 solicitudes</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">16 solicitudes</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">1.2 días</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <h2 className="text-lg font-extrabold text-slate-900 font-heading">
            Configurador de Workflows y Tarifas del Municipio
          </h2>
          <p className="text-xs text-slate-500">
            Personalice los requisitos de documentos y los costos de los arbitrios para cada trámite sin modificar código.
          </p>

          <div className="space-y-4">
            {state.applicationTypes.map((type) => (
              <div key={type.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{type.name}</h3>
                    <p className="text-xs text-slate-500">{type.description}</p>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-700 font-heading">
                    ${type.feeAmount.toFixed(2)} USD
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="font-bold text-slate-600 block mb-1">Documentos Requeridos Configurables:</span>
                  <div className="flex flex-wrap gap-2">
                    {type.requiredDocuments.map((doc) => (
                      <span key={doc.code} className="px-2.5 py-1 bg-white rounded-lg border text-slate-700 font-medium">
                        ✓ {doc.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDITORÍA INMUTABLE */}
      {activeTab === 'audit' && (
        <AuditLogTable logs={muniAuditLogs} />
      )}

      {/* Document Review Modal */}
      <DocumentReviewModal
        isOpen={!!reviewingDoc}
        document={reviewingDoc}
        onClose={() => setReviewingDoc(null)}
        onApprove={(docId) => reviewDocument(docId, 'APPROVED')}
        onReject={(docId, reason) => reviewDocument(docId, 'REJECTED', reason)}
      />
    </div>
  );
}
