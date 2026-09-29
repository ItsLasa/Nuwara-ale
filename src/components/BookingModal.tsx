import React, { useState, useEffect, useRef } from 'react';
import { X, Ticket, ChevronUp, ChevronDown, ArrowRight, ArrowLeft, Upload, CheckCircle2, MessageCircle, Download, Loader2, AlertCircle } from 'lucide-react';
import { TicketPackage, EVENT_DATA } from '../data/eventData';
import { useBookings } from '../context/BookingContext';
import { BookingRecord } from '../data/adminData';
import { downloadTicketPdf } from '../utils/ticketPdfGenerator';

/**
 * Checks whether an uploaded image canvas is effectively blank
 * (e.g. solid white, solid black, entirely transparent, or uniform single color without receipt content)
 */
const isCanvasImageBlank = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  try {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    const totalPixels = width * height;
    if (totalPixels === 0) return true;

    const firstR = imgData[0];
    const firstG = imgData[1];
    const firstB = imgData[2];
    const firstA = imgData[3];

    let allTransparent = true;
    let allSameColor = true;

    // Sample across the image (up to 1500 pixels) to detect contrast/text/lines
    const step = Math.max(1, Math.floor(totalPixels / 1500));
    for (let i = 0; i < totalPixels; i += step) {
      const idx = i * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const a = imgData[idx + 3];

      if (a > 15) {
        allTransparent = false;
      }

      // Check difference against first pixel - valid slips have text, borders, stamps
      if (
        Math.abs(r - firstR) > 12 ||
        Math.abs(g - firstG) > 12 ||
        Math.abs(b - firstB) > 12 ||
        Math.abs(a - firstA) > 20
      ) {
        allSameColor = false;
        break;
      }
    }

    if (allTransparent) return true;
    if (allSameColor) return true;

    return false;
  } catch {
    return false;
  }
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: TicketPackage | null;
}

interface TicketQuantities {
  vip: number;
  general: number;
  earlybird: number;
}

