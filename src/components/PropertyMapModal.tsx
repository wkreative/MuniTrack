'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, Search, X, Layers, AlertCircle, Compass } from 'lucide-react';

interface PropertyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (data: {
    cadastralNumber: string;
    physicalAddress: string;
    urbanization: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

export default function PropertyMapModal({
  isOpen,
  onClose,
  onSelectLocation
}: PropertyMapModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<{
    cadastral: string;
    address: string;
    urb: string;
    lat: number;
    lng: number;
  } | null>({
    cadastral: '040-025-112-05-001',
    address: 'Calle del Cristo #204, Viejo San Juan, PR 00901',
    urb: 'Histórico San Juan',
    lat: 18.4655,
    lng: -66.1167
  });

  if (!isOpen) return null;

  const mockParcels = [
    {
      cadastral: '040-025-112-05-001',
      address: 'Calle del Cristo #204, Viejo San Juan',
      urb: 'Histórico San Juan',
      lat: 18.4655,
      lng: -66.1167
    },
    {
      cadastral: '040-088-301-12-004',
      address: 'Av. Ashford #1020, Condado',
      urb: 'Condado Bayfront',
      lat: 18.4552,
      lng: -66.0718
    },
    {
      cadastral: '040-142-009-88-002',
      address: 'Calle Chardón #350, Hato Rey',
      urb: 'Milla de Oro',
      lat: 18.4231,
      lng: -66.0594
    }
  ];

  const handleConfirm = () => {
    if (selectedParcel) {
      onSelectLocation({
        cadastralNumber: selectedParcel.cadastral,
        physicalAddress: selectedParcel.address,
        urbanization: selectedParcel.urb,
        coordinates: { lat: selectedParcel.lat, lng: selectedParcel.lng }
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Geolocalizador y Selección de Parcela Catastral (GIS)
              </h3>
              <p className="text-xs text-slate-400">
                Seleccione visualmente su parcela sobre el mapa parcelario municipal
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

        {/* Search & GIS Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por catastro o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Capa GIS Municipal Activa</span>
            </span>
          </div>
        </div>

        {/* Map Simulation Container */}
        <div className="relative flex-1 min-h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Simulated Satellite/Parcel Grid Graphic */}
          <div
            className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Interactive Parcels Overlay */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 max-w-3xl w-full">
            {mockParcels.map((parcel) => {
              const isSelected = selectedParcel?.cadastral === parcel.cadastral;
              return (
                <div
                  key={parcel.cadastral}
                  onClick={() => setSelectedParcel(parcel)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-sky-950/90 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-105'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-900/80 text-sky-300 border border-sky-700">
                      PARCELA GIS
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-400" />}
                  </div>

                  <p className="text-xs font-mono font-bold mt-2 text-sky-200">
                    {parcel.cadastral}
                  </p>
                  <p className="text-xs font-semibold mt-1 text-white line-clamp-1">
                    {parcel.address}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">{parcel.urb}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Lat: {parcel.lat}</span>
                    <span>Lng: {parcel.lng}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white p-3 rounded-xl border border-slate-700 text-xs backdrop-blur-md max-w-sm">
            <div className="flex items-center space-x-2 text-sky-400 font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Coordenadas Georreferenciadas</span>
            </div>
            <p className="text-slate-300">
              {selectedParcel
                ? `${selectedParcel.address} (${selectedParcel.lat}, ${selectedParcel.lng})`
                : 'Haga clic en una parcela catastral para seleccionarla'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Datos sincronizados con la Base Geográfica Municipal</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedParcel}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md disabled:opacity-50"
            >
              Confirmar Ubicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
