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
  AuditLog
} from './types';

export const INITIAL_MUNICIPALITIES: Municipality[] = [
  {
    id: 'muni-sanjuan',
    name: 'Municipio Autónomo de San Juan',
    slug: 'san-juan',
    code: '040',
    logo: 'https://images.unsplash.com/photo-1590059203672-01938927976e?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#1e3a8a', // Royal Navy Blue
    secondaryColor: '#0d9488', // Teal
    accentColor: '#3b82f6',
    bannerUrl: 'https://images.unsplash.com/photo-1590059203672-01938927976e?w=1200&auto=format&fit=crop&q=80',
    contactEmail: 'cumplimiento@sanjuan.pr',
    contactPhone: '(787) 480-4000',
    address: 'Calle Luna #150, San Juan, PR 00901',
    activeModules: ['PROPERTIES', 'APPLICATIONS', 'PAYMENTS', 'CERTIFICATES', 'AUDIT', 'GIS']
  },
  {
    id: 'muni-ponce',
    name: 'Municipio Autónomo de Ponce',
    slug: 'ponce',
    code: '062',
    logo: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#991b1b', // Crimson Red
    secondaryColor: '#b45309', // Amber
    accentColor: '#ef4444',
    bannerUrl: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=1200&auto=format&fit=crop&q=80',
    contactEmail: 'permisos@ponce.pr',
    contactPhone: '(787) 844-4040',
    address: 'Plaza Las Delicias, Ponce, PR 00731',
    activeModules: ['PROPERTIES', 'APPLICATIONS', 'PAYMENTS', 'CERTIFICATES', 'AUDIT']
  },
  {
    id: 'muni-mayaguez',
    name: 'Municipio Autónomo de Mayagüez',
    slug: 'mayaguez',
    code: '042',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#065f46', // Emerald Green
    secondaryColor: '#15803d',
    accentColor: '#10b981',
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    contactEmail: 'catastro@mayaguez.pr',
    contactPhone: '(787) 834-8585',
    address: 'Casa Alcaldía, Calle McKinley, Mayagüez, PR 00680',
    activeModules: ['PROPERTIES', 'APPLICATIONS', 'PAYMENTS', 'CERTIFICATES']
  },
  {
    id: 'muni-caguas',
    name: 'Municipio Autónomo de Caguas',
    slug: 'caguas',
    code: '025',
    logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#581c87', // Deep Purple
    secondaryColor: '#7e22ce',
    accentColor: '#a855f7',
    bannerUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    contactEmail: 'desarrollo@caguas.gov.pr',
    contactPhone: '(787) 653-8833',
    address: 'Calle Muñoz Rivera, Caguas, PR 00725',
    activeModules: ['PROPERTIES', 'APPLICATIONS', 'PAYMENTS', 'CERTIFICATES', 'AUDIT', 'GIS']
  }
];

