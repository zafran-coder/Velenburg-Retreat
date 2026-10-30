import { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Calendar,
  Download,
  Copy,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  Database,
  Link as LinkIcon,
  CheckCircle2,
  Phone,
  AlertTriangle
} from 'lucide-react';
import PageTransition from '../components/Transitions';
import { ROOMS_DATA } from '../data/roomsData';
import { formatPKR } from '../data/retreatConfig';
import {
  fetchLiveAvailability,
  fetchAdminBookings,
  createLiveBlock,
  removeLiveBlock,
  fetchLiveRoomConfigs,
  saveLiveRoomConfig,
  verifyAdminPasscode,
  getDatabaseHealth,
  downloadICalFile,
  generateICalFeed,
  subscribeToAvailability,
  BlockedRange,
  RoomICalConfig,
  BookingRecord
} from '../utils/availability';
import { luxuryAudio } from '../utils/audio';

export default function Admin() {
  const [passcode, setPasscode] = useState('');
  const [storedPassword, setStoredPassword] = useState(() => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('velenburg_admin_token') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('velenburg_admin_auth') === 'true' && Boolean(sessionStorage.getItem('velenburg_admin_token'));
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Admin Dashboard State (Loaded directly from Supabase Backend)
  const [blocks, setBlocks] = useState<BlockedRange[]>([]);
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [configs, setConfigs] = useState<RoomICalConfig[]>([]);

  // Active Suite View
  const [selectedSuiteTab, setSelectedSuiteTab] = useState(1);
  const [copiedFeedRoomId, setCopiedFeedRoomId] = useState<number | null>(null);

  // New Manual Block Form State
  const [blockRoomId, setBlockRoomId] = useState(1);
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockGuest, setBlockGuest] = useState('');
  const [blockNotes, setBlockNotes] = useState('');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  // iCal Sync URL inputs for currently selected suite
  const [inputAirbnbUrl, setInputAirbnbUrl] = useState('');
  const [inputBookingUrl, setInputBookingUrl] = useState('');
  const [isSavingUrls, setIsSavingUrls] = useState(false);
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);

  // Refresh all data from Supabase DB
  const loadDatabaseState = async (token = storedPassword) => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const [liveBlocks, dbBookings, roomConfigs] = await Promise.all([
        fetchLiveAvailability(),
        fetchAdminBookings(token),
        fetchLiveRoomConfigs(token),
      ]);
      setBlocks(liveBlocks);
      setAllBookings(dbBookings);
      setConfigs(roomConfigs);
    } catch (err) {
      console.error('Failed to load database state:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated && storedPassword) {
      loadDatabaseState(storedPassword);
      const unsubscribe = subscribeToAvailability(() => {
        fetchLiveAvailability().then(setBlocks);
      });
      return unsubscribe;
    }
  }, [isAuthenticated, storedPassword]);

  // Keep iCal input fields in sync when switching suite tabs
  useEffect(() => {
    const curConfig = configs.find((c) => c.roomId === selectedSuiteTab);
    setInputAirbnbUrl(curConfig?.airbnbIcalUrl || '');
    setInputBookingUrl(curConfig?.bookingComIcalUrl || '');
    setSavedUrlSuccess(false);
  }, [selectedSuiteTab, configs]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const result = await verifyAdminPasscode(passcode);
      if (result.success && result.token) {
        luxuryAudio.playSuccessChime();
        setIsAuthenticated(true);
        setStoredPassword(result.token);
        sessionStorage.setItem('velenburg_admin_auth', 'true');
        sessionStorage.setItem('velenburg_admin_token', result.token);
        await loadDatabaseState(result.token);
      } else {
        luxuryAudio.playChime(300, 0.15);
        setErrorMsg(result.error || 'Access Denied: Invalid admin passcode verified on server.');
      }
    } catch {
      setErrorMsg('Failed to connect to authentication server. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStoredPassword('');
    sessionStorage.removeItem('velenburg_admin_auth');
    sessionStorage.removeItem('velenburg_admin_token');
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd) return;

    if (new Date(blockStart) >= new Date(blockEnd)) {
      alert('End date must be after check-in date.');
      return;
    }

    setIsSubmittingBlock(true);
    try {
      await createLiveBlock(
        blockRoomId,
        blockStart,
        blockEnd,
        blockGuest.trim() || 'Owner Manual Reservation',
        blockNotes.trim() || 'Manual block via Admin',
        storedPassword
      );

      luxuryAudio.playSuccessChime();
      setBlockStart('');
      setBlockEnd('');
      setBlockGuest('');
      setBlockNotes('');
      await loadDatabaseState();
    } catch (err: any) {
      alert(`Error creating block in Supabase: ${err.message}`);
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (window.confirm('Are you sure you want to unblock these dates from the Supabase database?')) {
      try {
        luxuryAudio.playChime(400, 0.08);
        await removeLiveBlock(id, storedPassword);
        await loadDatabaseState();
      } catch (err: any) {
        alert(`Error removing block: ${err.message}`);
      }
    }
  };

  const handleCopyFeed = (roomId: number) => {
    luxuryAudio.playChime(640, 0.06);
    const feed = generateICalFeed(roomId);
    navigator.clipboard.writeText(feed);
    setCopiedFeedRoomId(roomId);
    setTimeout(() => setCopiedFeedRoomId(null), 2500);
  };

  const handleSaveUrls = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingUrls(true);
    try {
      await saveLiveRoomConfig(
        selectedSuiteTab,
        inputAirbnbUrl,
        inputBookingUrl,
        storedPassword
      );
      luxuryAudio.playSuccessChime();
      setSavedUrlSuccess(true);
      await loadDatabaseState();
      setTimeout(() => setSavedUrlSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving iCal URLs to Supabase: ${err.message}`);
    } finally {
      setIsSavingUrls(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <section className="min-h-[80vh] flex items-center justify-center p-6 bg-alabaster">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200/80 shadow-md max-w-md w-full text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 grid place-items-center text-[#B48A3E] mx-auto mb-6">
              <Lock size={26} strokeWidth={1.75} />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#B48A3E] font-semibold">
              Owner Management
            </span>
            <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
              Velenburg Admin Access
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Server-protected access to Supabase database availability, date blocking, and Airbnb/Booking.com iCal sync.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-center tracking-widest focus:outline-none focus:border-[#B48A3E] bg-alabaster/40 font-mono"
              />

              {errorMsg && (
                <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Unlock size={16} strokeWidth={1.75} />
                )}
                <span>{isVerifying ? 'Verifying with Server...' : 'Enter Admin Dashboard'}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Protected by server-side ADMIN_PASSWORD</span>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  const activeSuiteBlocks = blocks.filter((b) => b.roomId === selectedSuiteTab);
  const health = getDatabaseHealth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-alabaster pb-20">
        {/* Admin Bar */}
        <div className="bg-[#0F172A] text-alabaster px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {health.isFallback ? (
              <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <AlertTriangle size={12} />
                <span>Local Storage Active (Supabase Paused)</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#B48A3E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Database size={12} />
                <span>Supabase Live DB</span>
              </span>
            )}
            <h1 className="text-base font-bold text-white">
              Velenburg Retreat · Central Availability & iCal Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadDatabaseState()}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sync latest records from database & OTA feeds"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-gold' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full border border-slate-400/40 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-semibold transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Paused Database Notification Banner */}
          {health.isFallback && (
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Offline Resilience Active (Supabase Free-Tier Sleep Protection):</span>{' '}
                <span>
                  Supabase appears to be paused or asleep. The website and booking calendar are automatically running on <strong>LocalStorage mirror cache</strong> so your visitors can check availability and book via WhatsApp with zero interruption. When convenient, open your Supabase dashboard to wake it up.
                </span>
              </div>
            </div>
          )}
          {/* Top 4 Suites Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROOMS_DATA.map((room) => {
              const roomBlocks = blocks.filter((b) => b.roomId === room.id);
              const roomConfig = configs.find((c) => c.roomId === room.id);
              const hasAirbnb = Boolean(roomConfig?.airbnbIcalUrl);
              const hasBooking = Boolean(roomConfig?.bookingComIcalUrl);

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedSuiteTab(room.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedSuiteTab === room.id
                      ? 'bg-white border-[#B48A3E] shadow-md ring-2 ring-[#B48A3E]/20'
                      : 'bg-white border-slate-200/80 hover:border-[#B48A3E]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#B48A3E] font-bold">
                      Suite 0{room.id}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {roomBlocks.length} Block{roomBlocks.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h3 className="text-sm text-[#0F172A] font-semibold mt-2 line-clamp-1">
                    {room.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-md font-medium ${hasAirbnb ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-400'}`}>
                      Airbnb {hasAirbnb ? '✓' : '—'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${hasBooking ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                      Booking.com {hasBooking ? '✓' : '—'}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A]">
                      PKR 18,000 / Night
                    </span>
                    <span className="text-[#B48A3E] hover:underline flex items-center gap-1 font-semibold text-[11px]">
                      Manage →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Controls Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Manual Block Creator */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-charcoal/10 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gold">
                <Plus size={18} />
                <h2 className="text-lg font-serif text-charcoal font-semibold">
                  Block Dates Manually
                </h2>
              </div>
              <p className="text-xs text-charcoal/65 mb-6 font-light">
                Directly writes to Supabase <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">bookings</code> table so dates are immediately disabled globally for all visitors.
              </p>

              <form onSubmit={handleCreateBlock} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-1.5">
                    Target Suite
                  </label>
                  <select
                    value={blockRoomId}
                    onChange={(e) => setBlockRoomId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-alabaster/40"
                  >
                    {ROOMS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-1.5">
                      Check-In
                    </label>
                    <input
                      type="date"
                      required
                      value={blockStart}
                      onChange={(e) => setBlockStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-alabaster/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-1.5">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      required
                      value={blockEnd}
                      min={blockStart}
                      onChange={(e) => setBlockEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-alabaster/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-1.5">
                    Guest Name / Label
                  </label>
                  <input
                    type="text"
                    value={blockGuest}
                    onChange={(e) => setBlockGuest(e.target.value)}
                    placeholder="e.g. Tariq Mehmood (Advance Paid)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-alabaster/40"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-1.5">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={blockNotes}
                    onChange={(e) => setBlockNotes(e.target.value)}
                    placeholder="e.g. Deposit verified via JazzCash"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-alabaster/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBlock}
                  className="w-full py-3 rounded-xl bg-charcoal hover:bg-black disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingBlock ? (
                    <RefreshCw size={14} className="animate-spin text-gold" />
                  ) : (
                    <Calendar size={14} className="text-gold" />
                  )}
                  <span>{isSubmittingBlock ? 'Saving to Database...' : 'Save Block to Database'}</span>
                </button>
              </form>

              {/* Inbound WhatsApp Inquiries Box */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-charcoal/80 font-bold flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-600" />
                    <span>Inbound Website Inquiries</span>
                  </h3>
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {allBookings.filter((b) => b.source === 'website').length} Total
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {allBookings.filter((b) => b.source === 'website').length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2">
                      No customer inquiries logged yet.
                    </p>
                  ) : (
                    allBookings
                      .filter((b) => b.source === 'website')
                      .slice(0, 5)
                      .map((inq) => (
                        <div
                          key={inq.id}
                          className="p-2.5 rounded-xl bg-alabaster border border-slate-200 text-[11px]"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span>{inq.guest_name}</span>
                            <span className="text-emerald-700 font-mono text-[10px]">
                              {formatPKR(inq.total_price_pkr)}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[10px] mt-0.5">
                            Suite 0{inq.room_id} • {inq.check_in} → {inq.check_out} ({inq.nights}N)
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5 font-mono">
                            Ref: {inq.booking_ref} • {inq.guest_phone}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Active Bookings & iCal Configuration */}
            <div className="lg:col-span-7 space-y-6">
              {/* iCal Inbound Sync Configuration (Airbnb / Booking.com URLs) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-[#B48A3E]" />
                    <h3 className="text-base font-serif text-charcoal font-semibold">
                      iCal Inbound Sync URLs (Suite 0{selectedSuiteTab})
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
                    Live OTA Sync
                  </span>
                </div>

                <p className="text-xs text-charcoal/65 mb-5 font-light">
                  Paste the iCal calendar export links from <strong>Airbnb</strong> and <strong>Booking.com</strong>. The server automatically pulls their reservations and blocks those dates on your website.
                </p>

                <form onSubmit={handleSaveUrls} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-rose-700 font-bold mb-1">
                      Airbnb iCal URL (.ics)
                    </label>
                    <input
                      type="url"
                      value={inputAirbnbUrl}
                      onChange={(e) => setInputAirbnbUrl(e.target.value)}
                      placeholder="https://www.airbnb.com/calendar/ical/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold bg-alabaster/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-blue-700 font-bold mb-1">
                      Booking.com iCal URL (.ics)
                    </label>
                    <input
                      type="url"
                      value={inputBookingUrl}
                      onChange={(e) => setInputBookingUrl(e.target.value)}
                      placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold bg-alabaster/30"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      disabled={isSavingUrls}
                      className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light disabled:opacity-50 text-charcoal font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingUrls ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <Check size={13} />
                      )}
                      <span>{isSavingUrls ? 'Saving to Database...' : 'Save iCal Sync URLs'}</span>
                    </button>

                    {savedUrlSuccess && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Saved to Supabase!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* iCal Outbound Export Box */}
              <div className="bg-charcoal text-alabaster rounded-3xl p-6 md:p-8 border border-gold/30 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="text-gold-light" />
                    <h3 className="text-base font-serif text-white font-semibold">
                      Outbound iCal Feed for Suite 0{selectedSuiteTab}
                    </h3>
                  </div>
                  <span className="text-[11px] text-gold-light px-2.5 py-1 rounded-full bg-white/10 font-mono">
                    RFC 5545 .ics
                  </span>
                </div>

                <p className="text-xs text-alabaster/70 mb-5 leading-relaxed font-light">
                  Export this feed to <strong>Airbnb</strong> and <strong>Booking.com</strong> so whenever a guest reserves on this website, those dates are automatically blocked on your OTA calendars.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleCopyFeed(selectedSuiteTab)}
                    className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedFeedRoomId === selectedSuiteTab ? (
                      <>
                        <Check size={14} />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy .ics Feed Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadICalFile(selectedSuiteTab)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download .ics File</span>
                  </button>
                </div>
              </div>

              {/* Blocked Ranges List */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal/10">
                  <h3 className="text-base font-serif text-charcoal font-semibold">
                    Current Blocked Ranges (Suite 0{selectedSuiteTab})
                  </h3>
                  <span className="text-xs text-charcoal/50">
                    {activeSuiteBlocks.length} Total
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSuiteBlocks.length === 0 ? (
                    <p className="text-xs text-charcoal/50 italic py-4 text-center">
                      No dates are currently blocked for Suite 0{selectedSuiteTab}.
                    </p>
                  ) : (
                    activeSuiteBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="p-3.5 rounded-xl bg-alabaster/60 border border-charcoal/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-charcoal flex items-center gap-2">
                            <span>
                              {block.start} → {block.end}
                            </span>
                            <span
                              className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                block.source === 'airbnb'
                                  ? 'bg-rose-100 text-rose-700'
                                  : block.source === 'booking_com'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {block.source}
                            </span>
                          </div>
                          <div className="text-[11px] text-charcoal/60 mt-0.5">
                            {block.guestName} {block.notes ? `• ${block.notes}` : ''}
                          </div>
                        </div>

                        {/* If it's a manual block or website DB booking, allow delete */}
                        {block.source === 'manual_block' || block.source === 'website' ? (
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-2 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Unblock dates in Supabase"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            OTA Synced
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
