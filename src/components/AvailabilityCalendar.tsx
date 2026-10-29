import { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  getBlockedRangesForRoom,
  fetchLiveAvailability,
  subscribeToAvailability,
  BlockedRange
} from '../utils/availability';
import { luxuryAudio } from '../utils/audio';

interface AvailabilityCalendarProps {
  roomId: number;
  checkIn: string;
  checkOut: string;
  onSelectDates: (checkIn: string, checkOut: string) => void;
}

export default function AvailabilityCalendar({
  roomId,
  checkIn,
  checkOut,
  onSelectDates,
}: AvailabilityCalendarProps) {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => {
    const d = checkIn ? new Date(checkIn) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>(() =>
    getBlockedRangesForRoom(roomId)
  );

  // Subscribe to live availability store & fetch
  useEffect(() => {
    setBlockedRanges(getBlockedRangesForRoom(roomId));
    const unsubscribe = subscribeToAvailability(() => {
      setBlockedRanges(getBlockedRangesForRoom(roomId));
    });
    fetchLiveAvailability(roomId).then(() => {
      setBlockedRanges(getBlockedRangesForRoom(roomId));
    });
    return unsubscribe;
  }, [roomId]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute days in month
  const daysInMonth = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isBlocked: boolean; blockInfo?: BlockedRange }[] = [];
    const count = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= count; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const block = blockedRanges.find((b) => {
        const start = new Date(b.start).getTime();
        const end = new Date(b.end).getTime();
        const target = new Date(dateStr).getTime();
        return target >= start && target < end;
      });

      days.push({
        dateStr,
        dayNum: d,
        isBlocked: Boolean(block),
        blockInfo: block,
      });
    }
    return days;
  }, [year, month, blockedRanges]);

  const startDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    luxuryAudio.playChime(540, 0.05);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    luxuryAudio.playChime(620, 0.05);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dateStr: string, isBlocked: boolean) => {
    if (isBlocked) return;
    luxuryAudio.playChime(640, 0.06);

    if (!checkIn || (checkIn && checkOut)) {
      // First click: sets checkIn, resets checkOut
      onSelectDates(dateStr, '');
    } else if (checkIn && !checkOut) {
      if (new Date(dateStr) <= new Date(checkIn)) {
        // If clicked earlier or same date, reset to new checkIn
        onSelectDates(dateStr, '');
      } else {
        // Check if any date in between is blocked
        const start = new Date(checkIn).getTime();
        const end = new Date(dateStr).getTime();
        const hasOverlap = blockedRanges.some((b) => {
          const bStart = new Date(b.start).getTime();
          const bEnd = new Date(b.end).getTime();
          return start < bEnd && end > bStart;
        });

        if (hasOverlap) {
          alert('Selected range overlaps an existing Airbnb/Booking.com reservation. Please select available dates.');
          return;
        }

        onSelectDates(checkIn, dateStr);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 shadow-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal/10">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-gold" />
          <h4 className="font-serif text-sm font-semibold text-charcoal">{monthName}</h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-charcoal/15 text-charcoal/70 hover:bg-gold/10 hover:text-charcoal transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-charcoal/15 text-charcoal/70 hover:bg-gold/10 hover:text-charcoal transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-semibold text-charcoal/50 mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty cells */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9" />
        ))}

        {daysInMonth.map((day) => {
          const isCheckIn = day.dateStr === checkIn;
          const isCheckOut = day.dateStr === checkOut;
          const isInRange =
            checkIn &&
            checkOut &&
            new Date(day.dateStr) > new Date(checkIn) &&
            new Date(day.dateStr) < new Date(checkOut);

          let bgClass = 'bg-alabaster/60 text-charcoal hover:bg-gold/20 cursor-pointer';

          if (day.isBlocked) {
            bgClass = 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed line-through';
          } else if (isCheckIn || isCheckOut) {
            bgClass = 'bg-gold text-charcoal font-bold shadow-md cursor-pointer';
          } else if (isInRange) {
            bgClass = 'bg-gold/25 text-charcoal font-semibold cursor-pointer';
          }

          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={day.isBlocked}
              onClick={() => handleDayClick(day.dateStr, day.isBlocked)}
              title={
                day.isBlocked
                  ? `Unavailable (${day.blockInfo?.source === 'airbnb' ? 'Airbnb' : day.blockInfo?.source === 'booking_com' ? 'Booking.com' : 'Reserved'})`
                  : `Available on ${day.dateStr}`
              }
              className={`h-9 rounded-lg text-xs flex flex-col items-center justify-center transition-all relative ${bgClass}`}
            >
              <span>{day.dayNum}</span>
              {day.isBlocked && (
                <span className="text-[8px] uppercase tracking-tighter opacity-80 leading-none font-bold">
                  {day.blockInfo?.source === 'airbnb' ? 'Air' : day.blockInfo?.source === 'booking_com' ? 'Bkg' : 'Rsv'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & iCal Status */}
      <div className="mt-4 pt-3 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-charcoal/20" />
            <span>Airbnb/Booking Synced</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-alabaster border border-charcoal/20" />
            <span>Available</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 font-medium">
          <ShieldCheck size={13} />
          <span>Live Database Synced</span>
        </div>
      </div>
    </div>
  );
}
