import { useState, useEffect } from "react";
import { Resource } from "@/lib/types";
import { X, ExternalLink } from "lucide-react";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl, isYoutubeUrl } from "@/lib/metaFetcher";

interface ResourceItemProps {
  resource: Resource;
  onChange: (updatedResource: Partial<Resource>) => void;
  onRemove: () => void;
  isRemovable: boolean;
}

export default function ResourceItem({ resource, onChange, onRemove, isRemovable }: ResourceItemProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  useEffect(() => {
    // Reset thumbnail when URL changes
    setThumbnailUrl(null);
    
    // Check if URL is valid
    const isValid = Boolean(resource.url && resource.url.startsWith('http'));
    setIsUrlValid(isValid);

    // Generate thumbnail for YouTube videos
    if (isValid && resource.type === 'video' && isYoutubeUrl(resource.url)) {
      const videoId = extractYoutubeVideoId(resource.url);
      if (videoId) {
        setThumbnailUrl(getYoutubeThumbnailUrl(videoId));
      }
    }

    // For other resource types, we could add more previews in the future
    // This would typically be done through a server API to avoid CORS issues
  }, [resource.url, resource.type]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 resource-item border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resource Type</label>
              <select 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={resource.type}
                onChange={(e) => onChange({ type: e.target.value as Resource["type"] })}
              >
                <option value="video">Video (YouTube, Vimeo, etc.)</option>
                <option value="article">Article/Website</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                placeholder="Resource title"
                value={resource.title}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <div className="flex">
              <input 
                type="url" 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                placeholder="https://..."
                value={resource.url}
                onChange={(e) => onChange({ url: e.target.value })}
              />
              {isUrlValid && (
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </a>
              )}
            </div>
          </div>
          
          {/* Preview for YouTube videos */}
          {thumbnailUrl && (
            <div className="mt-2">
              <div className="relative pb-[56.25%] rounded-md overflow-hidden">
                <img 
                  src={thumbnailUrl} 
                  alt="Video thumbnail" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea 
              rows={2} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              placeholder="Brief description of this resource"
              value={resource.description}
              onChange={(e) => onChange({ description: e.target.value })}
            ></textarea>
          </div>
        </div>
        <button 
          type="button" 
          className={`ml-4 mt-4 flex-shrink-0 text-gray-500 hover:text-gray-700 ${!isRemovable ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onRemove}
          disabled={!isRemovable}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
