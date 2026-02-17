const city = "Nairobi";
const url = `https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(city)}&gimlimit=10&prop=imageinfo&iiprop=url&format=json&origin=*`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        const pages = data.query?.pages;
        if (!pages) {
            console.log("No pages found");
            return;
        }
        const images = Object.values(pages)
            .map(page => page.imageinfo?.[0]?.url)
            .filter(url => {
                if (!url) return false;
                const lowerUrl = url.toLowerCase();
                return lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg');
            });
        console.log("Images found:", images);
    })
    .catch(err => console.error("Error:", err));
