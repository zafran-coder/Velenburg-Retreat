/**
 * Velenburg Retreat Murree — Room Inventory & Verified Photo Mapping
 * 4 Luxury Suites at PKR 18,000 / Night.
 * Shared Kettle Tray & Mirror images are included in ALL 4 rooms.
 * Includes official @velenburg Instagram taglines.
 */

export type RoomPhoto = {
  url: string;
  caption: string;
  isShared?: boolean;
};

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  desc?: string;
  x: number; // percentage from left
  y: number; // percentage from top
  tag?: string;
}

export interface RoomSuite {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  officialTagline: string; // From @velenburg official profile
  pricePerNightPkr: number;
  pricePKR: number; // alias
  capacity: string;
  occupancy: string;
  bedType: string;
  bed: string;
  size: string;
  view: string;
  description: string;
  highlights: string[];
  images: string[];
  photos: RoomPhoto[];
  amenities: string[];
  hotspots: Hotspot[];
}

export type RoomData = RoomSuite;

export const SHARED_ROOM_IMAGES = [
  '/images/shared/kettle-toiletries-tray.jpg', // Mandatory in EVERY room
  '/images/shared/mirror-sitting-area.jpg',    // Mandatory in EVERY room
];

export const COMMON_LUXURY_AMENITIES = [
  'Luxury Tufted King-Size Bed',
  'Electric Kettle & Complimentary Tapal Green Tea Sachets',
  'Velenburg Branded Toiletries (Dental Kit, Vanity Kit, Comb, Soap, Shampoo, Lotion)',
  'Wall-Mounted Smart LED TV with Netflix Remote',
  'Private Sunroom / Sitting Area & Full-Length Dressing Mirror',
  'Access to Wooden-Ceiling Mountain View Lounge & Open Terrace',
  'Free High-Speed Wi-Fi & Dedicated On-Site Parking',
];

