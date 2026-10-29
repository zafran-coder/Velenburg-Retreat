import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Mountain,
  Sparkles,
  RefreshCw,
  Coffee,
  CheckCircle2,
  Thermometer,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Shirt
} from 'lucide-react';
import { LiveWeatherData } from '../utils/weather';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: LiveWeatherData | null;
  onRefresh?: () => Promise<void>;
  isLoading?: boolean;
}

export function WeatherIcon({
  iconType,
  size = 20,
  className = '',
}: {
  iconType: string;
  size?: number;
  className?: string;
}) {
  switch (iconType) {
    case 'sun':
      return <Sun size={size} className={`text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] ${className}`} />;
    case 'moon':
      return <Moon size={size} className={`text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)] ${className}`} />;
    case 'cloud-sun':
      return <CloudSun size={size} className={`text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)] ${className}`} />;
    case 'cloud-moon':
      return <CloudMoon size={size} className={`text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)] ${className}`} />;
    case 'cloud':
      return <Cloud size={size} className={`text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.3)] ${className}`} />;
    case 'fog':
      return <CloudFog size={size} className={`text-teal-200/90 drop-shadow-[0_0_8px_rgba(153,246,228,0.3)] ${className}`} />;
    case 'drizzle':
      return <CloudDrizzle size={size} className={`text-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.4)] ${className}`} />;
    case 'rain':
      return <CloudRain size={size} className={`text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] ${className}`} />;
    case 'snow':
      return <Snowflake size={size} className={`text-cyan-200 animate-pulse drop-shadow-[0_0_10px_rgba(165,243,252,0.6)] ${className}`} />;
    case 'thunderstorm':
      return <CloudLightning size={size} className={`text-yellow-400 animate-bounce drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] ${className}`} />;
    default:
      return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
  }
}

