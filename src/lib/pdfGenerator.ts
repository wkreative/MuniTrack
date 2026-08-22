import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Certificate, Payment, Property } from './types';

/**
 * Generates an official Municipal Certificate of Compliance PDF with QR code verification and PKI signature stamp.
 */
export async function generateCertificatePDF(cert: Certificate, property?: Property): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Generate QR Code Data URL
  const qrDataUrl = await QRCode.toDataURL(cert.verificationUrl || `https://munitrack.gov.pr/verify/${cert.id}`, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 200,
    color: {
      dark: '#1e3a8a',
      light: '#ffffff'
    }
  });

  // Borders & Framing
  doc.setLineWidth(1);
  doc.setDrawColor(30, 58, 138); // Royal Navy
  doc.rect(10, 10, 196, 259);

  doc.setLineWidth(0.3);
  doc.setDrawColor(180, 180, 180);
  doc.rect(13, 13, 190, 253);

  // Header Banner
  doc.setFillColor(30, 58, 138);
  doc.rect(14, 14, 188, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(cert.municipalityName.toUpperCase(), 108, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('ESTADO LIBRE ASOCIADO DE PUERTO RICO', 108, 33, { align: 'center' });
  doc.text('OFICINA DE CUMPLIMIENTO Y ORDENAMIENTO TERRITORIAL', 108, 39, { align: 'center' });

  // Title
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CERTIFICADO MUNICIPAL DE CUMPLIMIENTO', 108, 58, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text(`NÚMERO DE CERTIFICADO: ${cert.certificateNumber}`, 108, 65, { align: 'center' });

  // Certificate Status Stamp
  doc.setFillColor(220, 252, 231); // Light Green
  doc.setDrawColor(22, 163, 74);
  doc.roundedRect(75, 71, 66, 8, 2, 2, 'FD');
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTADO: VIGENTE Y OFICIAL', 108, 76.5, { align: 'center' });

  // Body Content
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const bodyText = `Por la presente se certifica que la propiedad inmueble identificada a continuación ha cumplido satisfactoriamente con todos los requisitos reglamentarios, inspecciones técnicas, ordenanzas de ornato y pagos de arbitrios municipales exigidos por el ${cert.municipalityName}.`;

  const splitText = doc.splitTextToSize(bodyText, 170);
  doc.text(splitText, 23, 90);

  // Property Details Table
  doc.setFillColor(245, 247, 250);
  doc.rect(23, 108, 170, 65, 'F');
  doc.setDrawColor(220, 225, 230);
  doc.rect(23, 108, 170, 65, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('DATOS DE LA PROPIEDAD Y PROPIETARIO', 28, 117);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  doc.text('Número de Catastro:', 28, 126);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.cadastralNumber, 75, 126);

  doc.setFont('helvetica', 'normal');
  doc.text('Dirección Física:', 28, 134);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.physicalAddress, 75, 134);

  doc.setFont('helvetica', 'normal');
  doc.text('Nombre del Titular:', 28, 142);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.ownerName, 75, 142);

  doc.setFont('helvetica', 'normal');
  doc.text('Tipo de Certificación:', 28, 150);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.applicationTypeName, 75, 150);

  doc.setFont('helvetica', 'normal');
  doc.text('Fecha de Emisión:', 28, 158);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.issueDate, 75, 158);

  doc.setFont('helvetica', 'normal');
  doc.text('Fecha de Expiración:', 28, 166);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.expirationDate || 'Sin Expiración / Permanente', 75, 166);

  // Security Seal & QR Code Section
  doc.addImage(qrDataUrl, 'PNG', 25, 182, 38, 38);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('VERIFICACIÓN PÚBLICA MEDIANTE CÓDIGO QR', 68, 188);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const qrInstruction = `Escanee el código QR adyacente o acceda a la dirección pública para validar la autenticidad en tiempo real de este documento en el portal gubernamental:`;
  const splitInstruction = doc.splitTextToSize(qrInstruction, 120);
  doc.text(splitInstruction, 68, 194);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(cert.verificationUrl, 68, 207);

  // PKI Digital Signature Box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.rect(23, 226, 170, 16, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('FIRMA DIGITAL Y SELLO CRIPTOGRÁFICO DE INMUTABILIDAD PKI X.509:', 26, 231);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text(cert.digitalSignatureHash, 26, 237);

  // Signatures
  doc.setLineWidth(0.5);
  doc.setDrawColor(100, 100, 100);
  doc.line(40, 254, 95, 254);
  doc.line(115, 254, 170, 254);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('Firma Autorizada Municipio', 67.5, 258, { align: 'center' });
  doc.text('Director de Ordenamiento Territorial', 142.5, 258, { align: 'center' });

  return doc.output('blob');
}

/**
 * Download generated Certificate PDF directly in browser
 */
export async function downloadCertificatePDF(cert: Certificate, property?: Property) {
  const blob = await generateCertificatePDF(cert, property);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Certificado_${cert.certificateNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download Receipt PDF for payment
 */
export async function downloadReceiptPDF(payment: Payment) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 148, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RECIBO OFICIAL DE PAGO MUNICIPAL', 74, 14, { align: 'center' });

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Recibo #: ${payment.receiptNumber || 'REC-' + payment.id.slice(0, 8)}`, 14, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Fecha: ${new Date(payment.paidAt || payment.createdAt).toLocaleString('es-PR')}`, 14, 38);
  doc.text(`Solicitud #: ${payment.applicationNumber}`, 14, 44);
  doc.text(`Contribuyente: ${payment.ownerName}`, 14, 50);

  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 56, 134, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('CONCEPTO', 14, 63);
  doc.text('MÉTODO', 85, 63);
  doc.text('MONTO', 134, 63, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Cargo por Tramitación Municipal', 14, 72);
  doc.text(payment.paymentMethod.replace('_', ' '), 85, 72);
  doc.text(`$${payment.amount.toFixed(2)}`, 134, 72, { align: 'right' });

  doc.line(14, 80, 134, 80);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL PAGADO:', 85, 88);
  doc.text(`$${payment.amount.toFixed(2)}`, 134, 88, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Referencia de Transacción: ${payment.transactionReference || 'N/A'}`, 14, 105);
  doc.text('Este recibo constituye evidencia oficial de pago procesado y reconciliado.', 14, 110);

  doc.save(`Recibo_${payment.receiptNumber || payment.id}.pdf`);
}
