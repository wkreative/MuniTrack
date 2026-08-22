'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import MetricCard from '@/components/MetricCard';
import PropertyMapModal from '@/components/PropertyMapModal';
import PaymentCheckoutModal from '@/components/PaymentCheckoutModal';
import { downloadCertificatePDF, downloadReceiptPDF } from '@/lib/pdfGenerator';
import { Property, PropertyDocument } from '@/lib/types';
import {
  Home,
  FileText,
  CreditCard,
  Award,
  Plus,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Search,
  Building,
  UserCheck,
  QrCode
} from 'lucide-react';

export default function CitizenPortalPage() {
  const {
    state,
    activeMunicipality,
    addProperty,
    submitApplication,
    replaceDocument,
    processPayment,
    sendMessage
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'applications' | 'payments' | 'certificates'>('overview');
  const [isRegisterPropertyOpen, setIsRegisterPropertyOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(state.applications[0]?.id || null);
  const [checkoutAppId, setCheckoutAppId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  // Property Form State
  const [propForm, setPropForm] = useState({
    cadastralNumber: '040-025-112-05-001',
    propertyNumber: `SJ-PROP-${Math.floor(1000 + Math.random() * 9000)}`,
    physicalAddress: 'Calle del Cristo #204, Viejo San Juan',
    urbanization: 'Histórico San Juan',
    sector: 'San Juan Antiguo',
    zipCode: '00901',
    propertyType: 'RESIDENTIAL' as Property['propertyType'],
    useType: 'Residencial Unifamiliar',
    acquisitionDate: '2022-05-10',
    deedNumber: 'Escritura #502',
    coordinates: { lat: 18.4655, lng: -66.1167 }
  });

  // Filter items for current active municipality & citizen user
  const userProperties = state.properties.filter(
    (p) => p.municipalityId === state.activeMunicipalityId
  );

  const userApplications = state.applications.filter(
    (a) => a.municipalityId === state.activeMunicipalityId
  );

  const userPayments = state.payments.filter(
    (p) => p.municipalityId === state.activeMunicipalityId
  );

  const userCertificates = state.certificates.filter(
    (c) => c.municipalityId === state.activeMunicipalityId
  );

  const selectedApp = userApplications.find((a) => a.id === selectedAppId) || userApplications[0];
  const selectedAppDocs = state.documents.filter((d) => d.applicationId === selectedApp?.id);
  const selectedAppMsgs = state.messages.filter((m) => m.applicationId === selectedApp?.id && !m.isInternalNote);

  // Calculations
  const pendingActions = selectedAppDocs.filter((d) => d.status === 'REJECTED' || d.status === 'CORRECTION_REQUIRED').length;
  const pendingBalance = userApplications.filter((a) => !a.isPaid && a.status === 'DOCS_APPROVED').reduce((acc, a) => acc + a.feeAmount, 0);

  const handleRegisterPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProperty({
      municipalityId: state.activeMunicipalityId,
      cadastralNumber: propForm.cadastralNumber,
      propertyNumber: propForm.propertyNumber,
      physicalAddress: propForm.physicalAddress,
      urbanization: propForm.urbanization,
      sector: propForm.sector,
      zipCode: propForm.zipCode,
      propertyType: propForm.propertyType,
      useType: propForm.useType,
      acquisitionDate: propForm.acquisitionDate,
      deedNumber: propForm.deedNumber,
      coordinates: propForm.coordinates,
      owners: [
        {
          id: state.currentUser.id,
          name: state.currentUser.name,
          taxId: 'XXX-XX-4910',
          email: state.currentUser.email,
          phone: state.currentUser.phone,
          ownershipPercentage: 100
        }
      ]
    });
    setIsRegisterPropertyOpen(false);
    setActiveTab('properties');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApp && newMessageText.trim()) {
      sendMessage(selectedApp.id, newMessageText.trim(), false);
      setNewMessageText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        style={{ borderLeft: `6px solid ${activeMunicipality.primaryColor}` }}
      >
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5" />
            <span>PORTAL DEL CIUDADANO / PROPIETARIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Bienvenido, {state.currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Gestione el expediente digital de sus propiedades en el {activeMunicipality.name}.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={() => setIsRegisterPropertyOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Propiedad</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Resumen General', icon: Compass },
          { id: 'properties', label: `Mis Propiedades (${userProperties.length})`, icon: Home },
          { id: 'applications', label: `Solicitudes (${userApplications.length})`, icon: FileText },
          { id: 'payments', label: 'Pagos Municipales', icon: CreditCard },
          { id: 'certificates', label: `Certificados (${userCertificates.length})`, icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-t-xl'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Mis Propiedades"
              value={userProperties.length}
              subtitle="Expedientes registrados"
              icon={Home}
              color="blue"
            />
            <MetricCard
              title="Solicitudes Activas"
              value={userApplications.filter((a) => a.status !== 'CERTIFICATE_ISSUED').length}
              subtitle="En proceso administrativo"
              icon={FileText}
              color="teal"
            />
            <MetricCard
              title="Acción Requerida"
              value={pendingActions}
              subtitle="Documentos por corregir"
              icon={AlertTriangle}
              trend={pendingActions > 0 ? 'Atención Requerida' : 'Al Día'}
              trendType={pendingActions > 0 ? 'negative' : 'positive'}
              color="amber"
            />
            <MetricCard
              title="Balance Pendiente"
              value={`$${pendingBalance.toFixed(2)}`}
              subtitle="Arbitrios por pagar"
              icon={CreditCard}
              color="rose"
            />
          </div>

          {/* Active Application Progress Line */}
          {selectedApp && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                    Solicitud #{selectedApp.applicationNumber}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                    {selectedApp.applicationTypeName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApp.propertyAddress}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    selectedApp.status === 'CERTIFICATE_ISSUED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedApp.status === 'CORRECTION_REQUIRED'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedApp.status}
                </span>
              </div>

              {/* Workflow Progress Steps */}
              <div className="py-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Línea de Progreso del Trámite Municipal
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { title: '1. Registro', step: 1 },
                    { title: '2. Documentos', step: 2 },
                    { title: '3. Revisión', step: 3 },
                    { title: '4. Pago', step: 4 },
                    { title: '5. Aprobación', step: 5 },
                    { title: '6. Certificado', step: 6 }
                  ].map((s) => {
                    const isCompleted = selectedApp.currentStepIndex >= s.step;
                    const isCurrent = selectedApp.currentStepIndex === s.step;
                    return (
                      <div
                        key={s.step}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : isCurrent
                            ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold ring-2 ring-sky-300'
                            : 'bg-slate-50 border-slate-200 text-slate-400 font-normal'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span>{s.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('applications')}
                  className="flex items-center space-x-1 text-xs font-bold text-sky-700 hover:text-sky-800"
                >
                  <span>Ver Detalle de Expediente Completo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MIS PROPIEDADES */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                Expedientes Digitales de Propiedad
              </h2>
              <p className="text-xs text-slate-500">
                Propiedades inscritas bajo su titularidad en el {activeMunicipality.name}.
              </p>
            </div>
            <button
              onClick={() => setIsRegisterPropertyOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Propiedad</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Catastro: {prop.cadastralNumber}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">{prop.physicalAddress}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {prop.urbanization || prop.sector}, ZIP {prop.zipCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Tipo de Uso</span>
                    <span className="font-bold text-slate-800">{prop.useType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Escritura</span>
                    <span className="font-bold text-slate-800">{prop.deedNumber}</span>
                  </div>
                </div>

                {/* Co-owners Section */}
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold text-[10px] uppercase block mb-1">
                    Titulares Registrados ({prop.owners.length})
                  </span>
                  <div className="space-y-1">
                    {prop.owners.map((owner) => (
                      <div key={owner.id} className="flex items-center justify-between text-slate-700">
                        <span className="font-medium">{owner.name}</span>
                        <span className="font-bold text-sky-700">{owner.ownershipPercentage}% Titularidad</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MIS SOLICITUDES & CHECKLIST */}
      {activeTab === 'applications' && selectedApp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Applications List Sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Sus Solicitudes Registradas
            </h3>
            <div className="space-y-3">
              {userApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAppId === app.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-sky-400">#{app.applicationNumber}</span>
                    <span className="text-[10px] uppercase font-bold">{app.status}</span>
                  </div>
                  <h4 className="font-bold text-sm line-clamp-1">{app.applicationTypeName}</h4>
                  <p className="text-xs opacity-75 mt-1 line-clamp-1">{app.propertyAddress}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Application Details & Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {selectedApp.applicationTypeName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Solicitud #{selectedApp.applicationNumber} • {selectedApp.propertyAddress}
                  </p>
                </div>

                {selectedApp.status === 'DOCS_APPROVED' && !selectedApp.isPaid && (
                  <button
                    onClick={() => setCheckoutAppId(selectedApp.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Proceder al Pago (${selectedApp.feeAmount.toFixed(2)})
                  </button>
                )}
              </div>

              {/* Dynamic Requirements Checklist */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Checklist Dinámico de Requisitos y Documentos
                </h4>

                <div className="space-y-3">
                  {selectedAppDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-xl text-white font-bold text-xs ${
                            doc.status === 'APPROVED'
                              ? 'bg-emerald-500'
                              : doc.status === 'REJECTED'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        >
                          {doc.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                              v{doc.version}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{doc.fileName} ({doc.fileSize})</p>

                          {doc.status === 'REJECTED' && doc.rejectionReason && (
                            <div className="mt-2 p-2.5 rounded-lg bg-rose-100 text-rose-900 text-xs font-medium border border-rose-200">
                              <span className="font-bold block">Motivo de Corrección Requerida:</span>
                              {doc.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Replace Document Button */}
                      {doc.status === 'REJECTED' && (
                        <label className="cursor-pointer px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap">
                          <span>Sustituir Documento</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                replaceDocument(doc.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen-Official Messages Feed */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>Mensajes Directos con el Municipio</span>
                </h4>

                <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {selectedAppMsgs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No hay mensajes en el hilo.</p>
                  ) : (
                    selectedAppMsgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-xs ${
                          msg.senderRole === 'CITIZEN'
                            ? 'bg-sky-100 text-sky-950 ml-6 text-right'
                            : 'bg-white text-slate-800 border border-slate-200 mr-6'
                        }`}
                      >
                        <div className="font-bold text-[11px] mb-1">{msg.senderName} ({msg.senderRole})</div>
                        <p>{msg.text}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('es-PR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Escriba una duda o aclaración al funcionario..."
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAGOS MUNICIPALES */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Gestión de Pagos e Historial de Transacciones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Payments Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">Cargos y Arbitrios Pendientes</h3>
              {userApplications.filter((a) => !a.isPaid && a.status === 'DOCS_APPROVED').length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
                  No tiene pagos ni arbitrios pendientes en este momento.
                </div>
              ) : (
                userApplications
                  .filter((a) => !a.isPaid && a.status === 'DOCS_APPROVED')
                  .map((app) => (
                    <div key={app.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-amber-950">Solicitud #{app.applicationNumber}</p>
                        <p className="text-xs text-amber-800">{app.applicationTypeName}</p>
                      </div>
                      <button
                        onClick={() => setCheckoutAppId(app.id)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        Pagar ${app.feeAmount.toFixed(2)}
                      </button>
                    </div>
                  ))
              )}
            </div>

            {/* Completed Payments & Download Receipts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">Historial de Pagos Procesados</h3>
              <div className="space-y-3">
                {userPayments.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{pay.receiptNumber}</span>
                      <p className="text-slate-500">Monto: <span className="font-bold text-emerald-700">${pay.amount.toFixed(2)}</span> ({pay.paymentMethod})</p>
                    </div>

                    <button
                      onClick={() => downloadReceiptPDF(pay)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Recibo PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICADOS */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Certificados Municipales de Cumplimiento Emitidos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCertificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      {cert.certificateNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 font-heading">{cert.applicationTypeName}</h3>
                    <p className="text-xs text-slate-500">{cert.physicalAddress}</p>
                  </div>
                  <QrCode className="w-12 h-12 text-slate-800 p-1 border border-slate-200 rounded-xl" />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Emisión:</span>
                    <span className="font-bold text-slate-800">{cert.issueDate}</span>
                  </div>

                  <button
                    onClick={() => downloadCertificatePDF(cert)}
                    className="flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF Oficial</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property Registration Wizard Modal */}
      {isRegisterPropertyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-heading">Registrar Nueva Propiedad en Catastro Municipal</h3>
              <button onClick={() => setIsRegisterPropertyOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRegisterPropertySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Catastro:</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={propForm.cadastralNumber}
                      onChange={(e) => setPropForm({ ...propForm, cadastralNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-3 py-2 bg-sky-100 text-sky-700 font-bold text-xs rounded-xl"
                    >
                      GIS Mapa
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Propiedad:</label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  >
                    <option value="RESIDENTIAL">Residencial</option>
                    <option value="COMMERCIAL">Comercial</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="MIXED">Mixto</option>
                    <option value="LAND">Terreno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Física Completa:</label>
                <input
                  type="text"
                  value={propForm.physicalAddress}
                  onChange={(e) => setPropForm({ ...propForm, physicalAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Escritura:</label>
                  <input
                    type="text"
                    value={propForm.deedNumber}
                    onChange={(e) => setPropForm({ ...propForm, deedNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Adquisición:</label>
                  <input
                    type="date"
                    value={propForm.acquisitionDate}
                    onChange={(e) => setPropForm({ ...propForm, acquisitionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRegisterPropertyOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl shadow-md"
                >
                  Guardar Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GIS Property Selection Map Modal */}
      <PropertyMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={(data) => {
          setPropForm({
            ...propForm,
            cadastralNumber: data.cadastralNumber,
            physicalAddress: data.physicalAddress,
            urbanization: data.urbanization,
            coordinates: data.coordinates
          });
        }}
      />

      {/* Payment Checkout Modal */}
      {checkoutAppId && (
        <PaymentCheckoutModal
          isOpen={!!checkoutAppId}
          onClose={() => setCheckoutAppId(null)}
          applicationNumber={userApplications.find((a) => a.id === checkoutAppId)?.applicationNumber || ''}
          amount={userApplications.find((a) => a.id === checkoutAppId)?.feeAmount || 75.0}
          onProcessPayment={(method, txRef) => {
            processPayment(checkoutAppId, method, txRef);
          }}
        />
      )}
    </div>
  );
}
