import React, { useState } from 'react';
import { Plus, Edit2, CheckCircle2, XCircle, X, Check, Trash2, Ticket, Sparkles } from 'lucide-react';
import { TicketPackage } from '../../data/eventData';
import { INITIAL_SERVICES, IncludedService } from '../../data/adminData';
import { useBookings } from '../../context/BookingContext';

export const AdminPackagesView: React.FC = () => {
  const { packages, updatePackage, addPackage } = useBookings();
  const [services, setServices] = useState<IncludedService[]>(INITIAL_SERVICES);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [servicesSaveMsg, setServicesSaveMsg] = useState<string | null>(null);

  // Add New Package Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', description: '' });

  // Configure Tier Modal State
  const [configuringPackage, setConfiguringPackage] = useState<TicketPackage | null>(null);
  const [configureForm, setConfigureForm] = useState<{
    name: string;
    price: number;
    badge: string;
    description: string;
    features: string[];
  }>({
    name: '',
    price: 0,
    badge: 'Available',
    description: '',
    features: [],
  });
  const [newFeatureText, setNewFeatureText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const handleOpenConfigure = (pkg: TicketPackage) => {
    setConfiguringPackage(pkg);
    setConfigureForm({
      name: pkg.name,
      price: pkg.price,
      badge: pkg.badge || 'Available',
      description: pkg.description || '',
      features: [...pkg.features],
    });
    setNewFeatureText('');
    setSaveSuccessMsg(null);
  };

  const handleCloseConfigure = () => {
    setConfiguringPackage(null);
    setSaveSuccessMsg(null);
    setNewFeatureText('');
  };

  const handleAddFeature = () => {
    const text = newFeatureText.trim();
    if (!text) return;
    if (configureForm.features.includes(text)) {
      setNewFeatureText('');
      return;
    }
    setConfigureForm((prev) => ({
      ...prev,
      features: [...prev.features, text],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setConfigureForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSaveConfigure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringPackage) return;

    if (!configureForm.name.trim()) {
      alert('Please enter a tier name.');
      return;
    }
    if (configureForm.price < 0) {
      alert('Price cannot be negative.');
      return;
    }

    updatePackage(configuringPackage.id, {
      name: configureForm.name.trim(),
      price: Number(configureForm.price),
      badge: configureForm.badge.trim() || 'Available',
      description: configureForm.description.trim(),
      features: configureForm.features,
    });

    setSaveSuccessMsg(`Tier "${configureForm.name}" updated successfully!`);
    setTimeout(() => {
      handleCloseConfigure();
    }, 900);
  };

  const handleSaveNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name.trim() || !newPackage.price) {
      alert('Please enter a package name and price.');
      return;
    }

    const priceNum = Number(newPackage.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid positive price.');
      return;
    }

    const pkgId = `pkg-${Date.now()}`;
    addPackage({
      id: pkgId,
      name: newPackage.name.trim(),
      price: priceNum,
      currency: 'LKR',
      badge: 'Available',
      description: newPackage.description.trim() || 'Custom ticket tier for event attendees.',
      features: ['Main Stage Access', 'Standard Seating', 'Food Court Access'],
    });

    setShowAddModal(false);
    setNewPackage({ name: '', price: '', description: '' });
  };

  return (
    <div className="space-y-8">
      {/* Top Header (TC-22) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-white tracking-tight mb-1">
            Packages
          </h1>
          <p className="font-hanken text-xs sm:text-sm text-slate-300">
            Configure event ticket tiers, pricing models, and bundled hospitality services.
          </p>
        </div>

        {/* Add New Package CTA matching Figma EL-1c463c60 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#071A3D] font-jakarta font-bold text-sm transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#071A3D]" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Package Tier Cards Grid matching Figma #61:8377 (TC-25, TC-26) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-jakarta font-bold text-lg text-[#071A3D]">
                  {pkg.name}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                    pkg.badge === 'Sold Out'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : pkg.badge === 'Filling Fast'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {pkg.badge}
                </span>
              </div>
              <div className="font-jakarta font-extrabold text-3xl text-[#071A3D] mb-2">
                {pkg.currency} {pkg.price.toLocaleString()}
              </div>
              <p className="font-hanken text-xs text-gray-600 mb-6">
                {pkg.description}
              </p>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Included Features ({pkg.features.length}):
                </span>
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-hanken text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Configure Tier and Edit Actions (TC-25, TC-26) */}
            <div className="flex items-center gap-2.5 mt-6">
              <button
                onClick={() => handleOpenConfigure(pkg)}
                className="flex-1 py-2.5 rounded-xl bg-[#071A3D] hover:bg-[#121258] text-white text-xs font-jakarta font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure Tier</span>
              </button>
              <button
                onClick={() => handleOpenConfigure(pkg)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:border-[#071A3D] hover:bg-slate-50 text-xs font-jakarta font-bold text-gray-700 hover:text-[#071A3D] transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                title="Edit package details"
              >
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Included Services Section matching Figma #62:8730 & #66:9793 (TC-26, TC-27) */}
      <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
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
            onClick={() => {
              const next = !isEditingServices;
              setIsEditingServices(next);
              if (!next) {
                setServicesSaveMsg('Included services updated and saved successfully!');
                setTimeout(() => setServicesSaveMsg(null), 3000);
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-jakarta font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isEditingServices
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-[#071A3D]'
            }`}
          >
            {isEditingServices ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
            <span>{isEditingServices ? 'Done' : 'Edit'}</span>
          </button>
        </div>

        {/* Services Save Confirmation Banner (TC-27) */}
        {servicesSaveMsg && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{servicesSaveMsg}</span>
          </div>
        )}

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
              } ${isEditingServices ? 'cursor-pointer hover:border-[#071A3D] hover:shadow-sm' : ''}`}
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

      {/* ========================================================================= */}
      {/* Configure Ticket Tier Modal (TC-25)                                       */}
      {/* ========================================================================= */}
      {configuringPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#071A3D]/10 flex items-center justify-center text-[#071A3D]">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
                    Configure Ticket Tier
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Edit pricing, availability badge, and included features
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseConfigure}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Banner */}
            {saveSuccessMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfigure} className="space-y-4">
              {/* Tier Name */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1">
                  Tier / Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={configureForm.name}
                  onChange={(e) => setConfigureForm({ ...configureForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                  placeholder="e.g. VIP Tickets"
                />
              </div>

              {/* Price & Badge Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={configureForm.price}
                    onChange={(e) => setConfigureForm({ ...configureForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-[#071A3D] bg-white focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1">
                    Availability Badge
                  </label>
                  <select
                    value={configureForm.badge}
                    onChange={(e) => setConfigureForm({ ...configureForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                  >
                    <option value="Available">Available</option>
                    <option value="Filling Fast">Filling Fast</option>
                    <option value="Limited Offer">Limited Offer</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="VIP Exclusive">VIP Exclusive</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={configureForm.description}
                  onChange={(e) => setConfigureForm({ ...configureForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                  placeholder="Package description for public attendees..."
                />
              </div>

              {/* Included Features List */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-800 block">
                  Included Features ({configureForm.features.length})
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {configureForm.features.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No features added yet.</p>
                  ) : (
                    configureForm.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new feature input */}
                <div className="flex items-center gap-2 pt-1.5">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add new feature (e.g. Free Welcome Drink)..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleCloseConfigure}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#071A3D] text-white text-xs font-bold hover:bg-[#121258] shadow-md transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Add New Package Modal (TC-24)                                             */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-playfair font-bold text-xl text-[#071A3D]">
                  Add New Package
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPackage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VVIP Lounge"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  placeholder="e.g. 10000"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Package perks and tier details..."
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#071A3D] focus:border-[#071A3D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#071A3D] text-white text-xs font-bold hover:bg-[#121258] shadow-md transition-all active:scale-[0.98]"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
