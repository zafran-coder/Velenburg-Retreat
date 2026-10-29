import { ROOMS_DATA } from './roomsData';

export interface NavItemLink {
  label: string;
  to: string;
  note?: string;
}

export interface NavPanel {
  heading: string;
  blurb: string;
  links: NavItemLink[];
  image: string;
  caption: string;
}

export interface NavItem {
  name: string;
  path: string;
  panel?: NavPanel;
}

export const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'Our 4 Luxury Suites',
    path: '/collections',
    panel: {
      heading: '4 Uniform Luxury Suites',
      blurb:
        'All 4 rooms are top-tier Luxury Suites at PKR 18,000 / Night. Every suite includes a self-service electric kettle, Tapal Green Tea sachets, and black-and-gold Velenburg branded toiletries.',
      links: ROOMS_DATA.map((r) => ({
        label: r.name,
        to: `/collections?room=${r.slug}`,
        note: `"${r.officialTagline}" · PKR 18,000 / Night`,
      })),
      image: '/images/room-2/photo-1.jpg',
      caption: 'Suite 02 — Vertical Wood Feature Wall & Private Sunroom',
    },
  },
  {
    name: 'Lounge & Terrace',
    path: '/bespoke',
    panel: {
      heading: 'Mountain View Lounge & Open Terrace',
      blurb:
        'Scenic shared guest spaces with polished wooden ceilings, white woven cane sofas, patio heaters, self-use kitchen space, and panoramic views of Murree pine hills.',
      links: [
        { label: 'Indoor Wooden-Ceiling Lounge', to: '/bespoke', note: 'Woven cane sofas & gas patio heaters' },
        { label: 'Open-Air Mountain Terrace', to: '/bespoke', note: 'Panoramic cloud & pine valley views' },
        { label: 'Self-Use Guest Kitchen Space', to: '/bespoke', note: 'Scenic shared guest facilities' },
      ],
      image: '/images/terrace-lounge/photo-3.jpg',
      caption: 'Direct doorway to open stone terrace overlooking Gharial Camp',
    },
  },
  { name: 'Interactive Tour', path: '/virtual-tour' },
  { name: 'Our Story', path: '/about' },
  { name: 'Location & Contact', path: '/contact' },
];
