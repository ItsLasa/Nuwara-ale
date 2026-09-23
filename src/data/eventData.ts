export interface Artist {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface TicketPackage {
  id: 'vip' | 'general' | 'earlybird';
  name: string;
  price: number;
  currency: string;
  badge: string;
  description: string;
  features: string[];
}

export interface HotlineContact {
  name: string;
  phone: string;
  displayPhone: string;
}



export const EVENT_DATA = {
  titleSinhala: 'නුවර ආලේ',
  titleEnglish: 'A Night of Musical Brilliance',
  chapter: 'Chapter 01',
  dateString: 'August 30',
  timeString: 'From 7:00 PM onwards',
  dateShort: 'Aug 30',
  timeDetail: 'Saturday, 7:00 PM Onwards',
  venue: 'Sahas Uyana',
  venueLocation: 'Kandy, Sri Lanka',
  venueFull: 'Sahas Uyana - Kandy',
  organizer: 'EVER EFFICIENT Business Management (Pvt) Ltd',
  heroBannerImage: '/images/hero_banner.png',
  eventPosterImage: '/images/event_poster.png',
  countdownTarget: '2027-08-30T19:00:00',
  aboutText:
    'Experience an unforgettable evening of rhythm, soul, and spectacular performances at "nuwra ale". This premium musical concert brings together the finest artists for a night that celebrates the essence of Sri Lankan musical talent.',
  highlights: [
    {
      title: 'Live Band Performance',
      description: 'Backed by a full orchestra',
    },
    {
      title: 'Premium F&B',
      description: 'Exclusive catering options',
    },
  ],
  hotlines: [
    { name: 'Shamila', phone: '0774152525', displayPhone: '077 4152525' },
    { name: 'Sanduni', phone: '0760450456', displayPhone: '076 0450456' },
    { name: 'Dilrukshi', phone: '0710332102', displayPhone: '071 0332102' },
  ] as HotlineContact[],
  artists: [
    {
      id: 'centigrade',
      name: 'Centigrade',
      role: 'Musical Band',
      image: '/images/artist_centigrade.png',
    },
    {
      id: 'ravi-r',
      name: 'Ravi R',
      role: 'Vocalist',
      image: '/images/artist_ravi.png',
    },
    {
      id: 'raveen',
      name: 'Raveen',
      role: 'Vocalist',
      image: '/images/artist_raveen.png',
    },
    {
      id: 'lasitha',
      name: 'Lasitha',
      role: 'Vocalist',
      image: '/images/artist_lasitha.png',
    },
    {
      id: 'thiwanka',
      name: 'Thiwanka',
      role: 'Musician',
      image: '/images/artist_thiwanka.png',
    },
    {
      id: 'adithya',
      name: 'Adithya',
      role: 'Vocalist',
      image: '/images/artist_adithya.png',
    },
  ] as Artist[],
  packages: [
    {
      id: 'vip',
      name: 'VIP Tickets',
      price: 5000,
      currency: 'LKR',
      badge: 'Available',
      description: 'Best view, dedicated entrance, lounge access.',
      features: ['Main Stage Access', 'VIP Lounge Access', 'Dedicated Entrance', 'Premium Catering'],
    },
    {
      id: 'general',
      name: 'General Tickets',
      price: 3000,
      currency: 'LKR',
      badge: 'Available',
      description: 'Standing area, access to main food court.',
      features: ['Main Stage Access', 'Standard Seating', 'Food Court Access'],
    },
    {
      id: 'earlybird',
      name: 'Earilybird Tickets',
      price: 2000,
      currency: 'LKR',
      badge: 'Available',
      description: 'Limited time offer for early bookings.',
      features: ['Main Stage Access', 'Early Entry Pass', 'Standard Seating'],
    },
  ] as TicketPackage[],
};
