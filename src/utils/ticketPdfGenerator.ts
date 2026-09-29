import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { EEBM_LOGO_BASE64 } from './eebmLogoBase64';
import { EVENT_DATA } from '../data/eventData';

export interface TicketPdfData {
  refNumber: string;
  customerName: string;
  nic?: string;
  contactNumber: string;
  email: string;
  date?: string;
  time?: string;
  status?: string;
  ticketType?: string;
  ticketBreakdown?: {
    vip: number;
    general: number;
    earlybird: number;
  };
  ticketQty: number;
  totalPrice: number;
}

type TicketCategory = 'vip' | 'general' | 'earlybird';

/* ------------------------------------------------------------------ */
/* Event constants (edit here, not inside the template)                */
/* ------------------------------------------------------------------ */

const EVENT_ID = 'NUWARA-ALE-CH01';
const EVENT_YEAR = 2026;
const DOORS_OPEN = '5:30 PM';
const SHOW_START = '7:00 PM';
const SUPPORT_LINES = ['077 415 2525', '076 045 0456', '071 033 2102'];

const CATEGORIES: Record<TicketCategory, { label: string; price: number; zone: string }> = {
  vip: { label: 'VIP', price: 5000, zone: 'Front row area' },
  general: { label: 'General', price: 3000, zone: 'Standard concert area' },
  earlybird: { label: 'Early Bird', price: 2000, zone: 'Standard concert area' },
};

// Ticket artwork is 960 px wide and at least 456 px tall (it grows if text wraps).
// It is placed on a page exactly 210 mm wide, so it prints at 100% on A4 without scaling.
const TICKET_W = 960;
const TICKET_H = 456;
const PAGE_W_MM = 210;

const QR_TILE = 154; // px, white tile behind the QR code
const QR_PAD = 8; // px, quiet border between tile edge and QR
const MAIN_W = 670; // px, left (event) section; the rest is the tear-off stub

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const money = (n: number) => `Rs. ${n.toLocaleString('en-US')}`;

/** One entry per admission, so every person gets their own ticket and QR code. */
function expandTickets(data: TicketPdfData): TicketCategory[] {
  const count = (n?: number) => Math.max(0, Math.floor(n || 0));
  const b = {
    vip: count(data.ticketBreakdown?.vip),
    general: count(data.ticketBreakdown?.general),
    earlybird: count(data.ticketBreakdown?.earlybird),
  };

  // No explicit breakdown recorded: infer from ticketType / ticketQty
  if (b.vip + b.general + b.earlybird === 0) {
    const type = (data.ticketType || '').toLowerCase();
    const qty = Math.max(1, count(data.ticketQty));
    if (type.includes('vip')) b.vip = qty;
    else if (type.includes('earlybird') || type.includes('early bird')) b.earlybird = qty;
    else b.general = qty;
  }

  return [
    ...Array<TicketCategory>(b.vip).fill('vip'),
    ...Array<TicketCategory>(b.general).fill('general'),
    ...Array<TicketCategory>(b.earlybird).fill('earlybird'),
  ];
}

