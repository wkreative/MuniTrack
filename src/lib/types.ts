export type Role = 'CITIZEN' | 'OFFICIAL' | 'SUPERVISOR' | 'ADMIN' | 'SUPERADMIN';

export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED' | 'LAND';

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CORRECTION_REQUIRED'
  | 'DOCS_APPROVED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'APPROVED'
  | 'REJECTED'
  | 'CERTIFICATE_ISSUED';

export type DocumentStatus = 
  | 'PENDING'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CORRECTION_REQUIRED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'ATH_MOVIL' | 'CREDIT_CARD' | 'CASHIER_BOLETIN' | 'BANK_TRANSFER';

export interface Municipality {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bannerUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  activeModules: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  municipalityId: string;
  avatarUrl: string;
  departmentId?: string;
  departmentName?: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  taxId: string; // SSN or EIN
  email: string;
  phone: string;
  ownershipPercentage: number;
}

export interface Property {
  id: string;
  municipalityId: string;
  cadastralNumber: string; // Número de Catastro (ej. 040-025-112-05-001)
  propertyNumber: string;
  physicalAddress: string;
  urbanization?: string;
  sector?: string;
  zipCode: string;
  propertyType: PropertyType;
  useType: string;
  acquisitionDate: string;
  deedNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  owners: PropertyOwner[];
  status: 'REGISTERED' | 'PENDING_VERIFICATION' | 'ARCHIVED';
  createdAt: string;
}

export interface RequiredDocumentSpec {
  code: string;
  name: string;
  description: string;
  allowedTypes: string[];
  isRequired: boolean;
}

export interface ApplicationType {
  id: string;
  municipalityId: string;
  code: string;
  name: string;
  description: string;
  feeAmount: number;
  departmentId: string;
  departmentName: string;
  requiredDocuments: RequiredDocumentSpec[];
}

export interface Application {
  id: string;
  municipalityId: string;
  propertyId: string;
  propertyAddress: string;
  cadastralNumber: string;
  ownerId: string;
  ownerName: string;
  applicationTypeId: string;
  applicationTypeName: string;
  applicationNumber: string; // MUN-2026-0084
  status: ApplicationStatus;
  currentStepIndex: number;
  assignedOfficialId?: string;
  assignedOfficialName?: string;
  departmentId: string;
  departmentName: string;
  feeAmount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  version: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface PropertyDocument {
  id: string;
  applicationId: string;
  propertyId: string;
  municipalityId: string;
  code: string;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  status: DocumentStatus;
  rejectionReason?: string;
  version: number;
  versionsHistory: DocumentVersion[];
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Payment {
  id: string;
  municipalityId: string;
  applicationId: string;
  applicationNumber: string;
  propertyId: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  boletinCode?: string;
  paidAt?: string;
  createdAt: string;
  receiptNumber?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // CERT-2026-SJ-9982
  municipalityId: string;
  municipalityName: string;
  municipalityLogo: string;
  propertyId: string;
  cadastralNumber: string;
  physicalAddress: string;
  ownerId: string;
  ownerName: string;
  applicationId: string;
  applicationTypeName: string;
  issueDate: string;
  expirationDate?: string;
  qrCodeDataUrl: string;
  verificationUrl: string;
  digitalSignatureHash: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
}

export interface Notification {
  id: string;
  userId: string;
  municipalityId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  applicationId: string;
  municipalityId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  isInternalNote: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  municipalityId: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  roleRequired: Role;
  autoTriggerNext: boolean;
}
