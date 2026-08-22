import { useState, useEffect } from 'react';
import {
  Municipality,
  User,
  Property,
  ApplicationType,
  Application,
  PropertyDocument,
  Payment,
  Certificate,
  Notification,
  Message,
  AuditLog,
  Role
} from './types';
import {
  INITIAL_MUNICIPALITIES,
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_APPLICATION_TYPES,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_PAYMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './mockData';

const LOCAL_STORAGE_KEY = 'munione_state_v1';

export interface AppState {
  activeMunicipalityId: string;
  currentUser: User;
  municipalities: Municipality[];
  users: User[];
  properties: Property[];
  applicationTypes: ApplicationType[];
  applications: Application[];
  documents: PropertyDocument[];
  payments: Payment[];
  certificates: Certificate[];
  messages: Message[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      activeMunicipalityId: 'muni-sanjuan',
      currentUser: INITIAL_USERS[0],
      municipalities: INITIAL_MUNICIPALITIES,
      users: INITIAL_USERS,
      properties: INITIAL_PROPERTIES,
      applicationTypes: INITIAL_APPLICATION_TYPES,
      applications: INITIAL_APPLICATIONS,
      documents: INITIAL_DOCUMENTS,
      payments: INITIAL_PAYMENTS,
      certificates: INITIAL_CERTIFICATES,
      messages: INITIAL_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS
    };
  }

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    activeMunicipalityId: 'muni-sanjuan',
    currentUser: INITIAL_USERS[0],
    municipalities: INITIAL_MUNICIPALITIES,
    users: INITIAL_USERS,
    properties: INITIAL_PROPERTIES,
    applicationTypes: INITIAL_APPLICATION_TYPES,
    applications: INITIAL_APPLICATIONS,
    documents: INITIAL_DOCUMENTS,
    payments: INITIAL_PAYMENTS,
    certificates: INITIAL_CERTIFICATES,
    messages: INITIAL_MESSAGES,
    notifications: INITIAL_NOTIFICATIONS,
    auditLogs: INITIAL_AUDIT_LOGS
  };
}

let globalState: AppState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }
  listeners.forEach((listener) => listener());
}