export default function WeatherModal({
  isOpen,
  onClose,
  weatherData,
  onRefresh,
  isLoading = false,
}: WeatherModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !weatherData) return null;

  const { current, hourly, daily, location, elevation } = weatherData;

  const toDisplayTemp = (celsius: number) => {
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const handleRefreshClick = async () => {
    luxuryAudio.playChime(640, 0.05);
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const handleToggleUnit = () => {
    luxuryAudio.playChime(560, 0.04);
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  // Find min and max across all forecast days for gradient bar
  const allMax = Math.max(...daily.map((d) => d.maxTemp), current.highTemp);
  const allMin = Math.min(...daily.map((d) => d.minTemp), current.lowTemp);
  const tempRange = Math.max(1, allMax - allMin);

  const whatsappInquireUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20🌲%0AI%20checked%20the%20live%20alpine%20weather%20at%20Gharial%20Camp%20(${current.temperature}°C,%20${current.condition})%20and%20would%20like%20to%20inquire%20about%20suite%20availability%20(PKR%2018,000%20/%20Night).`;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Deep Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container: Luxury Alpine Observatory UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#0B1118] text-alabaster rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.7)] border border-gold/40 overflow-hidden z-10 flex flex-col h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] md:h-[min(90vh,780px)] my-auto"
        >
          {/* Header Bar */}
          <div className="px-5 py-3.5 sm:px-7 sm:py-4 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-[#070b10]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </span>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-serif text-white font-normal tracking-wide">
                    Live Alpine Weather Observatory
                  </h3>
                  <span className="text-[9.5px] font-mono uppercase bg-gold/20 text-gold-light px-2 py-0.5 rounded-full border border-gold/30">
                    7,200 Ft Ridge
                  </span>
                </div>
                <p className="text-[11px] text-alabaster/60 font-sans">
                  Gharial Camp, Upper Topa, Murree · Real-Time Satellite Feed
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Unit Toggle: °C / °F */}
              <button
                type="button"
                onClick={handleToggleUnit}
                title="Toggle Celsius / Fahrenheit"
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-gold/20 border border-white/15 text-[11px] font-bold text-gold-light hover:text-white transition-all cursor-pointer"
              >
                {unit === 'C' ? '°C · Metric' : '°F · Imperial'}
              </button>

              {onRefresh && (
                <button
                  type="button"
                  onClick={handleRefreshClick}
                  disabled={isRefreshing || isLoading}
                  aria-label="Refresh live weather data"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer disabled:opacity-50"
                  title="Refresh station readings"
                >
                  <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close weather modal"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Scrollable Observatory Body */}
          <div className="overflow-y-auto p-4 sm:p-6 md:p-7 space-y-5 flex-1 min-h-0">
            {/* ══════════ HERO OBSERVATORY DISPLAY ══════════ */}
            <div className="relative rounded-2xl overflow-hidden p-5 sm:p-7 bg-gradient-to-br from-[#101924] via-[#0E1520] to-[#0A0E15] border border-gold/35 shadow-2xl">
              {/* Atmospheric Glow */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-52 h-52 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Weather Icon Box */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white/5 border border-gold/30 grid place-items-center shadow-inner shrink-0 backdrop-blur-sm">
                    <WeatherIcon iconType={current.iconType} size={48} />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-md">
                        {toDisplayTemp(current.temperature)}
                      </span>
                      <span className="text-xs sm:text-[13px] text-gold-light/90 font-medium">
                        Feels like {toDisplayTemp(current.apparentTemperature)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-xl font-serif text-gold-light mt-1.5 font-normal">
                      {current.condition}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-alabaster/70">
                      <span className="inline-flex items-center gap-1 font-medium bg-white/10 px-2 py-0.5 rounded-md">
                        <ArrowUp size={11} className="text-amber-400" />
                        <span>High: <strong className="text-white">{toDisplayTemp(current.highTemp)}</strong></span>
                      </span>

                      <span className="inline-flex items-center gap-1 font-medium bg-white/10 px-2 py-0.5 rounded-md">
                        <ArrowDown size={11} className="text-sky-300" />
                        <span>Low: <strong className="text-white">{toDisplayTemp(current.lowTemp)}</strong></span>
                      </span>

                      <span className="text-emerald-400 font-medium text-[11px] bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                        AQI: 20 · Pristine Air
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Status Card */}
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 flex flex-col justify-between items-start sm:items-end">
                  <span className="text-[9.5px] uppercase font-bold text-gold-light tracking-wider block">
                    Station Telemetry
                  </span>
                  <span className="text-xs text-alabaster/80 mt-0.5 block font-mono">
                    Recorded: {current.updatedAt} PKT
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {location}
                  </span>
                  <span className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-[10px] font-semibold">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>{weatherData.source === 'live' ? 'Live Satellite Feed' : 'Alpine Weather Feed'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════ HOURLY MOUNTAIN OUTLOOK (NEXT 8 HOURS) ══════════ */}
            {hourly && hourly.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase font-bold text-gold-light tracking-widest block">
                    Hourly Alpine Trend (Gharial Ridge)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Next 8 Hours</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 overflow-x-auto pb-1">
                  {hourly.slice(0, 8).map((h, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all min-w-[65px] ${
                        idx === 0
                          ? 'bg-gold/15 border-gold/50 shadow-[0_0_12px_rgba(212,175,55,0.15)] ring-1 ring-gold/40'
                          : 'bg-white/5 border-white/10 hover:border-gold/40 hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-[10.5px] font-mono block ${idx === 0 ? 'text-gold-light font-bold' : 'text-slate-300'}`}>
                        {h.hour}
                      </span>
                      <div className="my-2">
                        <WeatherIcon iconType={h.iconType} size={20} />
                      </div>
                      <span className="text-xs font-serif font-bold text-white block">
                        {toDisplayTemp(h.temperature)}
                      </span>
                      {h.precipitationProb > 0 ? (
                        <span className="text-[9px] text-sky-400 font-mono mt-0.5">
                          {h.precipitationProb}%
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">0%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ 4 ATMOSPHERIC KEY GAUGES ══════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* 1. Humidity */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
                  <Droplets size={16} />
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Humidity</span>
                </div>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-white">{current.humidity}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 my-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-teal-300 h-full rounded-full"
                    style={{ width: `${Math.min(100, current.humidity)}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-slate-400 font-light">
                  {current.humidity < 40 ? 'Crisp & Dry' : current.humidity < 70 ? 'Ideal Alpine' : 'Moist Pine Mist'}
                </span>
              </div>

              {/* 2. Wind */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-teal-300 mb-1">
                  <Wind size={16} />
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Wind Speed</span>
                </div>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-white">{current.windSpeed}</span>
                  <span className="text-[10px] text-slate-400 ml-1">km/h</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 my-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, current.windSpeed * 3)}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-slate-400 font-light">NNW Mountain Breeze</span>
              </div>

              {/* 3. Precipitation */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-indigo-300 mb-1">
                  <CloudRain size={16} />
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Precipitation</span>
                </div>
                <div className="my-1">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-white">{current.precipitation}</span>
                  <span className="text-[10px] text-slate-400 ml-1">mm</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 my-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, current.precipitation * 20)}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-slate-400 font-light">
                  {current.precipitation === 0 ? 'Clear Slopes' : 'Active Precipitation'}
                </span>
              </div>

              {/* 4. UV Index & Air Quality */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-gold mb-1">
                  <Mountain size={16} />
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Elevation</span>
                </div>
                <div className="my-1">
                  <span className="text-base sm:text-lg font-serif font-bold text-gold-light">7,200 Ft</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 my-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-gold to-amber-300 h-full rounded-full w-full" />
                </div>
                <span className="text-[9.5px] text-slate-400 font-light">{elevation}</span>
              </div>
            </div>

            {/* ══════════ IN-SUITE MOUNTAIN COMFORT & PACKING GUIDE ══════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gold/10 border border-gold/30 text-xs sm:text-[13px] text-alabaster/90 leading-relaxed">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-gold-light uppercase tracking-wider text-[11px]">
                  <Sparkles size={14} className="text-gold" />
                  <span>Mountain Comfort & Highland Wardrobe Advisory</span>
                </div>
                <span className="text-[10px] text-gold/80 font-mono hidden sm:inline">Active Guidance</span>
              </div>

              <p className="mb-3.5 text-alabaster/85 font-light leading-relaxed">
                {current.advisory}
              </p>

              {/* Wardrobe Tip Box */}
              <div className="mb-3.5 p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5">
                <Shirt size={16} className="text-gold shrink-0 mt-0.5" />
                <div className="text-[11.5px] text-slate-300 font-light leading-relaxed">
                  <strong className="text-white font-medium">Packing Recommendation: </strong>
                  {current.temperature < 12
                    ? 'Murree nights are frosty. Bring thermal layers, a down jacket, wool socks, and warm shawls for sitting on the terrace.'
                    : current.temperature < 18
                    ? 'Crisp mountain weather. A medium fleece jacket, cardigan, and comfortable walking shoes for pine trail exploration are ideal.'
                    : 'Pleasant daytime mountain sunshine. Light cottons for afternoon, with light sweaters or wraps for the cool sunset breeze.'}
                </div>
              </div>

              {/* Included In-Suite Warmth Perks */}
              <div className="pt-3 border-t border-gold/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gold-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-gold shrink-0" />
                  <span>Heated duvets in all 4 suites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee size={13} className="text-gold shrink-0" />
                  <span>In-room kettle & Tapal Green Tea</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer size={13} className="text-gold shrink-0" />
                  <span>Terrace gas radiant patio heaters</span>
                </div>
              </div>
            </div>

            {/* ══════════ 7-DAY EXTENDED HIGHLAND FORECAST WITH GRADIENT BARS ══════════ */}
            {daily && daily.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-gold-light tracking-widest block">
                    7-Day Extended Alpine Forecast (Murree / Upper Topa)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Highland Outlook</span>
                </div>

                <div className="space-y-2">
                  {daily.map((d, idx) => {
                    const minPercent = ((d.minTemp - allMin) / tempRange) * 100;
                    const maxPercent = ((d.maxTemp - allMin) / tempRange) * 100;
                    const barWidth = Math.max(10, maxPercent - minPercent);

                    return (
                      <div
                        key={idx}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10 transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        {/* Day Name */}
                        <span className="font-semibold text-white w-20 shrink-0">
                          {d.dayName}
                        </span>

                        {/* Icon & Condition */}
                        <div className="flex items-center gap-2 w-36 sm:w-44 shrink-0">
                          <WeatherIcon iconType={d.iconType} size={18} />
                          <span className="text-slate-300 font-light truncate text-[11px]">
                            {d.condition}
                          </span>
                        </div>

                        {/* Rain Probability */}
                        <span className="text-[10px] font-mono text-sky-400 w-12 text-center shrink-0 hidden sm:inline">
                          {d.precipitationProb ? `${d.precipitationProb}%` : '0%'}
                        </span>

                        {/* Min Temp */}
                        <span className="font-mono text-slate-400 text-right w-12 shrink-0">
                          {toDisplayTemp(d.minTemp)}
                        </span>

                        {/* Apple Weather Style Range Bar */}
                        <div className="flex-1 max-w-[120px] sm:max-w-[160px] bg-white/10 h-1.5 rounded-full relative overflow-hidden hidden xs:block">
                          <div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-300 to-amber-500 rounded-full"
                            style={{
                              left: `${Math.max(0, minPercent)}%`,
                              width: `${Math.min(100 - minPercent, barWidth)}%`,
                            }}
                          />
                        </div>

                        {/* Max Temp */}
                        <span className="font-mono font-bold text-white text-right w-12 shrink-0">
                          {toDisplayTemp(d.maxTemp)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══════════ PINNED ACTION FOOTER BAR ══════════ */}
          <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-[#070b10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[9.5px] uppercase font-bold text-gold-light tracking-wider block">
                Uniform Luxury Suite Rate
              </span>
              <div className="text-xs text-alabaster/70">
                <span className="font-bold text-white font-serif text-sm">PKR 18,000 / Night</span> · All 4 Suites
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Close Report
              </button>

              <a
                href={whatsappInquireUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => luxuryAudio.playSuccessChime()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <MessageCircle size={15} className="fill-white" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