export const INITIAL_USERS: User[] = [
  // Citizens
  {
    id: 'usr-citizen-1',
    name: 'Carlos Rivera Rodríguez',
    email: 'carlos.rivera@gmail.com',
    phone: '(787) 555-0192',
    role: 'CITIZEN',
    municipalityId: 'muni-sanjuan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-citizen-2',
    name: 'María Elena Mercado',
    email: 'maria.mercado@gmail.com',
    phone: '(787) 555-0344',
    role: 'CITIZEN',
    municipalityId: 'muni-sanjuan',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  // Officials
  {
    id: 'usr-official-1',
    name: 'Lcdo. Héctor Ortiz Santos',
    email: 'hortiz@sanjuan.pr',
    phone: '(787) 480-4101',
    role: 'OFFICIAL',
    municipalityId: 'muni-sanjuan',
    departmentId: 'dept-urbanismo',
    departmentName: 'Oficina de Ordenamiento Territorial y Urbanismo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-official-2',
    name: 'Ing. Sofía Morales Cruz',
    email: 'smorales@sanjuan.pr',
    phone: '(787) 480-4102',
    role: 'OFFICIAL',
    municipalityId: 'muni-sanjuan',
    departmentId: 'dept-catastro',
    departmentName: 'Dirección de Catastro e Inspecciones',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  // Supervisor
  {
    id: 'usr-supervisor-1',
    name: 'Arq. Fernando Del Valle',
    email: 'fdelvalle@sanjuan.pr',
    phone: '(787) 480-4200',
    role: 'SUPERVISOR',
    municipalityId: 'muni-sanjuan',
    departmentId: 'dept-urbanismo',
    departmentName: 'Supervisión de Permisos y Cumplimiento',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  // Admin Municipal
  {
    id: 'usr-admin-1',
    name: 'Directora Ana Gabriel Torres',
    email: 'atorres@sanjuan.pr',
    phone: '(787) 480-4001',
    role: 'ADMIN',
    municipalityId: 'muni-sanjuan',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  // Super Admin
  {
    id: 'usr-superadmin',
    name: 'Administrador SaaS Global',
    email: 'admin@munitrack.gov.pr',
    phone: '(787) 999-0000',
    role: 'SUPERADMIN',
    municipalityId: 'muni-sanjuan',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    municipalityId: 'muni-sanjuan',
    cadastralNumber: '040-025-112-05-001',
    propertyNumber: 'SJ-PROP-8842',
    physicalAddress: 'Calle del Cristo #204, Viejo San Juan',
    urbanization: 'Histórico San Juan',
    sector: 'San Juan Antiguo',
    zipCode: '00901',
    propertyType: 'RESIDENTIAL',
    useType: 'Residencial Unifamiliar',
    acquisitionDate: '2018-04-12',
    deedNumber: 'Escritura #402 / Notario Lcdo. Vélez',
    coordinates: { lat: 18.4655, lng: -66.1167 },
    owners: [
      {
        id: 'own-1',
        name: 'Carlos Rivera Rodríguez',
        taxId: 'XXX-XX-4910',
        email: 'carlos.rivera@gmail.com',
        phone: '(787) 555-0192',
        ownershipPercentage: 100
      }
    ],
    status: 'REGISTERED',
    createdAt: '2026-01-10T14:30:00Z'
  },
  {
    id: 'prop-2',
    municipalityId: 'muni-sanjuan',
    cadastralNumber: '040-088-301-12-004',
    propertyNumber: 'SJ-PROP-9120',
    physicalAddress: 'Av. Ashford #1020, Apt 5B, Condado',
    urbanization: 'Condado Bayfront',
    sector: 'Santurce',
    zipCode: '00907',
    propertyType: 'COMMERCIAL',
    useType: 'Comercial / Oficina Profesional',
    acquisitionDate: '2021-09-01',
    deedNumber: 'Escritura #1109 / Notaria Lcda. Alicea',
    coordinates: { lat: 18.4552, lng: -66.0718 },
    owners: [
      {
        id: 'own-1',
        name: 'Carlos Rivera Rodríguez',
        taxId: 'XXX-XX-4910',
        email: 'carlos.rivera@gmail.com',
        phone: '(787) 555-0192',
        ownershipPercentage: 50
      },
      {
        id: 'own-2',
        name: 'María Elena Mercado',
        taxId: 'XXX-XX-8821',
        email: 'maria.mercado@gmail.com',
        phone: '(787) 555-0344',
        ownershipPercentage: 50
      }
    ],
    status: 'REGISTERED',
    createdAt: '2026-02-01T10:15:00Z'
  },
  {
    id: 'prop-3',
    municipalityId: 'muni-sanjuan',
    cadastralNumber: '040-142-009-88-002',
    propertyNumber: 'SJ-PROP-9901',
    physicalAddress: 'Calle Chardón #350, Hato Rey',
    urbanization: 'Milla de Oro',
    sector: 'Hato Rey Norte',
    zipCode: '00918',
    propertyType: 'MIXED',
    useType: 'Mixto (Local + Apartamentos)',
    acquisitionDate: '2019-11-20',
    deedNumber: 'Escritura #781',
    coordinates: { lat: 18.4231, lng: -66.0594 },
    owners: [
      {
        id: 'own-2',
        name: 'María Elena Mercado',
        taxId: 'XXX-XX-8821',
        email: 'maria.mercado@gmail.com',
        phone: '(787) 555-0344',
        ownershipPercentage: 100
      }
    ],
    status: 'REGISTERED',
    createdAt: '2026-02-15T09:00:00Z'
  }
];

export const INITIAL_APPLICATION_TYPES: ApplicationType[] = [
  {
    id: 'apptype-1',
    municipalityId: 'muni-sanjuan',
    code: 'CERT-CUMP',
    name: 'Certificación Municipal de Cumplimiento de Propiedad',
    description: 'Validación legal de que la propiedad no tiene deudas municipales, multas de ordenanzas ni violaciones de código.',
    feeAmount: 75.00,
    departmentId: 'dept-urbanismo',
    departmentName: 'Oficina de Ordenamiento Territorial y Urbanismo',
    requiredDocuments: [
      {
        code: 'DOC-ESCRITURA',
        name: 'Escritura de Propiedad / Título',
        description: 'Copia digitalizada de la escritura notariada o certificación del Registro de la Propiedad.',
        allowedTypes: ['pdf'],
        isRequired: true
      },
      {
        code: 'DOC-CRIM',
        name: 'Certificación de Radicación / CRIM Solvencia',
        description: 'Certificado oficial del CRIM de no deuda o acuerdo de pago vigente.',
        allowedTypes: ['pdf'],
        isRequired: true
      },
      {
        code: 'DOC-ID',
        name: 'Identificación Oficial del Propietario',
        description: 'Licencia de conducir de Puerto Rico o Pasaporte vigente.',
        allowedTypes: ['pdf', 'jpg', 'png'],
        isRequired: true
      },
      {
        code: 'DOC-FOTO',
        name: 'Fotografía Reciente de la Fachada',
        description: 'Evidencia visual del estado exterior actual de la propiedad.',
        allowedTypes: ['jpg', 'png'],
        isRequired: false
      }
    ]
  },
  {
    id: 'apptype-2',
    municipalityId: 'muni-sanjuan',
    code: 'REG-NUEVO',
    name: 'Registro Inicial y Alta de Propiedad en Catastro Municipal',
    description: 'Inscripción por primera vez de una finca o parcela en el expediente digital del Municipio.',
    feeAmount: 120.00,
    departmentId: 'dept-catastro',
    departmentName: 'Dirección de Catastro e Inspecciones',
    requiredDocuments: [
      {
        code: 'DOC-ESCRITURA',
        name: 'Escritura de Propiedad / Título',
        description: 'Copia completa de escritura notariada.',
        allowedTypes: ['pdf'],
        isRequired: true
      },
      {
        code: 'DOC-PLANO',
        name: 'Plano Mensura / Agrimensura Certificado',
        description: 'Plano firmado por agrimensor o ingeniero licenciado.',
        allowedTypes: ['pdf'],
        isRequired: true
      },
      {
        code: 'DOC-ID',
        name: 'Identificación Oficial',
        description: 'Licencia de conducir o Pasaporte.',
        allowedTypes: ['pdf', 'jpg', 'png'],
        isRequired: true
      }
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    municipalityId: 'muni-sanjuan',
    propertyId: 'prop-1',
    propertyAddress: 'Calle del Cristo #204, Viejo San Juan',
    cadastralNumber: '040-025-112-05-001',
    ownerId: 'usr-citizen-1',
    ownerName: 'Carlos Rivera Rodríguez',
    applicationTypeId: 'apptype-1',
    applicationTypeName: 'Certificación Municipal de Cumplimiento de Propiedad',
    applicationNumber: 'SJ-2026-0084',
    status: 'UNDER_REVIEW',
    currentStepIndex: 3,
    assignedOfficialId: 'usr-official-1',
    assignedOfficialName: 'Lcdo. Héctor Ortiz Santos',
    departmentId: 'dept-urbanismo',
    departmentName: 'Oficina de Ordenamiento Territorial y Urbanismo',
    feeAmount: 75.00,
    isPaid: false,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-20T16:45:00Z'
  },
  {
    id: 'app-2',
    municipalityId: 'muni-sanjuan',
    propertyId: 'prop-2',
    propertyAddress: 'Av. Ashford #1020, Apt 5B, Condado',
    cadastralNumber: '040-088-301-12-004',
    ownerId: 'usr-citizen-1',
    ownerName: 'Carlos Rivera Rodríguez',
    applicationTypeId: 'apptype-1',
    applicationTypeName: 'Certificación Municipal de Cumplimiento de Propiedad',
    applicationNumber: 'SJ-2026-0112',
    status: 'CERTIFICATE_ISSUED',
    currentStepIndex: 6,
    assignedOfficialId: 'usr-official-2',
    assignedOfficialName: 'Ing. Sofía Morales Cruz',
    departmentId: 'dept-urbanismo',
    departmentName: 'Oficina de Ordenamiento Territorial y Urbanismo',
    feeAmount: 75.00,
    isPaid: true,
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-01-22T11:20:00Z'
  }
];

export const INITIAL_DOCUMENTS: PropertyDocument[] = [
  {
    id: 'doc-1',
    applicationId: 'app-1',
    propertyId: 'prop-1',
    municipalityId: 'muni-sanjuan',
    code: 'DOC-ESCRITURA',
    name: 'Escritura de Propiedad / Título',
    description: 'Escritura notariada #402',
    fileName: 'Escritura_Cristo_204.pdf',
    fileUrl: '/mock/Escritura_Cristo_204.pdf',
    fileType: 'application/pdf',
    fileSize: '3.4 MB',
    status: 'APPROVED',
    version: 1,
    versionsHistory: [
      {
        version: 1,
        fileName: 'Escritura_Cristo_204.pdf',
        fileUrl: '/mock/Escritura_Cristo_204.pdf',
        uploadedAt: '2026-02-18T10:05:00Z',
        status: 'APPROVED'
      }
    ],
    uploadedAt: '2026-02-18T10:05:00Z',
    reviewedBy: 'Lcdo. Héctor Ortiz Santos',
    reviewedAt: '2026-02-19T14:20:00Z'
  },
  {
    id: 'doc-2',
    applicationId: 'app-1',
    propertyId: 'prop-1',
    municipalityId: 'muni-sanjuan',
    code: 'DOC-CRIM',
    name: 'Certificación de Radicación / CRIM Solvencia',
    description: 'Certificación de saldo y no deuda',
    fileName: 'CRIM_Cert_2026.pdf',
    fileUrl: '/mock/CRIM_Cert_2026.pdf',
    fileType: 'application/pdf',
    fileSize: '1.2 MB',
    status: 'IN_REVIEW',
    version: 2,
    versionsHistory: [
      {
        version: 1,
        fileName: 'CRIM_Cert_2024_Vencido.pdf',
        fileUrl: '/mock/CRIM_Cert_2024.pdf',
        uploadedAt: '2026-02-18T10:06:00Z',
        status: 'REJECTED',
        rejectionReason: 'La certificación del CRIM presentada está vencida (corresponde al año 2024). Suba la vigente 2026.'
      },
      {
        version: 2,
        fileName: 'CRIM_Cert_2026.pdf',
        fileUrl: '/mock/CRIM_Cert_2026.pdf',
        uploadedAt: '2026-02-20T11:15:00Z',
        status: 'IN_REVIEW'
      }
    ],
    uploadedAt: '2026-02-20T11:15:00Z'
  },
  {
    id: 'doc-3',
    applicationId: 'app-1',
    propertyId: 'prop-1',
    municipalityId: 'muni-sanjuan',
    code: 'DOC-ID',
    name: 'Identificación Oficial del Propietario',
    description: 'Licencia de Conducir PR',
    fileName: 'Licencia_Carlos_Rivera.pdf',
    fileUrl: '/mock/Licencia_Carlos_Rivera.pdf',
    fileType: 'application/pdf',
    fileSize: '850 KB',
    status: 'APPROVED',
    version: 1,
    versionsHistory: [
      {
        version: 1,
        fileName: 'Licencia_Carlos_Rivera.pdf',
        fileUrl: '/mock/Licencia_Carlos_Rivera.pdf',
        uploadedAt: '2026-02-18T10:07:00Z',
        status: 'APPROVED'
      }
    ],
    uploadedAt: '2026-02-18T10:07:00Z',
    reviewedBy: 'Lcdo. Héctor Ortiz Santos',
    reviewedAt: '2026-02-19T14:22:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-2',
    municipalityId: 'muni-sanjuan',
    applicationId: 'app-2',
    applicationNumber: 'SJ-2026-0112',
    propertyId: 'prop-2',
    ownerId: 'usr-citizen-1',
    ownerName: 'Carlos Rivera Rodríguez',
    amount: 75.00,
    status: 'COMPLETED',
    paymentMethod: 'ATH_MOVIL',
    transactionReference: 'ATH-99482103',
    paidAt: '2026-01-20T15:40:00Z',
    createdAt: '2026-01-20T15:35:00Z',
    receiptNumber: 'REC-SJ-2026-0912'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CERT-2026-SJ-00912',
    municipalityId: 'muni-sanjuan',
    municipalityName: 'Municipio Autónomo de San Juan',
    municipalityLogo: 'https://images.unsplash.com/photo-1590059203672-01938927976e?w=150&auto=format&fit=crop&q=80',
    propertyId: 'prop-2',
    cadastralNumber: '040-088-301-12-004',
    physicalAddress: 'Av. Ashford #1020, Apt 5B, Condado, San Juan, PR 00907',
    ownerId: 'usr-citizen-1',
    ownerName: 'Carlos Rivera Rodríguez',
    applicationId: 'app-2',
    applicationTypeName: 'Certificación Municipal de Cumplimiento de Propiedad',
    issueDate: '2026-01-22',
    expirationDate: '2027-01-22',
    qrCodeDataUrl: '',
    verificationUrl: 'https://munitrack.gov.pr/verify/CERT-2026-SJ-00912',
    digitalSignatureHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'VALID'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    applicationId: 'app-1',
    municipalityId: 'muni-sanjuan',
    senderId: 'usr-official-1',
    senderName: 'Lcdo. Héctor Ortiz Santos',
    senderRole: 'OFFICIAL',
    text: 'Saludos Don Carlos, hemos revisado su escritura e identificación (aprobados). Sin embargo, la certificación del CRIM adjunta corresponde a 2024. Por favor reemplace el archivo por el del año en curso.',
    isInternalNote: false,
    createdAt: '2026-02-19T14:25:00Z'
  },
  {
    id: 'msg-2',
    applicationId: 'app-1',
    municipalityId: 'muni-sanjuan',
    senderId: 'usr-official-1',
    senderName: 'Lcdo. Héctor Ortiz Santos',
    senderRole: 'OFFICIAL',
    text: 'Nota Interna: El solicitante subió la versión corregida del CRIM el 20 de febrero. Pendiente de re-evaluación.',
    isInternalNote: true,
    createdAt: '2026-02-20T11:20:00Z'
  },
  {
    id: 'msg-3',
    applicationId: 'app-1',
    municipalityId: 'muni-sanjuan',
    senderId: 'usr-citizen-1',
    senderName: 'Carlos Rivera Rodríguez',
    senderRole: 'CITIZEN',
    text: 'Buenas tardes Lcdo. Ortiz, acabo de subir la certificación del CRIM expedida esta mañana con sello digital 2026. Muchas gracias por la asistencia.',
    isInternalNote: false,
    createdAt: '2026-02-20T11:25:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-citizen-1',
    municipalityId: 'muni-sanjuan',
    title: 'Actualización en Solicitud SJ-2026-0084',
    message: 'Se requiere corrección en el documento: Certificación del CRIM.',
    type: 'WARNING',
    read: true,
    link: '/citizen?app=app-1',
    createdAt: '2026-02-19T14:25:00Z'
  },
  {
    id: 'notif-2',
    userId: 'usr-citizen-1',
    municipalityId: 'muni-sanjuan',
    title: 'Certificado Emitido Disponible',
    message: 'Su Certificado de Cumplimiento para la propiedad Av. Ashford #1020 está disponible para descarga.',
    type: 'SUCCESS',
    read: false,
    link: '/citizen?tab=certificates',
    createdAt: '2026-01-22T11:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1001',
    municipalityId: 'muni-sanjuan',
    userId: 'usr-official-1',
    userName: 'Lcdo. Héctor Ortiz Santos',
    userRole: 'OFFICIAL',
    action: 'DOCUMENT_REVIEWED',
    entityType: 'DOCUMENT',
    entityId: 'doc-1',
    details: 'Aprobó documento Escritura_Cristo_204.pdf para la solicitud SJ-2026-0084',
    ipAddress: '196.12.44.102',
    timestamp: '2026-02-19T14:20:00Z',
    previousHash: 'GENESIS_00000000000000000000000000000000',
    currentHash: 'a8f9c1b3d4e5f67890123456789abcdef0123456789abcdef0123456789abcde'
  },
  {
    id: 'aud-1002',
    municipalityId: 'muni-sanjuan',
    userId: 'usr-official-1',
    userName: 'Lcdo. Héctor Ortiz Santos',
    userRole: 'OFFICIAL',
    action: 'DOCUMENT_REJECTED',
    entityType: 'DOCUMENT',
    entityId: 'doc-2',
    details: 'Rechazó documento CRIM_Cert_2024.pdf (Documento vencido)',
    ipAddress: '196.12.44.102',
    timestamp: '2026-02-19T14:22:00Z',
    previousHash: 'a8f9c1b3d4e5f67890123456789abcdef0123456789abcdef0123456789abcde',
    currentHash: 'b9e8d7c6b5a4f3210987654321fedcba0987654321fedcba0987654321fedcba'
  },
  {
    id: 'aud-1003',
    municipalityId: 'muni-sanjuan',
    userId: 'usr-official-2',
    userName: 'Ing. Sofía Morales Cruz',
    userRole: 'OFFICIAL',
    action: 'CERTIFICATE_GENERATED',
    entityType: 'CERTIFICATE',
    entityId: 'cert-1',
    details: 'Generó Certificado CERT-2026-SJ-00912 con firma digital PKI X.509',
    ipAddress: '196.12.44.105',
    timestamp: '2026-01-22T11:20:00Z',
    previousHash: 'b9e8d7c6b5a4f3210987654321fedcba0987654321fedcba0987654321fedcba',
    currentHash: 'c7d6e5f4a3b2c10987654321fedcba0987654321fedcba0987654321fedcba09'
  }
];