export function useStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Actions
  const setActiveMunicipality = (muniId: string) => {
    globalState.activeMunicipalityId = muniId;
    notify();
  };

  const setCurrentUserRole = (role: Role) => {
    const found = globalState.users.find(
      (u) => u.role === role && u.municipalityId === globalState.activeMunicipalityId
    ) || {
      ...globalState.currentUser,
      role
    };
    globalState.currentUser = found;
    notify();
  };

  const setCurrentUser = (user: User) => {
    globalState.currentUser = user;
    notify();
  };

  const addProperty = (newProp: Omit<Property, 'id' | 'createdAt' | 'status'>) => {
    const id = `prop-${Date.now()}`;
    const property: Property = {
      ...newProp,
      id,
      status: 'REGISTERED',
      createdAt: new Date().toISOString()
    };
    globalState.properties = [property, ...globalState.properties];

    // Add Audit Log
    addAuditLog({
      action: 'PROPERTY_REGISTERED',
      entityType: 'PROPERTY',
      entityId: id,
      details: `Propiedad con catastro ${property.cadastralNumber} registrada en ${property.physicalAddress}`
    });

    notify();
    return property;
  };

  const submitApplication = (appData: {
    propertyId: string;
    applicationTypeId: string;
    documents: { code: string; name: string; file: File }[];
  }) => {
    const prop = globalState.properties.find((p) => p.id === appData.propertyId);
    const appType = globalState.applicationTypes.find((t) => t.id === appData.applicationTypeId);
    const muni = globalState.municipalities.find((m) => m.id === globalState.activeMunicipalityId);

    if (!prop || !appType || !muni) return null;

    const appId = `app-${Date.now()}`;
    const appNumber = `${muni.code}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: appId,
      municipalityId: muni.id,
      propertyId: prop.id,
      propertyAddress: prop.physicalAddress,
      cadastralNumber: prop.cadastralNumber,
      ownerId: globalState.currentUser.id,
      ownerName: globalState.currentUser.name,
      applicationTypeId: appType.id,
      applicationTypeName: appType.name,
      applicationNumber: appNumber,
      status: 'SUBMITTED',
      currentStepIndex: 1,
      departmentId: appType.departmentId,
      departmentName: appType.departmentName,
      feeAmount: appType.feeAmount,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create Document objects
    const newDocs: PropertyDocument[] = appData.documents.map((d) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      applicationId: appId,
      propertyId: prop.id,
      municipalityId: muni.id,
      code: d.code,
      name: d.name,
      description: `${d.name} entregado por el ciudadano`,
      fileName: d.file.name,
      fileUrl: `/uploads/${d.file.name}`,
      fileType: d.file.type || 'application/pdf',
      fileSize: `${(d.file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'SUBMITTED',
      version: 1,
      versionsHistory: [
        {
          version: 1,
          fileName: d.file.name,
          fileUrl: `/uploads/${d.file.name}`,
          uploadedAt: new Date().toISOString(),
          status: 'SUBMITTED'
        }
      ],
      uploadedAt: new Date().toISOString()
    }));

    globalState.applications = [newApp, ...globalState.applications];
    globalState.documents = [...newDocs, ...globalState.documents];

    addAuditLog({
      action: 'APPLICATION_SUBMITTED',
      entityType: 'APPLICATION',
      entityId: appId,
      details: `Solicitud ${appNumber} creada para la propiedad ${prop.cadastralNumber}`
    });

    notify();
    return newApp;
  };

  const reviewDocument = (
    docId: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ) => {
    const docIndex = globalState.documents.findIndex((d) => d.id === docId);
    if (docIndex === -1) return;

    const doc = globalState.documents[docIndex];
    const updatedDoc: PropertyDocument = {
      ...doc,
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
      reviewedBy: globalState.currentUser.name,
      reviewedAt: new Date().toISOString(),
      versionsHistory: doc.versionsHistory.map((v) =>
        v.version === doc.version
          ? { ...v, status, rejectionReason: status === 'REJECTED' ? rejectionReason : undefined }
          : v
      )
    };

    globalState.documents[docIndex] = updatedDoc;

    // Check application document progress
    const appDocs = globalState.documents.filter((d) => d.applicationId === doc.applicationId);
    const appIndex = globalState.applications.findIndex((a) => a.id === doc.applicationId);
    if (appIndex !== -1) {
      const app = globalState.applications[appIndex];
      const hasRejected = appDocs.some((d) => d.status === 'REJECTED');
      const allApproved = appDocs.every((d) => d.status === 'APPROVED');

      let newAppStatus = app.status;
      if (hasRejected) {
        newAppStatus = 'CORRECTION_REQUIRED';
      } else if (allApproved) {
        newAppStatus = 'DOCS_APPROVED';
      } else {
        newAppStatus = 'UNDER_REVIEW';
      }

      globalState.applications[appIndex] = {
        ...app,
        status: newAppStatus,
        updatedAt: new Date().toISOString()
      };
    }

    addAuditLog({
      action: status === 'APPROVED' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED',
      entityType: 'DOCUMENT',
      entityId: docId,
      details: `Documento ${doc.name} (${doc.fileName}) ${status === 'APPROVED' ? 'aprobado' : 'rechazado'}`
    });

    notify();
  };

  const replaceDocument = (docId: string, file: File) => {
    const docIndex = globalState.documents.findIndex((d) => d.id === docId);
    if (docIndex === -1) return;

    const doc = globalState.documents[docIndex];
    const newVersionNum = doc.version + 1;
    const newVersion: PropertyDocument['versionsHistory'][0] = {
      version: newVersionNum,
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
      uploadedAt: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    const updatedDoc: PropertyDocument = {
      ...doc,
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'SUBMITTED',
      rejectionReason: undefined,
      version: newVersionNum,
      versionsHistory: [...doc.versionsHistory, newVersion],
      uploadedAt: new Date().toISOString()
    };

    globalState.documents[docIndex] = updatedDoc;

    // Reset application status to UNDER_REVIEW
    const appIndex = globalState.applications.findIndex((a) => a.id === doc.applicationId);
    if (appIndex !== -1) {
      globalState.applications[appIndex] = {
        ...globalState.applications[appIndex],
        status: 'UNDER_REVIEW',
        updatedAt: new Date().toISOString()
      };
    }

    addAuditLog({
      action: 'DOCUMENT_REPLACED',
      entityType: 'DOCUMENT',
      entityId: docId,
      details: `Ciudadano reemplazó documento ${doc.name} con versión v${newVersionNum}`
    });

    notify();
  };

  const processPayment = (
    appId: string,
    method: Payment['paymentMethod'],
    txRef?: string
  ) => {
    const app = globalState.applications.find((a) => a.id === appId);
    if (!app) return null;

    const payId = `pay-${Date.now()}`;
    const receiptNum = `REC-${app.municipalityId.replace('muni-', '').toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const boletinCode = method === 'CASHIER_BOLETIN' ? `BOL-${Math.floor(100000 + Math.random() * 900000)}` : undefined;

    const payment: Payment = {
      id: payId,
      municipalityId: app.municipalityId,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      propertyId: app.propertyId,
      ownerId: app.ownerId,
      ownerName: app.ownerName,
      amount: app.feeAmount,
      status: 'COMPLETED',
      paymentMethod: method,
      transactionReference: txRef || (method === 'ATH_MOVIL' ? `ATH-${Math.floor(10000000 + Math.random() * 90000000)}` : `TX-${Date.now()}`),
      boletinCode,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      receiptNumber: receiptNum
    };

    globalState.payments = [payment, ...globalState.payments];

    // Update application status
    const appIndex = globalState.applications.findIndex((a) => a.id === appId);
    if (appIndex !== -1) {
      globalState.applications[appIndex] = {
        ...app,
        status: 'PAID',
        isPaid: true,
        updatedAt: new Date().toISOString()
      };
    }

    addAuditLog({
      action: 'PAYMENT_PROCESSED',
      entityType: 'PAYMENT',
      entityId: payId,
      details: `Pago de $${app.feeAmount.toFixed(2)} completado mediante ${method} para la solicitud ${app.applicationNumber}`
    });

    notify();
    return payment;
  };

  const issueCertificate = (appId: string) => {
    const app = globalState.applications.find((a) => a.id === appId);
    const prop = globalState.properties.find((p) => p.id === app?.propertyId);
    const muni = globalState.municipalities.find((m) => m.id === app?.municipalityId);

    if (!app || !prop || !muni) return null;

    const certId = `cert-${Date.now()}`;
    const certNum = `CERT-${new Date().getFullYear()}-${muni.code}-${Math.floor(10000 + Math.random() * 90000)}`;

    const cert: Certificate = {
      id: certId,
      certificateNumber: certNum,
      municipalityId: muni.id,
      municipalityName: muni.name,
      municipalityLogo: muni.logo,
      propertyId: prop.id,
      cadastralNumber: prop.cadastralNumber,
      physicalAddress: prop.physicalAddress,
      ownerId: app.ownerId,
      ownerName: app.ownerName,
      applicationId: app.id,
      applicationTypeName: app.applicationTypeName,
      issueDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      qrCodeDataUrl: '',
      verificationUrl: `${window.location.origin}/verify/${certNum}`,
      digitalSignatureHash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      status: 'VALID'
    };

    globalState.certificates = [cert, ...globalState.certificates];

    // Update application
    const appIndex = globalState.applications.findIndex((a) => a.id === appId);
    if (appIndex !== -1) {
      globalState.applications[appIndex] = {
        ...app,
        status: 'CERTIFICATE_ISSUED',
        currentStepIndex: 6,
        updatedAt: new Date().toISOString()
      };
    }

    addAuditLog({
      action: 'CERTIFICATE_ISSUED',
      entityType: 'CERTIFICATE',
      entityId: certId,
      details: `Certificado ${certNum} emitido oficialmente para ${app.ownerName} en la propiedad ${prop.cadastralNumber}`
    });

    notify();
    return cert;
  };

  const sendMessage = (applicationId: string, text: string, isInternalNote: boolean) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      applicationId,
      municipalityId: globalState.activeMunicipalityId,
      senderId: globalState.currentUser.id,
      senderName: globalState.currentUser.name,
      senderRole: globalState.currentUser.role,
      text,
      isInternalNote,
      createdAt: new Date().toISOString()
    };
    globalState.messages = [...globalState.messages, msg];
    notify();
  };

  const addAuditLog = (params: {
    action: string;
    entityType: string;
    entityId: string;
    details: string;
  }) => {
    const prevLog = globalState.auditLogs[0];
    const prevHash = prevLog ? prevLog.currentHash : 'GENESIS_00000000000000000000000000000000';
    const currentHash = `hash_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      municipalityId: globalState.activeMunicipalityId,
      userId: globalState.currentUser.id,
      userName: globalState.currentUser.name,
      userRole: globalState.currentUser.role,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details,
      ipAddress: '196.12.44.100',
      timestamp: new Date().toISOString(),
      previousHash: prevHash,
      currentHash
    };

    globalState.auditLogs = [log, ...globalState.auditLogs];
  };

  const activeMunicipality =
    globalState.municipalities.find((m) => m.id === globalState.activeMunicipalityId) ||
    globalState.municipalities[0];

  return {
    state,
    activeMunicipality,
    setActiveMunicipality,
    setCurrentUserRole,
    setCurrentUser,
    addProperty,
    submitApplication,
    reviewDocument,
    replaceDocument,
    processPayment,
    issueCertificate,
    sendMessage,
    addAuditLog
  };
}
