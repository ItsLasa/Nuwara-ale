import React, { useState } from 'react';
import { Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { EVENT_DATA } from '../../data/eventData';
import { INITIAL_SERVICES, IncludedService } from '../../data/adminData';

export const AdminPackagesView: React.FC = () => {
  const [services, setServices] = useState<IncludedService[]>(INITIAL_SERVICES);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', description: '' });

  const toggleService = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair font-bold text-3xl text-[#071A3D] mb-1">
            Packages
          </h1>
          <p className="font-hanken text-sm text-gray-500">
            Configure event ticket tiers, pricing models, and bundled hospitality services.
          </p>
        </div>

        {/* Add New Package CTA matching Figma EL-1c463c60 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#071A3D] hover:bg-[#121258] text-white font-jakarta font-semibold text-sm transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Package Tier Cards Grid matching Figma #61:8377 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {EVENT_DATA.packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-jakarta font-bold text-lg text-[#071A3D]">
                  {pkg.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  {pkg.badge}
                </span>
              </div>
              <div className="font-jakarta font-extrabold text-3xl text-[#071A3D] mb-2">
                {pkg.currency} {pkg.price.toLocaleString()}
              </div>
              <p className="font-hanken text-xs text-gray-500 mb-6">
                {pkg.description}
              </p>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Included Features:
                </span>
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-hanken text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-jakarta font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-gray-500" />
              <span>Configure Tier</span>
            </button>
          </div>
        ))}
      </div>

      {/* Included Services Section matching Figma #62:8730 & #66:9793 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="font-jakarta font-bold text-xs uppercase tracking-widest text-[#071A3D] block">
              INCLUDED SERVICES
            </span>
            <span className="font-hanken text-xs text-gray-500">
              Manage venue perks and amenities assigned across ticket tiers
            </span>
          </div>

          <button
            onClick={() => setIsEditingServices(!isEditingServices)}
            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-jakarta font-bold text-[#071A3D] transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingServices ? 'Done' : 'Edit'}</span>
          </button>
        </div>

        {/* 5 Core Services List matching Figma specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={() => isEditingServices && toggleService(srv.id)}
              className={`p-4 rounded-xl border flex items-start justify-between transition-all ${
                srv.active
                  ? 'bg-emerald-50/20 border-emerald-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              } ${isEditingServices ? 'cursor-pointer hover:border-[#071A3D]' : ''}`}
            >
              <div>
                <h4 className="font-jakarta font-bold text-sm text-[#071A3D]">
                  {srv.title}
                </h4>
                <p className="font-hanken text-xs text-gray-500 mt-0.5">
                  {srv.description}
                </p>
              </div>

              <div className="shrink-0 ml-3">
                {srv.active ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
                Add New Package
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. VVIP Lounge"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#071A3D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#071A3D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Package perks..."
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#071A3D]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Package created successfully!');
                  setShowAddModal(false);
                }}
                className="px-6 py-2 rounded-xl bg-[#071A3D] text-white text-xs font-bold hover:bg-[#121258]"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
