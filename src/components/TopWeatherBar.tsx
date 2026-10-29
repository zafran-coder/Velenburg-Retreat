import { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { InstagramIcon } from './InstagramIcon';
import WeatherModal, { WeatherIcon } from './WeatherModal';
import { fetchLiveMurreeWeather, LiveWeatherData } from '../utils/weather';
import { luxuryAudio } from '../utils/audio';

export default function TopWeatherBar() {
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const loadWeather = useCallback(async (force = false) => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchLiveMurreeWeather(force);
      setWeatherData(data);
    } catch {
      // fallback handled inside fetchLiveMurreeWeather
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
    // Auto-refresh weather every 10 minutes
    const interval = setInterval(() => {
      loadWeather(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadWeather]);

  const handleOpenWeather = () => {
    luxuryAudio.playChime(620, 0.06);
    setIsWeatherModalOpen(true);
    // If weather data is missing or older than 5 minutes, quietly refresh in background
    if (!weatherData || Date.now() - weatherData.lastFetched > 5 * 60 * 1000) {
      loadWeather(true);
    }
  };

  const currentTemp = weatherData ? `${Math.round(weatherData.current.temperature)}°C` : '17°C';
  const currentCondition = weatherData ? weatherData.current.condition : 'Crisp Mountain Breeze';
  const iconType = weatherData ? weatherData.current.iconType : 'cloud-sun';

  return (
    <>
      <div className="bg-[#111613]/98 text-alabaster border-b border-gold/20 text-[11px] h-8 sm:h-8.5 px-3 sm:px-6 relative z-50 font-sans tracking-wide flex items-center shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-[11px] whitespace-nowrap overflow-hidden">
          {/* Left: Location & Real-Time Live Weather */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-alabaster/90 overflow-hidden">
            <span className="hidden sm:flex items-center gap-1.5 font-semibold text-gold-light uppercase tracking-wider text-[10px] shrink-0">
              <MapPin size={11} className="text-gold" />
              <span>Velenburg Retreat · Gharial Camp, Murree</span>
            </span>

            <span className="hidden sm:inline-block text-gold/30">|</span>

            {/* Clickable Real-Time Weather Widget Button */}
            <button
              type="button"
              onClick={handleOpenWeather}
              title="Click to view full live mountain weather & 4-day forecast for Gharial Camp"
              className="group inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-gold/15 border border-gold/25 hover:border-gold/60 text-alabaster/90 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-emerald-500/20" />
              </span>

              <WeatherIcon iconType={iconType} size={13} />

              <span className="font-semibold text-gold-light">
                {currentTemp}
              </span>

              <span className="text-alabaster/80 group-hover:text-gold-light transition-colors text-[10.5px] truncate max-w-[95px] xs:max-w-[140px] sm:max-w-none">
                {currentCondition}
              </span>

              <span className="hidden lg:inline-block text-[9.5px] font-mono text-gold/80 bg-black/40 px-1.5 py-0.2 rounded border border-white/10">
                7,200 Ft
              </span>
            </button>

            <span className="hidden xl:inline-block text-gold/30">|</span>

            <span className="hidden xl:flex items-center gap-1.5 text-alabaster/70 text-[10.5px]">
              <Clock size={11} className="text-gold" />
              <span>Check-in: {RETREAT_CONFIG.timings.checkIn} | Check-out: {RETREAT_CONFIG.timings.checkOut}</span>
            </span>
          </div>

          {/* Right: Instagram, Phone & WhatsApp */}
          <div className="flex items-center gap-3 sm:gap-3.5 text-[11px] shrink-0">
            {/* Instagram Link */}
            <a
              href={RETREAT_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-alabaster/80 hover:text-gold-light transition-colors group"
              title="Follow @velenburg on Instagram"
            >
              <InstagramIcon size={12} className="text-gold group-hover:scale-105 transition-transform" />
              <span className="text-gold-light font-medium">{RETREAT_CONFIG.contact.instagramHandle}</span>
            </a>

            <span className="hidden md:inline-block text-gold/30">|</span>

            {/* Call Link */}
            <a
              href={`tel:${RETREAT_CONFIG.contact.displayPhone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-alabaster/85 hover:text-gold-light transition-colors"
            >
              <Phone size={11} className="text-gold" />
              <span className="font-medium text-[10.5px]">{RETREAT_CONFIG.contact.displayPhone}</span>
            </a>

            <span className="hidden sm:inline-block text-gold/30">|</span>

            {/* Direct WhatsApp link */}
            <a
              href={`https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20I%20would%20like%20to%20inquire%20about%20booking%20a%20luxury%20suite.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle size={12} className="text-[#25D366] fill-[#25D366]" />
              <span className="text-[11px]">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Live Weather Modal */}
      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        weatherData={weatherData}
        onRefresh={() => loadWeather(true)}
        isLoading={isWeatherLoading}
      />
    </>
  );
}
