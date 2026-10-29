/**
 * Velenburg Retreat — Real-Time Live Weather Service (Gharial Camp, Murree)
 * Uses high-resolution Open-Meteo Alpine Forecast API (NO API KEY REQUIRED).
 * Latitude: 33.9025° N, Longitude: 73.4150° E, Elevation: 7,200 Ft (2,195 m)
 */

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  condition: string;
  advisory: string;
  iconType: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  highTemp: number;
  lowTemp: number;
  updatedAt: string;
  uvIndex: number;
  airQuality: string;
  visibilityKm: number;
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temperature: number;
  iconType: CurrentWeather['iconType'];
  condition: string;
  precipitationProb: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  iconType: string;
  precipitationProb?: number;
}

export interface LiveWeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: string;
  elevation: string;
  source: 'live' | 'fallback';
  lastFetched: number;
}

const CACHE_KEY = 'velenburg_live_weather_v2';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Format 24h number into user-friendly 12h label (e.g. 18 -> "6 PM", 0 -> "12 AM")
 */
export function formatHour(hour24: number): string {
  if (hour24 === 0) return '12 AM';
  if (hour24 === 12) return '12 PM';
  if (hour24 > 12) return `${hour24 - 12} PM`;
  return `${hour24} AM`;
}

/**
 * Get current date and time strictly in Pakistan Standard Time (Asia/Karachi, UTC+5).
 * This guarantees accurate local hour mapping regardless of the visitor's local computer timezone.
 */
