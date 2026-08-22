import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'MuniOne | Plataforma Municipal de Registro y Cumplimiento de Propiedades',
  description: 'Plataforma SaaS Multi-Tenant para la digitalización de expedientes de propiedad, trámites municipales, pagos y emisión de certificados de cumplimiento con verificación QR.',
  keywords: 'municipios, puerto rico, registro de propiedad, catastro, crim, cumplimiento municipal, saas govtech'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-8 border-t border-slate-800 text-xs no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white font-heading">MuniOne GovSaaS</span>
              <span className="text-slate-600">•</span>
              <span>Infraestructura Municipal Multi-Tenant Securizada</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Términos y Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Soporte Técnico</a>
              <a href="#" className="hover:text-white transition-colors">WCAG 2.1 AA Accesibilidad</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
