export interface BookingRecord {
  id: string;
  refNumber: string;
  secretCode?: string;
  customerName: string;
  nic?: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Pending verification' | 'Paid' | 'Rejected';
  ticketType: 'VIP Tickets' | 'General Tickets' | 'Earlybird Tickets' | string;
  ticketBreakdown?: {
    vip: number;
    general: number;
    earlybird: number;
  };
  ticketQty: number;
  contactNumber: string;
  email: string;
  totalPrice: number;
  slipUrl?: string;
  slipName?: string;
  adminNotes?: string;
  createdAt?: string;
}

export interface IncludedService {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

export const ADMIN_STATS = {
  totalRevenue: 4250000,
  totalTickets: 1240,
  totalCustomers: 890,
  confirmedBookings: 1240,
  pendingBookings: 45,
};

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: '1',
    refNumber: 'REF-001',
    secretCode: 'NA-SEC-729410',
    customerName: 'Kasun Perera',
    date: 'Oct 24, 2024',
    time: '07:30 PM',
    status: 'Confirmed',
    ticketType: 'VIP Tickets',
    ticketQty: 2,
    contactNumber: '0771234567',
    email: 'kasun.p@gmail.com',
    totalPrice: 10000,
  },
  {
    id: '2',
    refNumber: 'REF-002',
    secretCode: 'NA-SEC-814925',
    customerName: 'Nimali Silva',
    date: 'Oct 25, 2024',
    time: '07:30 PM',
    status: 'Pending',
    ticketType: 'VIP Tickets',
    ticketQty: 2,
    contactNumber: '0772345678',
    email: 'nimali@gmail.com',
    totalPrice: 12000,
  },
  {
    id: '3',
    refNumber: 'REF-003',
    secretCode: 'NA-SEC-639512',
    customerName: 'Devon Fernando',
    date: 'Oct 28, 2024',
    time: '07:30 PM',
    status: 'Confirmed',
    ticketType: 'General Tickets',
    ticketQty: 2,
    contactNumber: '0773456789',
    email: 'devon.f@gmail.com',
    totalPrice: 6000,
  },
  {
    id: '4',
    refNumber: 'REF-004',
    secretCode: 'NA-SEC-492108',
    customerName: 'Saman Jayakody',
    date: 'Nov 02, 2024',
    time: '07:30 PM',
    status: 'Pending verification',
    ticketType: 'VIP Tickets',
    ticketQty: 1,
    contactNumber: '0774567890',
    email: 'saman.j@gmail.com',
    totalPrice: 5000,
  },
  {
    id: '5',
    refNumber: 'REF-005',
    secretCode: 'NA-SEC-385019',
    customerName: 'Amali Perera',
    date: 'Nov 05, 2024',
    time: '07:30 PM',
    status: 'Pending',
    ticketType: 'Earlybird Tickets',
    ticketQty: 2,
    contactNumber: '0775678901',
    email: 'amali@gmail.com',
    totalPrice: 4000,
  },
  {
    id: '6',
    refNumber: 'REF-006',
    secretCode: 'NA-SEC-951240',
    customerName: 'Kavinda Selvan',
    date: 'Nov 08, 2024',
    time: '08:15 PM',
    status: 'Paid',
    ticketType: 'VIP Tickets',
    ticketQty: 1,
    contactNumber: '0776789012',
    email: 'kavinda.s@gmail.com',
    totalPrice: 5000,
  },
  {
    id: '7',
    refNumber: 'REF-007',
    secretCode: 'NA-SEC-120934',
    customerName: 'Dinesh Wickramasinghe',
    date: 'Nov 10, 2024',
    time: '06:45 PM',
    status: 'Rejected',
    ticketType: 'General Tickets',
    ticketQty: 3,
    contactNumber: '0777890123',
    email: 'dinesh.w@gmail.com',
    totalPrice: 9000,
    adminNotes: 'Invalid payment slip attached.',
  },
];

export const INITIAL_SERVICES: IncludedService[] = [
  {
    id: 'srv-1',
    title: 'Main Stage Access',
    description: 'Entry to the primary performance area.',
    active: true,
  },
  {
    id: 'srv-2',
    title: 'Standard Seating',
    description: 'First-come, first-served seating in general areas.',
    active: true,
  },
  {
    id: 'srv-3',
    title: 'Basic Support',
    description: 'Access to on-site help desk.',
    active: true,
  },
  {
    id: 'srv-4',
    title: 'VIP Lounge Access',
    description: 'Exclusive entry to the VIP lounge area.',
    active: true,
  },
  {
    id: 'srv-5',
    title: 'Premium Catering',
    description: 'Complimentary food and beverages.',
    active: true,
  },
];
