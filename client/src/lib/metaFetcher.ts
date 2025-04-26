import axios from 'axios';

/**
 * Extract YouTube video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  // Regular expression to match YouTube URLs and extract video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Get YouTube video thumbnail URL
 */
export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Determine if a URL is from YouTube
 */
export function isYoutubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Extract website metadata from URL using an API (this is a mock for now)
 * In a real application, you would need a backend service to fetch the metadata
 */
export async function getWebsiteMetadata(url: string) {
  try {
    // This is a mock response - in a real app, you'd fetch this from a server
    return {
      title: "Website Title",
      description: "Website description would appear here",
      image: "https://via.placeholder.com/300x150",
      url: url
    };
  } catch (error) {
    console.error("Error fetching website metadata:", error);
    return null;
  }
}

/**
 * Get metadata for a resource based on its type and URL
 */
export function getResourcePreviewData(type: string, url: string) {
  if (type === 'video' && isYoutubeUrl(url)) {
    const videoId = extractYoutubeVideoId(url);
    if (videoId) {
      return {
        thumbnailUrl: getYoutubeThumbnailUrl(videoId),
        videoId
      };
    }
  }
  
  return null;
}