export function getMurreeTime(): {
  dateIso: string;
  hourPrefix: string;
  hour: number;
  minute: number;
  timeLabel: string;
  isDay: boolean;
} {
  try {
    const dtf = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    const parts = dtf.formatToParts(new Date());
    const p: Record<string, string> = {};
    for (const part of parts) {
      p[part.type] = part.value;
    }
    const year = p.year;
    const month = p.month;
    const day = p.day;
    const hour = parseInt(p.hour || '0', 10);
    const minute = parseInt(p.minute || '0', 10);
    const hourStr = String(hour).padStart(2, '0');
    const dateIso = `${year}-${month}-${day}`;
    const hourPrefix = `${dateIso}T${hourStr}`;

    const timeLabel = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const isDay = hour >= 6 && hour < 18;
    return { dateIso, hourPrefix, hour, minute, timeLabel, isDay };
  } catch {
    // Robust UTC+5 fallback for Pakistan
    const now = new Date();
    const pkt = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const iso = pkt.toISOString(); // e.g. "2026-10-28T17:57:11.000Z"
    const dateIso = iso.slice(0, 10);
    const hourStr = iso.slice(11, 13);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(iso.slice(14, 16), 10);
    const hourPrefix = `${dateIso}T${hourStr}`;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const timeLabel = `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
    const isDay = hour >= 6 && hour < 18;
    return { dateIso, hourPrefix, hour, minute, timeLabel, isDay };
  }
}

/**
 * WMO Weather Interpretation Codes (WW)
 */
export function getWmoInfo(code: number, isDay: boolean): {
  condition: string;
  advisory: string;
  iconType: CurrentWeather['iconType'];
} {
  switch (code) {
    case 0:
      return {
        condition: isDay ? 'Clear Alpine Skies' : 'Clear Starlit Night',
        advisory: isDay
          ? 'Bright mountain sunshine. Crisp pine air; sunroom sitting is ideal.'
          : 'Cold alpine night. Electric blankets & hot Tapal tea recommended.',
        iconType: isDay ? 'sun' : 'moon',
      };
    case 1:
      return {
        condition: isDay ? 'Mainly Sunny' : 'Mostly Clear Sky',
        advisory: 'Pleasant mountain temperature. Great visibility across Gharial ridges.',
        iconType: isDay ? 'sun' : 'moon',
      };
    case 2:
      return {
        condition: isDay ? 'Partly Cloudy' : 'Partly Cloudy Night',
        advisory: 'Passing mountain clouds with mild mountain breeze.',
        iconType: isDay ? 'cloud-sun' : 'cloud-moon',
      };
    case 3:
      return {
        condition: 'Overcast Pine Ridge',
        advisory: 'Cool overcast mountain weather. Perfect for hot tea on the covered terrace.',
        iconType: 'cloud',
      };
    case 45:
    case 48:
      return {
        condition: 'Valley Mist & Fog',
        advisory: 'Atmospheric pine valley mist rolling through Gharial Camp. Drive carefully on hill roads.',
        iconType: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        condition: 'Light Mountain Drizzle',
        advisory: 'Gentle raindrops over pine needles. Lounge heaters and duvets provide cozy warmth.',
        iconType: 'drizzle',
      };
    case 56:
    case 57:
      return {
        condition: 'Freezing Mountain Drizzle',
        advisory: 'Near-freezing temperatures. Stay warm inside your heated luxury suite.',
        iconType: 'snow',
      };
    case 61:
    case 63:
    case 65:
      return {
        condition: code === 65 ? 'Heavy Mountain Rain' : 'Mountain Rain',
        advisory: 'Murree rain showers. Enjoy sound of rain from the vaulted wooden lounge.',
        iconType: 'rain',
      };
    case 66:
    case 67:
      return {
        condition: 'Freezing Rain & Sleet',
        advisory: 'Icy conditions at 7,200 ft. In-suite duvets and kettle station fully prepared.',
        iconType: 'snow',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        condition: code === 75 ? 'Heavy Alpine Snowfall' : 'Fresh Alpine Snowfall',
        advisory: 'Scenic white winter landscape across pine branches. Electric duvets active.',
        iconType: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        condition: 'Passing Rain Showers',
        advisory: 'Intermittent highland showers with clearing skies expected.',
        iconType: 'rain',
      };
    case 85:
    case 86:
      return {
        condition: 'Winter Snow Showers',
        advisory: 'Scattered snowfall flurries. Gharial Camp transforms into a snow paradise.',
        iconType: 'snow',
      };
    case 95:
    case 96:
    case 99:
      return {
        condition: 'Thunderstorm with Mountain Rain',
        advisory: 'Thunder over Himalayan foothills. Relax safely inside the stone retreat.',
        iconType: 'thunderstorm',
      };
    default:
      return {
        condition: 'Crisp Mountain Breeze',
        advisory: 'Pure alpine air at 7,200 ft elevation surrounded by pine woodlands.',
        iconType: isDay ? 'cloud-sun' : 'cloud-moon',
      };
  }
}

/**
 * Generate dynamic, time-aware fallback weather for Murree (Gharial Camp)
 * based strictly on the current wall-clock hour in Pakistan.
 */
export function getDynamicFallbackWeather(): LiveWeatherData {
  const murreeNow = getMurreeTime();
  const currentHour = murreeNow.hour;
  const isDay = murreeNow.isDay;

  // Realistic diurnal curve for Murree 7,200 ft (Peak 20-21°C at 2 PM, low 9-10°C at 5 AM)
  const getTempForHour = (h: number): number => {
    const normalized = Math.sin(((h - 8) / 24) * 2 * Math.PI);
    return Math.round(15 + normalized * 5.5);
  };

  const currentTemp = getTempForHour(currentHour);
  const wmo = getWmoInfo(1, isDay);

  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 8; i++) {
    const targetHour = (currentHour + i) % 24;
    const isDayHour = targetHour >= 6 && targetHour < 18;
    const hWmo = getWmoInfo(1, isDayHour);
    hourly.push({
      time: `+${i}h`,
      hour: i === 0 ? 'Now' : formatHour(targetHour),
      temperature: getTempForHour(targetHour),
      iconType: i === 0 ? wmo.iconType : hWmo.iconType,
      condition: i === 0 ? wmo.condition : hWmo.condition,
      precipitationProb: 0,
    });
  }

  const daily: DailyForecast[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
    daily.push({
      date: d.toISOString().slice(0, 10),
      dayName,
      maxTemp: 21,
      minTemp: 9,
      weatherCode: 0,
      condition: 'Clear Alpine Sky',
      iconType: 'sun',
      precipitationProb: i % 2 === 0 ? 0 : 5,
    });
  }

  return {
    current: {
      temperature: currentTemp,
      apparentTemperature: Math.max(currentTemp - 2, 0),
      humidity: isDay ? 48 : 58,
      windSpeed: 4.5,
      precipitation: 0,
      weatherCode: 1,
      isDay,
      condition: wmo.condition,
      advisory: wmo.advisory,
      iconType: wmo.iconType,
      highTemp: 21,
      lowTemp: 9,
      updatedAt: murreeNow.timeLabel,
      uvIndex: isDay ? 4 : 0,
      airQuality: 'Pristine Alpine Air (AQI 20)',
      visibilityKm: 18,
    },
    hourly,
    daily,
    location: 'Gharial Camp, Upper Topa, Murree',
    elevation: '7,200 Ft (2,195 m)',
    source: 'fallback',
    lastFetched: Date.now(),
  };
}

/**
 * Fetch real-time live weather for Velenburg Retreat (Gharial Camp, Murree)
 */
export async function fetchLiveMurreeWeather(forceRefresh = false): Promise<LiveWeatherData> {
  const murreeNow = getMurreeTime();

  // Check browser cache
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      // Clear legacy cache keys
      sessionStorage.removeItem('velenburg_live_weather_v1');

      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: LiveWeatherData = JSON.parse(cached);
        // Verify cache is within TTL AND start hour still matches current Pakistan hour
        const cacheStartHour = parsed.hourly?.[0]?.time ? parsed.hourly[0].time.slice(0, 13) : '';
        const isCurrentHour = cacheStartHour === murreeNow.hourPrefix || cacheStartHour.startsWith('+0h') || !cacheStartHour;

        if (Date.now() - parsed.lastFetched < CACHE_TTL_MS && isCurrentHour) {
          return parsed;
        }
      }
    } catch {
      // ignore storage error
    }
  }

  try {
    const lat = 33.9025;
    const lon = 73.4150;
    // Request current conditions, hourly (including is_day for accurate dusk/dawn icons), and daily forecast
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=Asia%2FKarachi`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();

    const curr = data.current;
    const isDay = Boolean(curr.is_day);
    const weatherCode = curr.weather_code ?? 0;
    const wmo = getWmoInfo(weatherCode, isDay);

    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyDates = data.daily?.time || [];
    const dailyPrecip = data.daily?.precipitation_probability_max || [];
    const uvMax = data.daily?.uv_index_max?.[0] ? Math.round(data.daily.uv_index_max[0]) : 4;

    const highTemp = dailyMax[0] !== undefined ? Math.round(dailyMax[0]) : Math.round(curr.temperature_2m);
    const lowTemp = dailyMin[0] !== undefined ? Math.round(dailyMin[0]) : Math.round(curr.temperature_2m - 7);

    // Extract next 8 hours in Pakistan local time
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
    const hourlyCodes: number[] = data.hourly?.weather_code || [];
    const hourlyPrecip: number[] = data.hourly?.precipitation_probability || [];
    const hourlyIsDay: number[] = data.hourly?.is_day || [];

    // Use current.time from Open-Meteo (which is in Asia/Karachi, e.g. "2026-10-28T17:45")
    // or murreeNow.hourPrefix ("2026-10-28T17")
    const targetHourPrefix = data.current?.time ? data.current.time.slice(0, 13) : murreeNow.hourPrefix;

    let startIdx = hourlyTimes.findIndex((t: string) => t.startsWith(targetHourPrefix));
    if (startIdx === -1) {
      // Find first upcoming hourly slot on or after the current hour
      startIdx = hourlyTimes.findIndex((t: string) => t >= targetHourPrefix);
    }
    if (startIdx === -1) {
      startIdx = 0;
    }

    const hourlyForecasts: HourlyForecast[] = [];
    for (let i = 0; i < 8; i++) {
      const idx = startIdx + i;
      if (idx < hourlyTimes.length) {
        const timeStr = hourlyTimes[idx];
        const rawHour = parseInt(timeStr.slice(11, 13), 10);
        const hourLabel = i === 0 ? 'Now' : formatHour(rawHour);
        const code = hourlyCodes[idx] ?? weatherCode;
        const isDayHour = hourlyIsDay[idx] !== undefined
          ? Boolean(hourlyIsDay[idx])
          : (rawHour >= 6 && rawHour < 18);
        const hWmo = getWmoInfo(code, isDayHour);

        hourlyForecasts.push({
          time: timeStr,
          hour: hourLabel,
          // "Now" uses live sensor reading; future hours use the forecasted hourly temp
          temperature: Math.round(i === 0 ? curr.temperature_2m : (hourlyTemps[idx] ?? curr.temperature_2m)),
          iconType: i === 0 ? wmo.iconType : hWmo.iconType,
          condition: i === 0 ? wmo.condition : hWmo.condition,
          precipitationProb: hourlyPrecip[idx] ?? 0,
        });
      }
    }

    const dailyForecasts: DailyForecast[] = [];
    const daysCount = Math.min(dailyDates.length, 7);

    for (let i = 0; i < daysCount; i++) {
      const dStr = dailyDates[i];
      let dayName = `Day ${i + 1}`;
      if (i === 0) dayName = 'Today';
      else if (i === 1) dayName = 'Tomorrow';
      else {
        try {
          // Append T12:00:00 to avoid UTC midnight date rollover
          const d = new Date(`${dStr}T12:00:00`);
          dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        } catch {
          // fallback
        }
      }

      const dCode = dailyCodes[i] ?? 0;
      const dWmo = getWmoInfo(dCode, true);

      dailyForecasts.push({
        date: dStr,
        dayName,
        maxTemp: Math.round(dailyMax[i] ?? highTemp),
        minTemp: Math.round(dailyMin[i] ?? lowTemp),
        weatherCode: dCode,
        condition: dWmo.condition,
        iconType: dWmo.iconType,
        precipitationProb: dailyPrecip[i] ?? 0,
      });
    }

    const liveResult: LiveWeatherData = {
      current: {
        temperature: Math.round(curr.temperature_2m * 10) / 10,
        apparentTemperature: Math.round(curr.apparent_temperature * 10) / 10,
        humidity: Math.round(curr.relative_humidity_2m),
        windSpeed: Math.round(curr.wind_speed_10m * 10) / 10,
        precipitation: curr.precipitation ?? 0,
        weatherCode,
        isDay,
        condition: wmo.condition,
        advisory: wmo.advisory,
        iconType: wmo.iconType,
        highTemp,
        lowTemp,
        updatedAt: murreeNow.timeLabel,
        uvIndex: uvMax,
        airQuality: 'Pristine Alpine Air (AQI 20)',
        visibilityKm: 18,
      },
      hourly: hourlyForecasts.length > 0 ? hourlyForecasts : getDynamicFallbackWeather().hourly,
      daily: dailyForecasts,
      location: 'Gharial Camp, Upper Topa, Murree',
      elevation: '7,200 Ft (2,195 m)',
      source: 'live',
      lastFetched: Date.now(),
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(liveResult));
      } catch {
        // ignore
      }
    }

    return liveResult;
  } catch (err) {
    console.warn('Velenburg Weather: Live fetch error, using graceful dynamic fallback', err);
    return getDynamicFallbackWeather();
  }
}
