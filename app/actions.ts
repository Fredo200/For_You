
"use server";

import { getCoordinates, getWeather } from "@/lib/weather";

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expires: number }>();

function getCached(key: string) {
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

function setCache(key: string, data: any, ttlMs: number) {
    cache.set(key, { data, expires: Date.now() + ttlMs });
}

export async function getCityDescription(city: string) {
    const cacheKey = `desc:${city}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
        );
        if (!response.ok) return null;
        const data = await response.json();
        const description = data.extract;
        setCache(cacheKey, description, 60 * 60 * 1000); // 1 hour
        return description;
    } catch (error) {
        return null;
    }
}

export async function getCityImages(city: string) {
    const cacheKey = `images:${city}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(city)}&gimlimit=10&prop=imageinfo&iiprop=url&format=json&origin=*`
        );

        if (!response.ok) return [];
        const mediaData = await response.json();
        const pages = mediaData.query?.pages;

        if (!pages) return [];

        const images = Object.values(pages)
            .map((page: any) => page.imageinfo?.[0]?.url)
            .filter((url: string) => {
                if (!url) return false;
                const lowerUrl = url.toLowerCase();

                // 1. Must be a JPEG (photos are usually jpg)
                if (!lowerUrl.endsWith('.jpg') && !lowerUrl.endsWith('.jpeg')) return false;

                // 2. Filter out bad keywords
                const badKeywords = [
                    'map', 'locator', 'location', 'flag', 'coat_of_arms', 'coatofarms',
                    'icon', 'logo', 'symbol', 'diagram', 'chart', 'population',
                    'stub', 'template', 'commons-logo', 'ambox', 'padlock', 'regions'
                ];

                return !badKeywords.some(keyword => lowerUrl.includes(keyword));
            })
            .slice(0, 3);

        setCache(cacheKey, images, 60 * 60 * 1000); // 1 hour
        return images;
    } catch (error) {
        return [];
    }
}

export async function getCityVideoId(city: string) {
    const cacheKey = `video:${city}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const fallbacks: { [key: string]: string } = {
            "London": "45ETZ1xvHS0",
            "Paris": "3u72H83x14Y",
            "Tokyo": "53_eVd1k3_0",
            "New York": "MtCMtC50gwY",
            "Dubai": "IdejM6wCkxA",
            "Nairobi": "M63U4L5N688", // Updated: Cinematic Nairobi
            "Sydney": "61e3F2m00A",
            "Rome": "EsFheWkimsU",
            "Berlin": "hK076Z38fW0",
            "Madrid": "tx_h2aF_rE",
            "Barcelona": "N3d1d1z5K38",
            "Amsterdam": "OpqT1q5q3qY",
            "Toronto": "rXK_fRZS1k",
            "Vancouver": "P1u_Zz5w3w",
            "San Francisco": "h_apb3252aA",
            "Los Angeles": "yJ-lcdMNdAk",
            "Chicago": "s-FbT6VpeIo",
            "Miami": "kfbJJRdJPPI",
            "Las Vegas": "WJRoLLV2KQg",
            "Hawaii": "6bLMuHWGFQo",
            "Hong Kong": "u27baSnhJus",
            "Singapore": "xWx6GFZ6YQE",
            "Bangkok": "Vn1dHqVLqxs",
            "Seoul": "ExN9qPCKTdg",
            "Mumbai": "ygXxZS3cZqM",
            "Delhi": "VuPJGWlTHhY"
        };

        // Use a known good video "Cinematic World" as the ultimate fallback
        const DEFAULT_VIDEO = "h_apb3252aA";

        // Check strict fallbacks
        for (const [key, value] of Object.entries(fallbacks)) {
            if (city.toLowerCase().includes(key.toLowerCase())) {
                setCache(cacheKey, value, 24 * 60 * 60 * 1000); // 24 hours
                return value;
            }
        }

        // Return default video instead of slow scraping
        setCache(cacheKey, DEFAULT_VIDEO, 24 * 60 * 60 * 1000);
        return DEFAULT_VIDEO;
    } catch (error) {
        return "h_apb3252aA";
    }
}

export async function getCityNews(city: string) {
    try {
        const response = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(city + " local news")}&hl=en-US&gl=US&ceid=US:en`);
        const xml = await response.text();

        // Simple regex parser for RSS items
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
            const content = match[1];
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const linkMatch = content.match(/<link>(.*?)<\/link>/);
            const pubDateMatch = content.match(/<pubDate>(.*?)<\/pubDate>/);
            const sourceMatch = content.match(/<source[^>]*>(.*?)<\/source>/);

            if (titleMatch && linkMatch) {
                items.push({
                    title: titleMatch[1].replace("<![CDATA[", "").replace("]]>", ""),
                    link: linkMatch[1],
                    pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toLocaleDateString() : "",
                    source: sourceMatch ? sourceMatch[1] : "Google News"
                });
            }
        }
        return items;
    } catch (error) {
        return [];
    }
}

export async function getCityTravelData(city: string) {
    try {
        const response = await fetch(
            `https://en.wikivoyage.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(city)}`
        );
        if (!response.ok) return null;

        const data = await response.json();
        const sections = data.remaining.sections;

        const relevantSections = ["See", "Do", "Buy", "Eat", "Drink", "Sleep"];
        const travelData: { [key: string]: string } = {};

        // Helper to strip HTML tags
        const stripHtml = (html: string) => {
            return html.replace(/<[^>]*>?/gm, "")
                .replace(/\[\d+\]/g, "") // Remove reference numbers like [1]
                .trim();
        };

        sections.forEach((section: any) => {
            if (relevantSections.includes(section.line)) {
                // Get the first few identifiable items/paragraphs to keep it concise
                // We'll just take the raw text and let the frontend truncate or display nicely
                // Or better, let's try to extract list items if possible, or just the text
                travelData[section.line] = stripHtml(section.text).substring(0, 500) + "...";
            }
        });

        return travelData;
    } catch (error) {
        return null;
    }
}


export async function getWeatherAction(city: string) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return { success: true, data: cached };

    try {
        const coords = await getCoordinates(city);
        const data = await getWeather(coords.latitude, coords.longitude);
        const description = await getCityDescription(coords.name);

        const [images, videoId, news, travel] = await Promise.all([
            getCityImages(coords.name),
            getCityVideoId(coords.name),
            getCityNews(coords.name),
            getCityTravelData(coords.name)
        ]);

        const result = {
            ...data,
            cityName: coords.name,
            country: coords.country,
            description,
            images,
            videoId,
            news,
            travel
        };

        setCache(cacheKey, result, 10 * 60 * 1000); // 10 minutes

        return {
            success: true,
            data: result,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to fetch weather data",
        };
    }
}

export async function getCitySuggestions(query: string) {
    if (!query || query.length < 2) return [];

    const cacheKey = `suggestions:${query.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        if (!response.ok) return [];
        const data = await response.json();
        const suggestions = data.results || [];

        setCache(cacheKey, suggestions, 60 * 60 * 1000); // 1 hour
        return suggestions;
    } catch (error) {
        return [];
    }
}
