
"use client";



import { useState, useEffect } from "react";
import { getWeatherAction } from "@/app/actions";
import { weatherCodeToDescription } from "@/lib/weather";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function WeatherDashboard() {
    const [city, setCity] = useState("Nairobi");
    const [inputValue, setInputValue] = useState("");
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [showNews, setShowNews] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [time, setTime] = useState<string>("");

    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const fetchWeather = async (cityName: string) => {
        setLoading(true);
        setError("");
        setShowDescription(false);
        try {
            const result = await getWeatherAction(cityName);
            if (result.success) {
                setWeather(result.data);
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    // Update time every second based on weather timezone
    useEffect(() => {
        if (!weather?.timezone) return;

        const updateTime = () => {
            const date = new Date();
            const timeString = date.toLocaleTimeString("en-US", {
                timeZone: weather.timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            setTime(timeString);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [weather]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setCity(inputValue);
            fetchWeather(inputValue);
        }
    };

    const isDark = theme === 'dark';

    // Dynamic Classes
    const containerClass = isDark
        ? "min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-4 sm:p-8 text-white transition-colors duration-500"
        : "min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-4 sm:p-8 text-slate-800 transition-colors duration-500";

    const cardClass = isDark
        ? "rounded-3xl bg-white/10 p-6 sm:p-8 backdrop-blur-md border border-white/5 transition-all duration-300"
        : "rounded-3xl bg-white/60 p-6 sm:p-8 backdrop-blur-md border border-white/40 shadow-xl shadow-blue-900/5 transition-all duration-300";

    const inputClass = isDark
        ? "w-full rounded-full border-0 bg-white/20 px-6 py-4 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
        : "w-full rounded-full border-0 bg-white/60 px-6 py-4 text-slate-800 placeholder-slate-500 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-inner";

    const buttonPrimaryClass = isDark
        ? "rounded-full bg-white px-8 py-4 font-semibold text-indigo-900 transition hover:bg-opacity-90 disabled:opacity-50"
        : "rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20";

    const badgeClass = isDark
        ? "mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-sm"
        : "mt-2 inline-block rounded-full bg-blue-600/10 px-4 py-1 text-sm font-medium text-blue-700 backdrop-blur-sm";

    const secondaryTextClass = isDark ? "opacity-80" : "text-slate-600";
    const mutedTextClass = isDark ? "opacity-60" : "text-slate-500";

    const newsCardClass = isDark
        ? "block rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
        : "block rounded-xl bg-white/50 p-4 transition hover:bg-white/80 border border-white/40 shadow-sm";

    return (
        <div className={containerClass}>
            <div className={`mx-auto transition-all duration-500 ${showNews ? 'max-w-7xl' : 'max-w-3xl'}`}>

                {/* Header Controls */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-4">
                        <input
                            type="text"
                            placeholder="Search city..."
                            className={inputClass}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonPrimaryClass}
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </form>

                    <div className="flex gap-2">
                        {/* Toggle Theme Button */}
                        <button
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            className={`rounded-full p-4 transition ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-white/60 hover:bg-white/80 text-blue-600 shadow-sm'}`}
                            aria-label="Toggle Theme"
                        >
                            {isDark ? "☀️" : "🌙"}
                        </button>

                        {/* Toggle News Button */}
                        <button
                            onClick={() => setShowNews(!showNews)}
                            className={`rounded-full px-6 py-4 font-semibold transition flex items-center gap-2 ${showNews
                                ? (isDark ? 'bg-white text-indigo-900' : 'bg-blue-600 text-white shadow-lg')
                                : (isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white/60 hover:bg-white/80 text-slate-700 shadow-sm')}`}
                        >
                            {showNews ? "Hide News" : "📰 Trending News"}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={() => logout()}
                            className={`rounded-full p-4 transition ${isDark ? 'bg-white/10 hover:bg-red-500/20 text-red-200' : 'bg-white/60 hover:bg-red-100 text-red-500 shadow-sm'}`}
                            title="Log Out"
                        >
                            🚪
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/20 p-4 text-center backdrop-blur-md border border-red-500/20 text-red-100">
                        {error}
                    </div>
                )}

                {loading || authLoading ? (
                    <WeatherSkeleton isDark={isDark} showNews={showNews} />
                ) : (
                    weather && weather.current && (
                        <div className={`grid grid-cols-1 gap-6 transition-all duration-500 ${showNews ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>

                            {/* Main Weather Card */}
                            <div className={`${showNews ? 'lg:col-span-2' : ''}`}>
                                <div className={cardClass}>
                                    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold sm:text-4xl">{weather.cityName}</h1>
                                            <p className={`text-lg ${secondaryTextClass}`}>{weather.country}</p>
                                            <div className="flex items-center gap-3">
                                                <div className={badgeClass}>
                                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                {time && (
                                                    <div className={`mt-2 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${isDark ? 'bg-indigo-500/30 text-indigo-200' : 'bg-blue-100 text-blue-700'}`}>
                                                        🕒 {time}
                                                    </div>
                                                )}
                                            </div>
                                            {weather.description && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setShowDescription(!showDescription)}
                                                        className={`text-sm font-semibold underline underline-offset-4 focus:outline-none ${isDark ? 'decoration-white/50 hover:decoration-white' : 'decoration-blue-400/50 hover:decoration-blue-600 text-blue-700'}`}
                                                    >
                                                        {showDescription ? "Show less" : `More about ${weather.cityName}`}
                                                    </button>
                                                    {showDescription && (
                                                        <div className="mt-4 space-y-6">
                                                            <p className={`max-w-lg text-sm leading-relaxed ${secondaryTextClass}`}>
                                                                {weather.description}
                                                            </p>

                                                            {weather.images && weather.images.length > 0 && (
                                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                                    {weather.images.map((img: string, i: number) => (
                                                                        <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-black/10">
                                                                            <img src={img} alt={`${weather.cityName} ${i + 1}`} className="h-full w-full object-cover" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/20">
                                                                <iframe
                                                                    width="100%"
                                                                    height="100%"
                                                                    src={`https://www.youtube.com/embed/${weather.videoId || "h_apb3252aA"}?autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1`}
                                                                    title="City Video"
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left md:text-right">
                                            <div className="text-4xl font-black sm:text-6xl">
                                                {Math.round(weather.current.temperature_2m)}°
                                                <span className={`text-2xl font-normal sm:text-4xl ${mutedTextClass}`}> {weather.daily && weather.daily.temperature_2m_max ? `${weather.daily.temperature_2m_max[0]}° / ${weather.daily.temperature_2m_min[0]}°` : ''}</span>
                                            </div>
                                            <p className="mt-2 text-xl font-medium">{weatherCodeToDescription(weather.current.weather_code)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <WeatherStat label="Humidity" value={`${weather.current.relative_humidity_2m}%`} isDark={isDark} />
                                        <WeatherStat label="Wind" value={`${weather.current.wind_speed_10m} km/h`} isDark={isDark} />
                                        <WeatherStat label="Feels Like" value={`${Math.round(weather.current.apparent_temperature)}°`} isDark={isDark} />
                                        <WeatherStat label="Precipitation" value={`${weather.current.precipitation} mm`} isDark={isDark} />
                                    </div>
                                </div>
                            </div>

                            {/* News Column (Conditionally Rendered) */}
                            {showNews && (
                                <div className="lg:col-span-1 animate-in fade-in slide-in-from-right duration-300">
                                    <div className={`${cardClass} h-full`}>
                                        <h3 className="mb-6 text-xl font-bold flex items-center gap-2">
                                            <span>🗞️</span> Trending in {weather.cityName}
                                        </h3>

                                        {weather.news && weather.news.length > 0 ? (
                                            <div className="space-y-3">
                                                {weather.news.map((item: any, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={newsCardClass}
                                                    >
                                                        <p className={`mb-1 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-300' : 'text-blue-600'}`}>
                                                            {item.source}
                                                        </p>
                                                        <h4 className={`font-medium leading-snug hover:underline ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {item.title}
                                                        </h4>
                                                        <p className={`mt-2 text-xs ${mutedTextClass}`}>{item.pubDate}</p>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex h-40 items-center justify-center rounded-xl bg-black/5">
                                                <p className={mutedTextClass}>No trending news available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

function WeatherStat({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
    return (
        <div className={`rounded-2xl p-4 text-center backdrop-blur-sm transition hover:scale-105 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70 shadow-sm'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'opacity-70' : 'text-slate-500'}`}>{label}</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
}

function WeatherSkeleton({ isDark, showNews }: { isDark: boolean; showNews: boolean }) {
    const shimmerClass = isDark ? "bg-white/10" : "bg-white/40";
    const cardClass = isDark
        ? "rounded-3xl bg-white/5 p-6 sm:p-8 backdrop-blur-md border border-white/5"
        : "rounded-3xl bg-white/40 p-6 sm:p-8 backdrop-blur-md border border-white/40 shadow-xl shadow-blue-900/5";

    return (
        <div className={`grid grid-cols-1 gap-6 ${showNews ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            <div className={`${showNews ? 'lg:col-span-2' : ''}`}>
                <div className={cardClass}>
                    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-pulse">
                        <div className="space-y-3">
                            <div className={`h-10 w-48 rounded-lg ${shimmerClass}`} />
                            <div className={`h-6 w-32 rounded-lg ${shimmerClass}`} />
                            <div className={`h-6 w-24 rounded-full ${shimmerClass}`} />
                        </div>
                        <div className="flex flex-col items-start gap-3 md:items-end">
                            <div className={`h-16 w-32 rounded-lg ${shimmerClass}`} />
                            <div className={`h-6 w-24 rounded-lg ${shimmerClass}`} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-pulse">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-24 rounded-2xl ${shimmerClass}`} />
                        ))}
                    </div>
                </div>
            </div>

            {showNews && (
                <div className="lg:col-span-1">
                    <div className={`${cardClass} h-full`}>
                        <div className={`mb-6 h-8 w-40 rounded-lg animate-pulse ${shimmerClass}`} />
                        <div className="space-y-3 animate-pulse">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-24 rounded-xl ${shimmerClass}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
