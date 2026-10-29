import { RETREAT_CONFIG } from '../data/retreatConfig';

export interface WhatsAppBookingParams {
  ownerPhone?: string;
  bookingRef?: string;
  roomId?: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number | string;
  guestName: string;
  guestPhone: string;
  notes?: string;
}

/**
 * Generate a unique booking reference formatted like VR-2026-XXXX
 */
export function generateBookingRef(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  return `VR-${currentYear}-${randomNum}`;
}

function formatFriendlyDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Calculate total price in PKR: Nights × 18,000 PKR
 */
export function calculateStayPrice(nights: number, roomsCount: number = 1): number {
  const ratePerNight = RETREAT_CONFIG.pricing.fixedRatePkr; // PKR 18,000 / Night
  const validNights = Math.max(1, nights || 1);
  return validNights * ratePerNight * Math.max(1, roomsCount);
}

/**
 * Builds the direct WhatsApp booking URL conforming to Tab 3.2 & Tab 3.3
 */
export function buildWhatsAppBookingUrl(params: WhatsAppBookingParams): string {
  const ownerPhone = (params.ownerPhone || RETREAT_CONFIG.contact.ownerWhatsApp).replace(/\D/g, '');
  const bookingRef = params.bookingRef || generateBookingRef();
  const ratePerNight = RETREAT_CONFIG.pricing.fixedRatePkr;
  const totalAmount = params.nights * ratePerNight;

  const displayCheckIn = `${formatFriendlyDate(params.checkIn)} (${params.checkIn})`;
  const displayCheckOut = `${formatFriendlyDate(params.checkOut)} (${params.checkOut})`;

  const messageLines = [
    `Assalam-o-Alaikum *Velenburg Retreat*! 🌲`,
    `I would like to check availability and book a luxury suite for the following dates:`,
    ``,
    `• *Selected Suite:* ${params.roomName}`,
    `• *Check-in Date:* ${displayCheckIn} — from 2:00 PM`,
    `• *Check-out Date:* ${displayCheckOut} — by 12:00 PM`,
    `• *Stay Duration:* ${params.nights} Night(s)`,
    `• *Guests:* ${params.guests}`,
    `• *Nightly Rate:* PKR 18,000 / Night`,
    `• *Total Calculated:* *PKR ${totalAmount.toLocaleString()}*`,
    `• *Booking Ref:* ${bookingRef}`,
    params.notes ? `• *Note:* ${params.notes}` : null,
    ``,
    `Please confirm if these dates are available for reservation. Thank you!`,
  ];

  const fullMessage = messageLines.filter((line) => line !== null).join('\n');
  return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(fullMessage)}`;
}

/**
 * General inquiry WhatsApp URL (used for floating button or quick questions)
 */
export function buildGeneralWhatsAppUrl(customNote?: string): string {
  const ownerPhone = RETREAT_CONFIG.contact.ownerWhatsApp.replace(/\D/g, '');
  const message = customNote || 
    `Assalam-o-Alaikum Velenburg Retreat! 🌲\nI am inquiring about suite availability and retreat bookings at Gharial Camp, Murree. Could you please share more details?`;
  return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
}