export const ROOMS_DATA: RoomSuite[] = [
  {
    id: 1,
    slug: 'room-1',
    name: 'Room 1 — Luxury Suite 01',
    shortName: 'Suite 01',
    category: 'Luxury Mountain Suite',
    officialTagline: 'The Address of Peace',
    pricePerNightPkr: 18000,
    pricePKR: 18000,
    capacity: '2 Adults (+1 Child)',
    occupancy: '2 Adults (+1 Child)',
    bedType: 'Tufted King Bed',
    bed: 'Tufted King Bed',
    size: '420 sq ft',
    view: 'Pine Forest & Valley View',
    description:
      'An elegant luxury suite featuring classic white wall molding, dark tufted king bed, geometric cage pendant lighting, and a full in-room tea & Velenburg toiletries station.',
    highlights: [
      'Dark tufted king headboard with luxury Egyptian-cotton style linens',
      'Geometric cage pendant ambient lighting',
      'Framed Running Horses & Paris Street artwork',
      'In-room electric kettle & Tapal Green Tea station',
      'Exclusive Velenburg black-and-gold luxury toiletries tray',
      'Access to shared wooden-ceiling mountain lounge & open terrace',
    ],
    images: [
      '/images/room-1/photo-1.jpg',
      '/images/room-1/photo-2.jpg',
      '/images/room-1/photo-3.jpg',
      '/images/room-1/photo-4.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    photos: [
      { url: '/images/room-1/photo-1.jpg', caption: 'Classic White Wall Molding & Tufted King Bed', isShared: false },
      { url: '/images/room-1/photo-2.jpg', caption: 'Parisian & Running Horses Framed Art Gallery', isShared: false },
      { url: '/images/room-1/photo-3.jpg', caption: 'Geometric Cage Pendant Filament Bedside Lighting', isShared: false },
      { url: '/images/room-1/photo-4.jpg', caption: 'King Headboard & Crisp Mountain Bedding Linens', isShared: false },
      { url: '/images/shared/kettle-toiletries-tray.jpg', caption: 'In-Suite Electric Kettle, Tapal Green Tea & Velenburg Toiletries Tray', isShared: true },
      { url: '/images/shared/mirror-sitting-area.jpg', caption: 'In-Room Full-Length Dressing Mirror & Sunroom Lounge', isShared: true },
    ],
    amenities: COMMON_LUXURY_AMENITIES,
    hotspots: [
      {
        id: 'r1-bed',
        title: 'Tufted King Headboard',
        description: 'Deep button-tufted leatherette headboard with crisp white linens',
        desc: 'Deep button-tufted leatherette headboard with crisp white linens',
        x: 50,
        y: 65,
        tag: 'Bedding',
      },
      {
        id: 'r1-lights',
        title: 'Geometric Cage Pendants',
        description: 'Warm ambient filament lighting suspended over bedside tables',
        desc: 'Warm ambient filament lighting suspended over bedside tables',
        x: 18,
        y: 28,
        tag: 'Lighting',
      },
      {
        id: 'r1-art',
        title: 'Running Horses Artwork',
        description: 'Custom framed statement art set against recessed molding',
        desc: 'Custom framed statement art set against recessed molding',
        x: 50,
        y: 35,
        tag: 'Decor',
      },
      {
        id: 'r1-tray',
        title: 'Kettle & Toiletries Tray',
        description: 'Electric kettle, Tapal Green Tea sachets & Velenburg toiletries kit',
        desc: 'Electric kettle, Tapal Green Tea sachets & Velenburg toiletries kit',
        x: 82,
        y: 78,
        tag: 'Amenity',
      },
    ],
  },
  {
    id: 2,
    slug: 'room-2',
    name: 'Room 2 — Luxury Suite 02',
    shortName: 'Suite 02',
    category: 'Luxury Mountain Suite',
    officialTagline: 'Vintage Charm. Modern Comfort.',
    pricePerNightPkr: 18000,
    pricePKR: 18000,
    capacity: '2 Adults (+1 Child)',
    occupancy: '2 Adults (+1 Child)',
    bedType: 'Tufted King Bed',
    bed: 'Tufted King Bed',
    size: '480 sq ft',
    view: 'Private Sunroom & Valley View',
    description:
      'Crafted with a warm vertical wood-panel feature wall, tufted king bed, and a private wooden-ceiling sunroom lounge with a 3-seater cream sofa, electric kettle, and luxury toiletries.',
    highlights: [
      'Warm vertical natural wood-panel feature wall',
      'Private wooden-ceiling sunroom lounge with 3-seater cream sofa',
      'Exposed red-brick niche feature with warm accent sconce',
      'Wall-mounted Smart LED TV with wood backing panel',
      'Self-service electric kettle with Tapal Green Tea sachets',
      'Full Velenburg black-and-gold toiletries kit & dressing mirror',
    ],
    images: [
      '/images/room-2/photo-1.jpg',
      '/images/room-2/photo-2.jpg',
      '/images/room-2/photo-3.jpg',
      '/images/room-2/photo-4.jpg',
      '/images/room-2/photo-5.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    photos: [
      { url: '/images/room-2/photo-1.jpg', caption: 'Vertical Natural Wood Feature Wall & Tufted King Bed', isShared: false },
      { url: '/images/room-2/photo-2.jpg', caption: 'Sunroom Lounge with 3-Seater Cream Sofa & Brick Accent', isShared: false },
      { url: '/images/room-2/photo-3.jpg', caption: 'Exposed Red-Brick Feature Niche & Ambient Sconce', isShared: false },
      { url: '/images/room-2/photo-4.jpg', caption: 'Wall-Mounted Smart LED TV with Wood Backing Panel', isShared: false },
      { url: '/images/room-2/photo-5.jpg', caption: 'Polished Pine Timber Ceiling & Sunlit Sunroom Lounge', isShared: false },
      { url: '/images/shared/kettle-toiletries-tray.jpg', caption: 'In-Suite Electric Kettle, Tapal Green Tea & Velenburg Toiletries Tray', isShared: true },
      { url: '/images/shared/mirror-sitting-area.jpg', caption: 'In-Room Full-Length Dressing Mirror & Sunroom Lounge', isShared: true },
    ],
    amenities: COMMON_LUXURY_AMENITIES,
    hotspots: [
      {
        id: 'r2-wood',
        title: 'Vertical Wood Feature Wall',
        description: 'Natural mountain timber fluted paneling creating an intimate warmth',
        desc: 'Natural mountain timber fluted paneling creating an intimate warmth',
        x: 25,
        y: 40,
        tag: 'Craftsmanship',
      },
      {
        id: 'r2-bed',
        title: 'Tufted King Bed',
        description: 'Dark tufted leather king bed flanked by wooden nightstands',
        desc: 'Dark tufted leather king bed flanked by wooden nightstands',
        x: 52,
        y: 68,
        tag: 'Bedding',
      },
      {
        id: 'r2-sunroom',
        title: 'Wooden-Ceiling Sunroom',
        description: 'Separate sunlit sitting space with cream 3-seater sofa and red-brick accent',
        desc: 'Separate sunlit sitting space with cream 3-seater sofa and red-brick accent',
        x: 85,
        y: 45,
        tag: 'Sunroom',
      },
      {
        id: 'r2-tray',
        title: 'Kettle & Toiletries Tray',
        description: 'Tapal Green Tea, electric kettle & full Velenburg amenities in room',
        desc: 'Tapal Green Tea, electric kettle & full Velenburg amenities in room',
        x: 78,
        y: 82,
        tag: 'Amenity',
      },
    ],
  },
  {
    id: 3,
    slug: 'room-3',
    name: 'Room 3 — Luxury Suite 03',
    shortName: 'Suite 03',
    category: 'Luxury Mountain Suite',
    officialTagline: 'A Home Away From Home',
    pricePerNightPkr: 18000,
    pricePKR: 18000,
    capacity: '2 Adults (+1 Child)',
    occupancy: '2 Adults (+1 Child)',
    bedType: 'Tufted King Bed',
    bed: 'Tufted King Bed',
    size: '460 sq ft',
    view: 'Sunlit Sunroom & Pine Hillside',
    description:
      'Combines rich wood paneling with classic architectural molding, a sunlit sofa lounge with a backlit brick art niche, Smart LED TV, electric kettle, and Velenburg toiletries tray.',
    highlights: [
      'Dual aesthetic: Rich wood paneling paired with classic white molded walls',
      'Backlit warm red-brick niche featuring black horse sculptures',
      'Sunlit wooden-ceiling lounge with cream sofa and full-length dressing mirror',
      'Wall-mounted Smart LED TV with dedicated Netflix remote',
      'Electric kettle with complimentary Tapal Green Tea sachets',
      'Complete Velenburg luxury toiletries kit & room station',
    ],
    images: [
      '/images/room-3/photo-1.jpg',
      '/images/room-3/photo-2.jpg',
      '/images/room-3/photo-3.jpg',
      '/images/room-3/photo-4.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    photos: [
      { url: '/images/room-3/photo-1.jpg', caption: 'Rich Wood Wall Paneling & Architectural Moldings', isShared: false },
      { url: '/images/room-3/photo-2.jpg', caption: 'Backlit Brick Sculpture Niche with Horse Statues', isShared: false },
      { url: '/images/room-3/photo-3.jpg', caption: 'Sunlit Sunroom Sofa Lounge with White French Doors', isShared: false },
      { url: '/images/room-3/photo-4.jpg', caption: 'Tufted King Bed Flanked by Carved Accent Chairs', isShared: false },
      { url: '/images/shared/kettle-toiletries-tray.jpg', caption: 'In-Suite Electric Kettle, Tapal Green Tea & Velenburg Toiletries Tray', isShared: true },
      { url: '/images/shared/mirror-sitting-area.jpg', caption: 'In-Room Full-Length Dressing Mirror & Sunroom Lounge', isShared: true },
    ],
    amenities: COMMON_LUXURY_AMENITIES,
    hotspots: [
      {
        id: 'r3-bed',
        title: 'Luxury King Bed',
        description: 'Tufted headboard with twin carved accent chairs and night art',
        desc: 'Tufted headboard with twin carved accent chairs and night art',
        x: 52,
        y: 65,
        tag: 'Bedding',
      },
      {
        id: 'r3-niche',
        title: 'Backlit Brick Sculpture Niche',
        description: 'Exposed red brickwork illuminated with warm amber LED and horse statues',
        desc: 'Exposed red brickwork illuminated with warm amber LED and horse statues',
        x: 45,
        y: 30,
        tag: 'Art Niche',
      },
      {
        id: 'r3-sunroom',
        title: 'White French Doors & Sunroom',
        description: 'Dressing mirror, sheer drapery, and polished wooden ceiling',
        desc: 'Dressing mirror, sheer drapery, and polished wooden ceiling',
        x: 82,
        y: 50,
        tag: 'Sunroom',
      },
      {
        id: 'r3-tray',
        title: 'Tea & Amenities Station',
        description: 'Electric kettle, Tapal Green Tea & Velenburg toiletries in every room',
        desc: 'Electric kettle, Tapal Green Tea & Velenburg toiletries in every room',
        x: 18,
        y: 82,
        tag: 'Amenity',
      },
    ],
  },
  {
    id: 4,
    slug: 'room-4',
    name: 'Room 4 — Luxury Suite 04',
    shortName: 'Suite 04',
    category: 'Luxury Mountain Suite',
    officialTagline: 'Pleasant Stay, Premium Comfort',
    pricePerNightPkr: 18000,
    pricePKR: 18000,
    capacity: '2 Adults (+1 Child)',
    occupancy: '2 Adults (+1 Child)',
    bedType: 'Tufted King Bed',
    bed: 'Tufted King Bed',
    size: '440 sq ft',
    view: 'Lush Forest & Terrace Garden View',
    description:
      'A serene luxury retreat with warm bedside and pendant lighting, a bright wooden-ceiling sunroom sofa lounge opening toward the greenery, electric kettle, and full Velenburg amenities.',
    highlights: [
      'Classic white architectural wall molding with crimson sunset lake statement art',
      'Twin bedside reading lamps plus hanging geometric pendant lights',
      'Bright wooden-ceiling sunroom sofa lounge opening toward mountain greenery',
      'Decorative warm brick alcove with dried floral decor',
      'In-room self-service electric kettle & Tapal Green Tea sachets',
      'Velenburg luxury toiletries kit (Soap, Shampoo, Lotion, Dental & Vanity kits)',
    ],
    images: [
      '/images/room-4/photo-1.jpg',
      '/images/room-4/photo-2.jpg',
      '/images/room-4/photo-3.jpg',
      '/images/room-4/photo-4.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    photos: [
      { url: '/images/room-4/photo-1.jpg', caption: 'Architectural Molding with Crimson Sunset Canvas Art', isShared: false },
      { url: '/images/room-4/photo-2.jpg', caption: 'Twin Bedside Lamps & Hanging Geometric Pendants', isShared: false },
      { url: '/images/room-4/photo-3.jpg', caption: 'Bright Wooden-Ceiling Sunroom Lounge Facing Greenery', isShared: false },
      { url: '/images/room-4/photo-4.jpg', caption: 'Warm Brick Alcove Feature with Decorative Florals', isShared: false },
      { url: '/images/shared/kettle-toiletries-tray.jpg', caption: 'In-Suite Electric Kettle, Tapal Green Tea & Velenburg Toiletries Tray', isShared: true },
      { url: '/images/shared/mirror-sitting-area.jpg', caption: 'In-Room Full-Length Dressing Mirror & Sunroom Lounge', isShared: true },
    ],
    amenities: COMMON_LUXURY_AMENITIES,
    hotspots: [
      {
        id: 'r4-bed',
        title: 'King Bed & Crimson Art',
        description: 'Rich tufted king bed framed with sunset lake gallery canvas',
        desc: 'Rich tufted king bed framed with sunset lake gallery canvas',
        x: 52,
        y: 62,
        tag: 'Bedding',
      },
      {
        id: 'r4-lamps',
        title: 'Twin Ambient Lighting',
        description: 'Bedside warm lamps combined with hanging geometric pendants',
        desc: 'Bedside warm lamps combined with hanging geometric pendants',
        x: 20,
        y: 52,
        tag: 'Lighting',
      },
      {
        id: 'r4-sunroom',
        title: 'Garden-Facing Sunroom Lounge',
        description: 'Wooden ceiling, plush cream sofa, and double doors opening to mountain greenery',
        desc: 'Wooden ceiling, plush cream sofa, and double doors opening to mountain greenery',
        x: 82,
        y: 45,
        tag: 'Sunroom',
      },
      {
        id: 'r4-tray',
        title: 'In-Suite Kettle & Toiletries',
        description: 'Complimentary Tapal Green Tea, electric kettle & Velenburg branded amenities',
        desc: 'Complimentary Tapal Green Tea, electric kettle & Velenburg branded amenities',
        x: 75,
        y: 80,
        tag: 'Amenity',
      },
    ],
  },
];