async function waitForAssets(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/* ------------------------------------------------------------------ */
/* Ticket template                                                     */
/* ------------------------------------------------------------------ */

interface TicketRenderInput {
  data: TicketPdfData;
  category: TicketCategory;
  number: number;
  total: number;
  bookedAt: string;
}

const FONT_STACK = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";

function infoCell(label: string, value: string, extra = ''): string {
  return `
    <td style="vertical-align: top; padding: 0 0 12px 0; ${extra}">
      <div style="font-size: 11px; color: #94A3B8; font-weight: 600; margin-bottom: 2px;">${label}</div>
      <div style="font-size: 15px; color: #ffffff; font-weight: 700; line-height: 1.25;">${value}</div>
    </td>`;
}

function renderTicketHtml(t: TicketRenderInput): string {
  const cat = CATEGORIES[t.category];
  const ticketNo = `${String(t.number).padStart(2, '0')} / ${String(t.total).padStart(2, '0')}`;
  const holder = escapeHtml(t.data.customerName || 'Valued Guest');
  const nic = escapeHtml(t.data.nic || '-');
  const ref = escapeHtml(t.data.refNumber);

  return `
  <div id="ticket-root" style="width: ${TICKET_W}px; min-height: ${TICKET_H}px; background: #050B18; padding: 14px; box-sizing: border-box; font-family: ${FONT_STACK};">
    <div style="position: relative; display: flex; align-items: stretch; width: 100%; min-height: ${TICKET_H - 28}px; border-radius: 22px; overflow: hidden; background: #061225; box-shadow: 0 14px 40px rgba(0,0,0,.35);">

      <!-- ============ TYPE 01: MODERN CONCERT MAIN SECTION ============ -->
      <div style="position: relative; width: ${MAIN_W}px; flex: none; box-sizing: border-box; padding: 28px 32px 18px 32px; background:
        radial-gradient(circle at 78% 28%, rgba(79,70,229,.38) 0%, rgba(79,70,229,0) 32%),
        radial-gradient(circle at 58% 10%, rgba(14,165,233,.28) 0%, rgba(14,165,233,0) 30%),
        linear-gradient(135deg, #020817 0%, #071A3D 48%, #0B1D45 100%);
        color: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">

        <!-- Ambient concert light beams -->
        <div style="position:absolute; top:-80px; right:70px; width:150px; height:300px; background:linear-gradient(180deg, rgba(59,130,246,.28), rgba(59,130,246,0)); transform:rotate(24deg); filter:blur(8px); pointer-events:none;"></div>
        <div style="position:absolute; top:-100px; right:210px; width:110px; height:320px; background:linear-gradient(180deg, rgba(168,85,247,.24), rgba(168,85,247,0)); transform:rotate(-18deg); filter:blur(10px); pointer-events:none;"></div>
        <div style="position:absolute; bottom:-90px; left:260px; width:220px; height:180px; background:radial-gradient(circle, rgba(37,99,235,.22), transparent 68%); filter:blur(12px); pointer-events:none;"></div>

        <!-- Gold accent -->
        <div style="position:absolute; top:0; left:0; right:0; height:5px; background:linear-gradient(90deg,#D4AF37 0%,#F5D76E 48%,#8B6B16 100%);"></div>

        <!-- Organizer -->
        <div style="position:relative; z-index:2; display:flex; align-items:center;">
          <div style="background:#ffffff; padding:6px 10px; border-radius:9px; margin-right:12px; box-shadow:0 4px 14px rgba(0,0,0,.18);">
            <img src="${EEBM_LOGO_BASE64}" alt="Ever Efficient" style="height:30px; max-width:150px; display:block; object-fit:contain;" />
          </div>
          <div style="font-size:11px; color:#A9B7D0; line-height:1.3; letter-spacing:.1px;">
            Presented by<br/>Ever Efficient Business Management (Pvt) Ltd
          </div>
        </div>

        <!-- Event title -->
        <div style="position:relative; z-index:2; margin:12px 0 8px 0;">
          <div style="font-size:40px; font-weight:900; color:#FFFFFF; line-height:1.05; letter-spacing:-1.2px; text-transform:uppercase; word-break:break-word; text-shadow:0 4px 20px rgba(0,0,0,.3);">
            ${EVENT_DATA.titleEnglish}
          </div>
          <div style="font-size:16px; font-weight:700; color:#60A5FA; margin-top:7px; letter-spacing:3px; text-transform:uppercase;">
            Live Music Concert
          </div>
        </div>

        <!-- Event details -->
        <table style="position:relative; z-index:2; width:100%; border-collapse:collapse; table-layout:fixed; margin-top:4px;">
          <tr>
            ${infoCell('Date', `${EVENT_DATA.dateString}, ${EVENT_YEAR}`)}
            ${infoCell('Doors open', DOORS_OPEN)}
            ${infoCell('Show starts', SHOW_START)}
          </tr>
          <tr>
            <td colspan="2" style="vertical-align:top; padding:2px 0 0 0;">
              <div style="font-size:11px; color:#8FA3C2; font-weight:600; margin-bottom:3px;">Venue</div>
              <div style="font-size:15px; color:#ffffff; font-weight:700; line-height:1.25;">
                ${EVENT_DATA.venue}, ${EVENT_DATA.venueLocation}
              </div>
            </td>
            <td style="vertical-align:top; padding:2px 0 0 0;">
              <div style="font-size:11px; color:#8FA3C2; font-weight:600; margin-bottom:3px;">Ticket holder</div>
              <div style="font-size:15px; color:#ffffff; font-weight:700; line-height:1.25; word-break:break-word;">${holder}</div>
              <div style="font-size:11px; color:#B8C5DA; margin-top:2px; word-break:break-word;">ID: ${nic}</div>
            </td>
          </tr>
        </table>

        <!-- Terms -->
        <div style="position:relative; z-index:2; margin-top:10px; border-top:1px solid rgba(148,163,184,.24); padding-top:7px; font-size:9.5px; color:#8798B3; line-height:1.4;">
          Admits one person. Bring this ticket and the original NIC, driving licence or passport you booked with.
          Tickets are non-refundable and non-transferable. Outside alcohol, glass bottles, laser pointers and hazardous items are not allowed.
          <div style="margin-top:3px; color:#B8C5DA;">
            Contact Us: ${SUPPORT_LINES.map((n) => `<span style="margin-right:12px;">${n}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Perforation -->
      <div style="position:absolute; top:18px; bottom:18px; left:${MAIN_W - 1}px; width:0; border-left:2px dashed rgba(148,163,184,.48);"></div>
      <div style="position:absolute; top:-14px; left:${MAIN_W - 14}px; width:28px; height:28px; border-radius:50%; background:#050B18;"></div>
      <div style="position:absolute; bottom:-14px; left:${MAIN_W - 14}px; width:28px; height:28px; border-radius:50%; background:#050B18;"></div>

      <!-- ============ TYPE 01 STUB ============ -->
      <div style="position:relative; flex:1; box-sizing:border-box; padding:24px 18px 20px 18px; background:
        radial-gradient(circle at 50% 0%, rgba(99,102,241,.72), rgba(99,102,241,0) 42%),
        linear-gradient(160deg,#172554 0%,#312E81 52%,#4C1D95 100%);
        color:#ffffff; text-align:center;">

        <div style="font-size:11px; font-weight:700; line-height:16px; letter-spacing:1.5px; text-transform:uppercase; color:#D6E4FF;">Admit one</div>
        <div style="font-size:25px; font-weight:900; line-height:30px; margin-top:5px; text-transform:uppercase; letter-spacing:.4px;">${cat.label}</div>
        <div style="font-size:11px; font-weight:600; line-height:16px; margin-top:5px; color:#C7D2FE;">${cat.zone}</div>
        <div style="font-size:18px; font-weight:900; line-height:22px; margin-top:9px;">${money(cat.price)}</div>

        <!-- QR -->
        <div id="qr-slot" style="width:${QR_TILE}px; height:${QR_TILE}px; margin:20px auto 0 auto; background:#ffffff; border-radius:13px; box-shadow:0 8px 22px rgba(0,0,0,.22);"></div>

        <div style="font-size:13px; font-weight:800; line-height:18px; margin-top:17px;">Ticket ${ticketNo}</div>
        <div style="font-family:'Courier New',monospace; font-size:12px; font-weight:700; line-height:16px; margin-top:3px; color:#E0E7FF;">#${ref}</div>
        <div style="font-size:9.5px; font-weight:600; line-height:14px; margin-top:7px; color:#C7D2FE;">Booked ${escapeHtml(t.bookedAt)}</div>
      </div>

    </div>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Generates and downloads a PDF containing one concert ticket per admission.
 * Each ticket is its own page (210 mm wide, prints at 100% on A4) with a unique QR code
 * and a tear-off stub.
 */
export async function downloadTicketPdf(data: TicketPdfData): Promise<void> {
  const tickets = expandTickets(data);
  const total = tickets.length;

  const now = new Date();
  const bookedAt = `${
    data.date || now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  } ${data.time || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  let pdf: jsPDF | null = null; // created on the first page, once its real height is known

  // Off-screen render target for html2canvas
  const container = document.createElement('div');
  container.id = 'pdf-ticket-render-container';
  container.style.position = 'absolute';
  container.style.top = '0px';
  container.style.left = '0px';
  container.style.width = `${TICKET_W}px`;
  container.style.backgroundColor = '#ffffff';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-99999';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  try {
    for (let i = 0; i < total; i++) {
      const category = tickets[i];

      // Keep the QR payload small: the gate scanner should look the booking up by ref + ticket number.
      const qrDataUrl = await QRCode.toDataURL(
        JSON.stringify({
          event: EVENT_ID,
          ref: data.refNumber,
          ticket: `${i + 1}/${total}`,
          type: category,
          name: data.customerName,
        }),
        {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 480,
          color: { dark: '#071A3D', light: '#FFFFFF' },
        }
      );

      container.innerHTML = renderTicketHtml({
        data,
        category,
        number: i + 1,
        total,
        bookedAt,
      });

      await waitForAssets(container);

      // The ticket grows if any text wraps, so measure it instead of assuming a fixed height
      const root = container.querySelector<HTMLElement>('#ticket-root');
      const renderHeight = Math.max(TICKET_H, root?.scrollHeight ?? 0, root?.offsetHeight ?? 0);
      const pageHeightMm = (PAGE_W_MM * renderHeight) / TICKET_W;

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: TICKET_W,
        height: renderHeight,
        windowWidth: TICKET_W,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      if (!pdf) {
        pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [PAGE_W_MM, pageHeightMm] });
      } else {
        pdf.addPage([PAGE_W_MM, pageHeightMm], 'landscape');
      }
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, PAGE_W_MM, pageHeightMm, undefined, 'FAST');

      // Place the QR code exactly over the white tile (position measured from the real layout)
      const slot = container.querySelector<HTMLElement>('#qr-slot');
      if (root && slot) {
        const rootBox = root.getBoundingClientRect();
        const slotBox = slot.getBoundingClientRect();
        const mmPerPx = PAGE_W_MM / TICKET_W;
        const qrX = (slotBox.left - rootBox.left + QR_PAD) * mmPerPx;
        const qrY = (slotBox.top - rootBox.top + QR_PAD) * mmPerPx;
        const qrSize = (QR_TILE - QR_PAD * 2) * mmPerPx;
        pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      }
    }

    pdf?.save(`Nuwara-Ale-Ticket-${data.refNumber || 'Booking'}.pdf`);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}