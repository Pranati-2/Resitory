import { useState, useEffect } from "react";
import { Resource, LearningPath } from "@/lib/types"; // Added LearningPath
import { X, ExternalLink } from "lucide-react";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl, isYoutubeUrl } from "@/lib/metaFetcher";
import { getLearningPaths } from "@/lib/storage"; // Added getLearningPaths

interface ResourceItemProps {
  resource: Resource;
  onChange: (updatedResource: Partial<Resource>) => void;
  onRemove: () => void;
  isRemovable: boolean;
  currentPathId?: string; // Optional: ID of the path being edited, to prevent self-linking
}

export default function ResourceItem({ resource, onChange, onRemove, isRemovable, currentPathId }: ResourceItemProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [existingPaths, setExistingPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    // Fetch existing paths for the 'learningPath' type dropdown
    const paths = getLearningPaths();
    // Filter out the current path being edited, if currentPathId is provided
    setExistingPaths(currentPathId ? paths.filter(p => p.id !== currentPathId) : paths);
  }, [currentPathId]); // Re-run if currentPathId changes (e.g. if component is re-used)


  useEffect(() => {
    // Reset thumbnail when URL or type changes
    setThumbnailUrl(null);
    
    if (resource.type === 'learningPath') {
      // For learningPath, URL is valid if it's a non-empty string (selected path ID)
      setIsUrlValid(Boolean(resource.url));
    } else {
      // For other types, check if URL is a valid http/https URL
      const isValidHttpUrl = Boolean(resource.url && resource.url.startsWith('http'));
      setIsUrlValid(isValidHttpUrl);

      // Generate thumbnail for YouTube videos
      if (isValidHttpUrl && resource.type === 'video' && isYoutubeUrl(resource.url)) {
        const videoId = extractYoutubeVideoId(resource.url);
        if (videoId) {
          setThumbnailUrl(getYoutubeThumbnailUrl(videoId));
        }
      }
    }
    // For other resource types, we could add more previews in the future
  }, [resource.url, resource.type]);

  const handleTypeChange = (newType: Resource["type"]) => {
    // When type changes to 'learningPath', clear URL and linkedPathPreview
    // When type changes from 'learningPath' to something else, clear linkedPathPreview
    // Keep title and description as they are generally useful
    if (newType === 'learningPath') {
      onChange({ type: newType, url: "", linkedPathPreview: undefined });
    } else {
      onChange({ type: newType, linkedPathPreview: undefined });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 resource-item border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="w-full space-y-4">
          {/* Row 1: Type and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resource Type</label>
              <select 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={resource.type}
                onChange={(e) => handleTypeChange(e.target.value as Resource["type"])}
              >
                <option value="website">Website</option>
                <option value="video">Video (YouTube, Vimeo, etc.)</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="learningPath">Other Learning Path</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {resource.type === 'learningPath' ? "Display Title for Linked Path" : "Title"}
              </label>
              <input 
                type="text" 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                placeholder={resource.type === 'learningPath' ? "Title for this link" : "Resource title"}
                value={resource.title}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>
          </div>
          
          {/* Row 2: Conditional UI based on type */}
          {resource.type === 'learningPath' ? (
            // UI for selecting a learning path
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Link to Existing Learning Path</label>
                <select
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={resource.url || ""} // resource.url stores the ID of the linked path
                  onChange={(e) => {
                    const selectedPathId = e.target.value;
                    const selectedPath = existingPaths.find(p => p.id === selectedPathId);
                    if (selectedPath) {
                      onChange({
                        url: selectedPath.id,
                        // Set resource title to linked path's title by default, user can override
                        title: resource.title || selectedPath.title, // Keep user's title if already set
                        linkedPathPreview: {
                          id: selectedPath.id,
                          title: selectedPath.title,
                          coverImage: selectedPath.coverImage,
                          category: selectedPath.category,
                          difficulty: selectedPath.difficulty,
                        }
                      });
                    } else {
                       // Option "Select a Learning Path" was chosen
                       onChange({ url: "", title: "", linkedPathPreview: undefined });
                    }
                  }}
                >
                  <option value="">Select a Learning Path</option>
                  {existingPaths.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              {/* Preview of the selected linked path */}
              {resource.linkedPathPreview && resource.url && (
                <div className="mt-2 p-3 border rounded-md bg-white shadow-sm">
                  <p className="text-sm font-semibold text-primary-600">Linked Path: {resource.linkedPathPreview.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{resource.linkedPathPreview.category?.charAt(0).toUpperCase() + resource.linkedPathPreview.category?.slice(1)}</span>
                    <span className="mx-1.5">|</span>
                    <span>{resource.linkedPathPreview.difficulty?.charAt(0).toUpperCase() + resource.linkedPathPreview.difficulty?.slice(1)}</span>
                  </div>
                  {resource.linkedPathPreview.coverImage && (
                     <img src={resource.linkedPathPreview.coverImage} alt={`Preview of ${resource.linkedPathPreview.title}`} className="mt-2 rounded-md max-h-20 object-cover"/>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Existing UI for other resource types
            <>
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
                  {isUrlValid && resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Open URL in new tab"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Preview for YouTube videos (only if type is 'video') */}
              {resource.type === 'video' && thumbnailUrl && (
                <div className="mt-2">
                  <div className="relative pb-[56.25%] rounded-md overflow-hidden"> {/* 16:9 Aspect Ratio */}
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
            </>
          )}
          
          {/* Row 3: Description (common to all types) */}
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
          aria-label="Remove resource"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
