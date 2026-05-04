// src/lib/youtube.ts

// Konversi berbagai format URL YouTube jadi embed URL
export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;

    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      videoId = u.searchParams.get("v");
      if (!videoId && u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.replace("/shorts/", "");
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

// Ambil thumbnail YouTube dari URL
export function getYoutubeThumbnail(url: string): string | null {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return null;
  const videoId = embedUrl.split("/embed/")[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