export const TERRACE_LOUNGE_IMAGES = [
  {
    url: '/images/velenburg-exterior.jpg',
    title: 'Full Exterior Outlook & Mountain Estate',
    description: 'Aerial view of Velenburg Retreat in the quiet pine hills of Gharial Camp, Upper Topa at 7,200 ft elevation.',
  },
  {
    url: '/images/terrace-lounge/photo-1.jpg',
    title: 'Indoor Wooden-Ceiling Lounge',
    description: 'Polished wooden ceilings, white woven cane sofas, patio gas heaters, and sweeping mountain valley views.',
  },
  {
    url: '/images/terrace-lounge/photo-2.jpg',
    title: 'Dining & Gathering Area',
    description: 'Scenic dining setup framed by panoramic glass windows looking out onto the Murree hills.',
  },
  {
    url: '/images/terrace-lounge/photo-3.jpg',
    title: 'Open Mountain Terrace Entry',
    description: 'Wide timber doorway connecting the indoor lounge directly to the open-air stone mountain terrace.',
  },
  {
    url: '/images/terrace-lounge/photo-4.jpg',
    title: 'Terrace & Cloud Valley Overlook',
    description: 'Relax on comfortable cane armchairs while watching clouds drift through the Gharial pine forests.',
  },
  {
    url: '/images/terrace-lounge/photo-5.jpg',
    title: 'Lounge Seating & Self-Use Kitchen',
    description: 'Spacious guest lounge equipped with patio heaters and self-service kitchen space for guests.',
  },
  {
    url: '/images/terrace-lounge/photo-6.jpg',
    title: 'Panoramic Murree Vista',
    description: 'Wide mountain views across the valley, perfect for morning green tea and sunset relaxation.',
  },
];
