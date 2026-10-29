/**
 * Velenburg Retreat Murree — Master Configuration
 * Official details for @velenburg (Gharial Camp / Upper Topa, Murree)
 */

export const RETREAT_CONFIG = {
  brandName: 'Velenburg Retreat',
  shortBrandName: 'Velenburg',
  heroBioTagline: 'Luxury Mountain Retreat — Vintage charm. Modern comfort.',
  tagline: 'Vintage charm. Modern comfort.',
  locationBadge: 'Gharial, Murree',
  subTagline: '4 Luxury Suites in the peaceful pine forests of Gharial, Murree with panoramic valley views',
  location: {
    area: 'Gharial Camp / Upper Topa',
    city: 'Murree',
    country: 'Pakistan',
    displayAddress: 'Gharial Camp, Upper Topa, Murree Hills, Pakistan',
    mapCoordinates: { lat: 33.9167, lng: 73.4167 },
  },
  timings: {
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
  },
  pricing: {
    fixedRatePkr: 18000,
    currencySymbol: 'PKR',
    currencyDisplay: 'PKR 18,000 / Night',
  },
  inventory: {
    totalSuites: 4,
    category: 'Luxury Mountain Suite',
  },
  // Official Phone & WhatsApp Details (Verified)
  contact: {
    ownerWhatsApp: '923155167829', // wa.me/923155167829
    displayPhone: '+92 315 5167829',
    localPhone: '0315-5167829',
    rawPhone: '+923155167829',
    email: 'info@velenburgretreat.com',
    instagramHandle: '@velenburg',
    instagramUrl: 'https://www.instagram.com/velenburg',
    googleMapsUrl: 'https://maps.app.goo.gl/SBygZSwzRjwLEFgT8',
  },
  // Verified Google Maps & Guest Reviews Metadata
  googleReviews: {
    rating: 4.9,
    ratingMax: 5.0,
    totalReviews: 27,
    mapsUrl: 'https://maps.app.goo.gl/SBygZSwzRjwLEFgT8',
    category: 'Guest house',
    placeName: 'Velenburg Retreat',
    address: 'Gharial Camp, 47150, Murree, Pakistan',
    plusCode: 'WCFW+CP Gharial Camp, Pakistan',
    airbnbRating: 5.0,
    airbnbStatus: 'Guest Favorite',
  },
  // Official Instagram Highlights mirrored on website
  instagramHighlights: [
    {
      title: 'Accommodation',
      tag: '4 Luxury Suites',
      description: 'Spacious mountain suites featuring tufted king beds, private wooden-ceiling sunrooms, electric kettles, and Velenburg branded toiletries.',
      image: '/images/room-2/photo-1.jpg',
    },
    {
      title: 'Views',
      tag: '100% Pine Valley',
      description: 'Open stone terrace and wooden-ceiling lounge overlooking the clouds and pine valleys of Gharial Camp.',
      image: '/images/terrace-lounge/photo-3.jpg',
    },
    {
      title: 'Reviews',
      tag: 'Guest Experiences',
      description: 'Quiet mountain stays cherished by families and couples seeking peace, comfort, and scenic views in Murree.',
      image: '/images/terrace-lounge/photo-1.jpg',
    },
  ],
  // Rate and Policy aliases for components
  rates: {
    roomRatePKR: 18000,
    formatted: 'PKR 18,000 / Night',
  },
  policies: {
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    quietHours: '10:00 PM – 8:00 AM',
    noDinnerService: true,
  },
  // Food & Refreshment Policy (STRICT — Tab 1.1)
  amenitiesPolicy: {
    hasCookedMeals: false,
    hasDinnerService: false,
    hasArrivalRefreshments: false,
    includedPerks: [
      'Self-Service Electric Kettle in every suite',
      'Complimentary Tapal Green Tea Sachets',
      'Full Velenburg Luxury Branded Toiletries Kit (Dental, Vanity, Comb, Soap, Shampoo, Lotion)',
      'Wall-Mounted Smart LED TV with Netflix Remote',
      'Private Sunroom / Sitting Area & Dressing Mirror',
      'Access to Wooden-Ceiling Mountain View Lounge & Open Terrace',
      'Free High-Speed Wi-Fi & Dedicated On-Site Parking',
    ],
  },
  // Live Murree Weather details
  weather: {
    temperatureC: 15,
    condition: 'Crisp Mountain Breeze',
    elevation: '7,200 ft / 2,200m',
  },
};

export const formatPKR = (amount: number): string => {
  return `PKR ${amount.toLocaleString()}`;
};

