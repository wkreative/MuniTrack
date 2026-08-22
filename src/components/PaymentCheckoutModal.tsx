'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/lib/types';
import {
  X,
  CreditCard,
  Smartphone,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Barcode,
  Printer,
  Sparkles
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationNumber: string;
  amount: number;
  onProcessPayment: (method: PaymentMethod, txRef?: string) => void;
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  applicationNumber,
  amount,
  onProcessPayment
}: PaymentCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ATH_MOVIL');
  const [athPhone, setAthPhone] = useState('(787) 555-0192');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('912');
  const [isProcessing, setIsProcessing] = useState(false);
  const [boletinCode, setBoletinCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedMethod === 'CASHIER_BOLETIN') {
        const code = `BOL-${Math.floor(100000 + Math.random() * 900000)}`;
        setBoletinCode(code);
        onProcessPayment('CASHIER_BOLETIN', code);
      } else {
        onProcessPayment(selectedMethod);
        onClose();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold font-heading">Pasarela Segura de Pago Municipal</h3>
              <p className="text-xs text-slate-400">Solicitud #{applicationNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total a Pagar</p>
              <p className="text-xs text-slate-300">Arbitrio de Tramitación Municipal</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400 font-heading">
                ${amount.toFixed(2)}
              </span>
              <p className="text-[10px] text-slate-400">USD</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          {!boletinCode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Seleccione el Método de Pago:
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* ATH Móvil */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('ATH_MOVIL')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                    selectedMethod === 'ATH_MOVIL'
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-md font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-orange-600 mb-1" />
                  <span className="text-xs font-bold">ATH Móvil</span>
                  <span className="text-[10px] text-orange-700 font-medium">Instantáneo</span>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('CREDIT_CARD')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                    selectedMethod === 'CREDIT_CARD'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-md font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs font-bold">Tarjeta</span>
                  <span className="text-[10px] text-blue-700 font-medium">Visa / MasterCard</span>
                </button>

                {/* Boletín Presencial */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('CASHIER_BOLETIN')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                    selectedMethod === 'CASHIER_BOLETIN'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-md font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Receipt className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold">Caja Municipal</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Pago Presencial</span>
                </button>
              </div>

              {/* Dynamic Method Input Fields */}
              <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                {selectedMethod === 'ATH_MOVIL' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de Teléfono registrado en ATH Móvil:
                    </label>
                    <input
                      type="text"
                      value={athPhone}
                      onChange={(e) => setAthPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>Recibirás una notificación instantánea en tu app ATH Móvil para autorizar.</span>
                    </p>
                  </div>
                )}

                {selectedMethod === 'CREDIT_CARD' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Tarjeta de Crédito / Débito:
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Expiración:
                        </label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          CVC / CVV:
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'CASHIER_BOLETIN' && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">
                      Pago en Colecturía / Ventanilla de Caja Municipal:
                    </p>
                    <p>
                      Se generará un boletín oficial de pago con código de barras de 12 dígitos. Podrá presentar el boleto impreso o desde su dispositivo móvil en cualquier colecturía municipal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generated Cashier Boletin Result */}
          {boletinCode && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950 font-heading">
                Boletín de Pago Presencial Generado
              </h4>
              <p className="text-xs text-emerald-800">
                Presente este código en la Caja Municipal para completar su pago:
              </p>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block shadow-inner">
                <Barcode className="w-48 h-12 text-slate-900 mx-auto" />
                <p className="font-mono font-extrabold text-sm text-slate-900 mt-1">
                  {boletinCode}
                </p>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-white text-emerald-900 rounded-xl border border-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Boletín</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 shadow-md"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!boletinCode && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isProcessing
                  ? 'Procesando Pago Seguro...'
                  : selectedMethod === 'CASHIER_BOLETIN'
                  ? 'Generar Boletín Presencial'
                  : `Pagar $${amount.toFixed(2)}`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