const TICKET_PRICES = {
  vip: 5000,
  general: 3000,
  earlybird: 2000,
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackage,
}) => {
  const { addBooking } = useBookings();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form inputs matching Figma #4:931
  const [referenceNumber, setReferenceNumber] = useState('REF-099952');
  const [currentDate, setCurrentDate] = useState('08/24/2026 11:28');
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // Ticket quantities state matching Figma #4:969
  const [quantities, setQuantities] = useState<TicketQuantities>({
    vip: 0,
    general: 0,
    earlybird: 0,
  });

  // Slip file for Step 2
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [slipError, setSlipError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmed booking saved in context
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Set initial package quantity & generate dynamic reference when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSlipFile(null);
      setSlipPreviewUrl(null);
      setSlipError(null);
      const randomRef = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceNumber(randomRef);

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentDate(`${formattedDate} ${formattedTime}`);

      if (initialPackage) {
        setQuantities({
          vip: initialPackage.id === 'vip' ? 1 : 0,
          general: initialPackage.id === 'general' ? 1 : 0,
          earlybird: initialPackage.id === 'earlybird' ? 1 : 0,
        });
      } else {
        setQuantities({ vip: 1, general: 0, earlybird: 0 });
      }
    }
  }, [isOpen, initialPackage]);

  if (!isOpen) return null;

  // Calculate total price
  const totalAmount =
    quantities.vip * TICKET_PRICES.vip +
    quantities.general * TICKET_PRICES.general +
    quantities.earlybird * TICKET_PRICES.earlybird;

  const totalTickets = quantities.vip + quantities.general + quantities.earlybird;

  const updateQuantity = (type: keyof TicketQuantities, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalTickets === 0) {
      alert('Please select at least 1 ticket quantity to proceed.');
      return;
    }
    setStep(2);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlipError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check for zero-byte or empty file
      if (file.size === 0) {
        setSlipError('The selected file is empty (0 bytes). Please upload a valid payment slip.');
        setSlipFile(null);
        setSlipPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Check for suspiciously tiny dimensions
            if (img.width < 50 || img.height < 50) {
              setSlipError('The selected image is too small to be a payment slip. Please upload a clear photo or screenshot.');
              setSlipFile(null);
              setSlipPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
            }

            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);

              // Detect blank / solid single-color images
              if (isCanvasImageBlank(ctx, w, h)) {
                setSlipError('The uploaded image appears to be blank. A blank slip cannot be used to confirm booking. Please upload a valid payment receipt.');
                setSlipFile(null);
                setSlipPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
              }

              setSlipFile(file);
              setSlipPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
            } else {
              setSlipFile(file);
              setSlipPreviewUrl(event.target?.result as string);
            }
          };
          img.onerror = () => {
            setSlipError('Failed to read image file. Please upload a valid image.');
            setSlipFile(null);
            setSlipPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // PDF or other documents
        if (file.size < 100) {
          setSlipError('The selected PDF file is too small or invalid. Please upload a valid payment slip.');
          setSlipFile(null);
          setSlipPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
        setSlipFile(file);
        setSlipPreviewUrl(null);
      }
    }
  };

  const handleConfirmBooking = () => {
    // Slip upload is strictly mandatory before confirming booking
    if (!slipFile) {
      setSlipError('Bank payment slip upload is mandatory. You cannot confirm your booking without uploading your payment slip.');
      return;
    }
    if (slipFile.size === 0) {
      setSlipError('The uploaded slip file is empty. Please upload a valid bank payment slip.');
      return;
    }
    if (slipError) {
      return;
    }

    const pkgLabels: string[] = [];
    if (quantities.vip > 0) pkgLabels.push(`VIP (${quantities.vip})`);
    if (quantities.general > 0) pkgLabels.push(`General (${quantities.general})`);
    if (quantities.earlybird > 0) pkgLabels.push(`Earlybird (${quantities.earlybird})`);
    const primaryType = pkgLabels.join(', ') || 'VIP Tickets';

    const now = new Date();
    const formattedDisplayDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const formattedDisplayTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const saved = addBooking({
      refNumber: referenceNumber,
      customerName: name.trim() || 'Attendee',
      nic: nic.trim(),
      date: formattedDisplayDate,
      time: formattedDisplayTime,
      status: 'Pending verification',
      ticketType: primaryType,
      ticketBreakdown: { ...quantities },
      ticketQty: totalTickets,
      contactNumber: contactNumber.trim(),
      email: email.trim(),
      totalPrice: totalAmount,
      slipName: slipFile ? slipFile.name : undefined,
      slipUrl: slipPreviewUrl || undefined,
    });

    setConfirmedBooking(saved);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setSlipFile(null);
    setSlipPreviewUrl(null);
    setSlipError(null);
    setConfirmedBooking(null);
    setIsGeneratingPdf(false);
    onClose();
  };

  const handleDownloadTicket = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadTicketPdf({
        refNumber: confirmedBooking?.refNumber || referenceNumber,
        customerName: confirmedBooking?.customerName || name.trim() || 'Valued Guest',
        nic: confirmedBooking?.nic || nic.trim() || undefined,
        contactNumber: confirmedBooking?.contactNumber || contactNumber.trim() || 'N/A',
        email: confirmedBooking?.email || email.trim() || 'N/A',
        date: confirmedBooking?.date,
        time: confirmedBooking?.time,
        status: confirmedBooking?.status || 'Pending verification',
        ticketType: confirmedBooking?.ticketType,
        ticketBreakdown: confirmedBooking?.ticketBreakdown || quantities,
        ticketQty: confirmedBooking?.ticketQty || totalTickets,
        totalPrice: confirmedBooking?.totalPrice || totalAmount,
      });
    } catch (err) {
      console.error('Failed to generate PDF ticket:', err);
      alert('An error occurred while generating your PDF ticket. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* ========================================================================= */}
      {/* STEP 1: Buy Tickets Modal (Figma Frame #4:922 in #4:121)                   */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[672px] bg-white rounded-xl shadow-2xl overflow-hidden my-auto border border-gray-100"
          style={{
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Modal Header matching Figma #4:923 */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2.5">
              <div className="text-[#121258]">
                <Ticket className="w-5 h-5" />
              </div>
              <h2 className="font-sans font-bold text-xl text-[#111827] tracking-tight">
                Buy Tickets
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-[#9CA3AF] hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body matching Figma #4:931 */}
          <form onSubmit={handleNextStep}>
            <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
              {/* Reference Number Field matching Figma #4:933 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  readOnly
                  className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#6B7280] font-mono cursor-not-allowed select-all"
                />
              </div>

              {/* Time & Date Field matching Figma #4:939 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  Time & Date
                </label>
                <input
                  type="text"
                  value={currentDate}
                  readOnly
                  className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-md text-sm text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* Name Field matching Figma #4:945 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-gray-900 placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#121258] focus:border-[#121258] transition-colors"
                />
              </div>

              {/* NIC Number Field matching Figma #4:951 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  NIC Number
                </label>
                <input
                  type="text"
                  required
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="Enter Your nic"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-gray-900 placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#121258] focus:border-[#121258] transition-colors"
                />
              </div>

              {/* Contact Number Field matching Figma #4:957 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter Your Contact number"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-gray-900 placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#121258] focus:border-[#121258] transition-colors"
                />
              </div>

              {/* Email Field matching Figma #4:963 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your email"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-gray-900 placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#121258] focus:border-[#121258] transition-colors"
                />
              </div>

              {/* Ticket Quantities Section matching Figma #4:969 */}
              <div className="pt-4 border-t border-[#F3F4F6] space-y-3">
                <h3 className="text-sm font-medium text-[#111827]">
                  Select Ticket Quantities:
                </h3>

                {/* VIP Ticket Row matching Figma #4:973 (bg: #A6BDEB) */}
                <div className="flex items-center justify-between p-3.5 bg-[#A6BDEB] rounded-md shadow-sm">
                  <span className="font-bold text-base text-[#111827]">
                    VIP (5,000 LKR)
                  </span>
                  <div className="w-24 bg-white border border-[#E5E7EB] rounded flex items-center justify-between px-2 py-1 shadow-sm">
                    <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                      {quantities.vip}
                    </span>
                    <div className="flex flex-col border-l border-gray-200 pl-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity('vip', 1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity('vip', -1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* General Ticket Row matching Figma #4:989 (bg: #30969F) */}
                <div className="flex items-center justify-between p-3.5 bg-[#30969F] rounded-md shadow-sm">
                  <span className="font-bold text-base text-white">
                    GENERAL (3,000 LKR)
                  </span>
                  <div className="w-24 bg-white border border-[#E5E7EB] rounded flex items-center justify-between px-2 py-1 shadow-sm">
                    <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                      {quantities.general}
                    </span>
                    <div className="flex flex-col border-l border-gray-200 pl-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity('general', 1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity('general', -1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Earlybird Ticket Row matching Figma #4:1005 (bg: #121258) */}
                <div className="flex items-center justify-between p-3.5 bg-[#121258] rounded-md shadow-sm">
                  <span className="font-bold text-base text-white">
                    EARLYBIRD (2,000 LKR)
                  </span>
                  <div className="w-24 bg-white border border-[#E5E7EB] rounded flex items-center justify-between px-2 py-1 shadow-sm">
                    <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                      {quantities.earlybird}
                    </span>
                    <div className="flex flex-col border-l border-gray-200 pl-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity('earlybird', 1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity('earlybird', -1)}
                        className="text-[#121258] hover:bg-gray-100 p-0.5 rounded transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer matching Figma #4:1021 */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <div className="font-sans font-bold text-lg text-[#111827]">
                Total: {totalAmount.toLocaleString()} LKR
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white hover:bg-slate-50 text-[#121258] font-medium text-sm border border-[#121258] rounded-md shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 text-[#121258]" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: Upload Payment Proof Modal (Figma Frame #26:3515)                  */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[672px] bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-100"
          style={{
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Modal Header matching Figma #26:3516 */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#E6E6E6]">
            <h2 className="font-playfair font-bold text-2xl text-[#071A3D]">
              Upload Payment Proof
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body matching Figma #26:3522 */}
          <div className="p-8 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Booking Summary Card matching Figma #26:3523 */}
            <div className="space-y-2">
              <h3 className="font-sans font-semibold text-sm text-[#4B5563]">
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm">
                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    REFERENCE NUMBER
                  </span>
                  <span className="font-bold text-[#071A3D] text-sm">
                    #{referenceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    CUSTOMER NAME
                  </span>
                  <span className="font-bold text-[#071A3D] text-sm">
                    {name || 'Kasun Perera'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    NIC / PASSPORT
                  </span>
                  <span className="font-bold text-[#071A3D] text-sm">
                    {nic || '199203405678'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    CONTACT / EMAIL
                  </span>
                  <span className="font-bold text-[#071A3D] text-xs">
                    {contactNumber || '+94 77 123 4567'} / {email || 'kasun@gmail.com'}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-200/60">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    DATE & TIME
                  </span>
                  <span className="font-bold text-[#071A3D] text-sm">
                    {EVENT_DATA.dateString} | {EVENT_DATA.timeString}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Details breakdown matching Figma #26:3552 */}
            <div className="space-y-2">
              <h3 className="font-sans font-semibold text-sm text-[#4B5563]">
                Ticket Details
              </h3>
              <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                {quantities.vip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">VIP Ticket x {quantities.vip}</span>
                    <span className="font-bold text-[#071A3D]">
                      {(quantities.vip * TICKET_PRICES.vip).toLocaleString()} LKR
                    </span>
                  </div>
                )}
                {quantities.general > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">General Admission x {quantities.general}</span>
                    <span className="font-bold text-[#071A3D]">
                      {(quantities.general * TICKET_PRICES.general).toLocaleString()} LKR
                    </span>
                  </div>
                )}
                {quantities.earlybird > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Earlybird Ticket x {quantities.earlybird}</span>
                    <span className="font-bold text-[#071A3D]">
                      {(quantities.earlybird * TICKET_PRICES.earlybird).toLocaleString()} LKR
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="font-bold text-base text-gray-800">Total Amount:</span>
                  <span className="font-bold text-2xl text-[#071A3D]">
                    {totalAmount.toLocaleString()} LKR
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details matching Figma #26:3569 */}
            <div className="bg-[#071A3D] text-white p-5 rounded-xl space-y-3 shadow-md">
              <h4 className="font-playfair font-bold text-xs uppercase tracking-widest text-[#D4AF37]">
                BANK TRANSFER DETAILS
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-300">Bank:</div>
                <div className="font-medium text-white text-right">Pan Asia Bank</div>
                <div className="text-slate-300">Branch:</div>
                <div className="font-medium text-white text-right">Kundasale</div>
                <div className="text-slate-300">Account Name:</div>
                <div className="font-medium text-white text-right text-xs">
                  Ever Efficient Business Management (Pvt) Ltd.
                </div>
              </div>
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Account Number:</span>
                <span className="font-mono font-bold text-lg text-[#D4AF37] tracking-wider">
                  2058 1000 0062
                </span>
              </div>
            </div>

            {/* WhatsApp Notice matching Figma #26:3594 */}
            <div className="p-4 bg-[#FEF2F2] border-l-4 border-red-500 rounded-r-lg text-xs text-red-700 font-medium">
              Important: Please upload your bank transfer slip or deposit receipt below to confirm your booking. Also send your bank slip to our WhatsApp with your REF-Number.
            </div>

            {/* Slip validation error alert */}
            {slipError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs font-medium animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-red-800">Payment Slip Required</span>
                  <span>{slipError}</span>
                </div>
              </div>
            )}

            {/* Upload Area matching Figma #64:9119 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                slipError
                  ? 'border-red-400 bg-red-50/30 hover:bg-red-50/50 ring-2 ring-red-200'
                  : slipFile
                  ? 'border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40'
                  : 'border-[#071A3D]/40 hover:border-[#071A3D] bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileSelection}
              />
              <div className="flex flex-col items-center gap-2">
                {slipPreviewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={slipPreviewUrl}
                      alt="Bank Slip Preview"
                      className="h-28 max-w-full object-contain rounded-lg border border-gray-200 shadow-sm"
                    />
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{slipFile?.name || 'Slip uploaded successfully'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[11px] text-gray-400">Click to replace file</span>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlipFile(null);
                          setSlipPreviewUrl(null);
                          setSlipError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[11px] text-red-500 hover:text-red-700 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : slipFile ? (
                  <div className="flex flex-col items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span>{slipFile.name}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[11px] text-gray-400 font-normal">Click to replace file</span>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlipFile(null);
                          setSlipPreviewUrl(null);
                          setSlipError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[11px] text-red-500 hover:text-red-700 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#071A3D]/10 flex items-center justify-center text-[#071A3D]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base text-[#071A3D]">
                        Upload Bank Slip
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold uppercase tracking-wider">
                        Required *
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Click to browse or drag and drop slip file here (PDF, JPG, PNG)
                    </span>
                    <span className="text-[11px] text-amber-600 font-medium">
                      ⚠️ Booking cannot be confirmed without a valid payment slip
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer matching Figma #26:3603 */}
          <div className="p-6 bg-[#F9FAFB] border-t border-[#E5E7EB] space-y-3">
            <p className="text-xs italic text-gray-500">
              By clicking 'Confirm Booking', you agree that your reservation is subject to verification of the payment slip.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                {!slipFile ? (
                  <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Slip upload required to confirm booking
                  </span>
                ) : (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Payment slip attached
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSlipError(null);
                    setStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-gray-100 text-[#071A3D] text-sm font-semibold rounded-lg border border-[#071A3D] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={!slipFile || !!slipError}
                  title={!slipFile ? 'Please upload your payment slip before confirming' : 'Confirm your booking'}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#071A3D] hover:bg-[#071A3D]/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#071A3D] text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: Booking Confirmed Screen (Figma Frame #16:2825 / #26:3454)        */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[672px] bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-100 animate-fadeIn"
          style={{
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Decorative Top Gradient Border matching Figma #26:3455 */}
          <div
            className="h-2 w-full"
            style={{
              background: 'linear-gradient(90deg, #B8962E 0%, #D4AF37 50%, #B8962E 100%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 space-y-6 text-center">
            {/* Trophy / Party Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-600 shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="font-playfair font-bold text-3xl text-[#071A3D]">
                 Booking Confirmed!
              </h2>
              <p className="font-hanken text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Your reservation has been successfully submitted and forwarded to the admin verification queue.
              </p>
            </div>

            {/* Ticket Card matching Figma #26:3454 */}
            <div className="text-left p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                    CUSTOMER NAME
                  </span>
                  <span className="font-bold text-base text-[#071A3D]">
                    {confirmedBooking?.customerName || name || 'Kasun Perera'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                    PAYMENT STATUS
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Event:</span>
                  <span className="font-bold text-gray-800 text-sm">නුවර ආලේ</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Reference:</span>
                  <span className="font-mono font-bold text-[#071A3D] text-sm">#{referenceNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Date & Time:</span>
                  <span className="font-medium text-gray-800">{EVENT_DATA.dateString} | {EVENT_DATA.timeString}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Venue:</span>
                  <span className="font-medium text-gray-800">Sahas Uyana - Kandy</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">
                  Tickets: {totalTickets} Ticket(s)
                </span>
                <span className="font-bold text-lg text-[#071A3D]">
                  {totalAmount.toLocaleString()} LKR
                </span>
              </div>
            </div>

            {/* Action Buttons matching Figma #26:3438 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadTicket}
                disabled={isGeneratingPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#071A3D] hover:bg-[#071A3D]/90 disabled:opacity-75 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                )}
                <span>{isGeneratingPdf ? 'Generating PDF Ticket...' : 'Download PDF Ticket'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(
                    `Hello Nuwara Ale Operations Team,\nI have submitted my payment slip for booking #${referenceNumber}.\nCustomer: ${name}\nNIC: ${nic}\nTotal: Rs. ${totalAmount.toLocaleString()} LKR\nPlease verify my reservation.`
                  );
                  window.open(`https://wa.me/94774152525?text=${msg}`, '_blank');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                Close & Return to Event Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
