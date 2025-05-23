import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, ExternalLink, Share2, Link as LinkIcon } from "lucide-react"; // Added LinkIcon
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LearningPath, Resource } from "@/lib/types";
import { getLearningPathById } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Helper functions for styling badges (similar to LearningPathCard)
const getCategoryColorClass = (category?: string) => {
  switch (category) {
    case "programming": return "bg-blue-50 text-blue-600 border-blue-200";
    case "design": return "bg-pink-50 text-pink-600 border-pink-200";
    case "datascience": return "bg-purple-50 text-purple-600 border-purple-200";
    case "business": return "bg-green-50 text-green-600 border-green-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const getDifficultyColorClass = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner": return "bg-blue-50 text-blue-600 border-blue-200";
    case "intermediate": return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "advanced": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

export default function PathPreview() {
  const [, params] = useRoute("/path/:id");
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.id) {
      const learningPath = getLearningPathById(params.id);
      setPath(learningPath);
      setLoading(false);
    }
  }, [params?.id]);

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "video":
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case "website": // Changed "article" to "website"
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        );
      case "pdf":
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case "image":
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      // No case for 'learningPath' here, as it's handled differently in the map
      default: // 'other'
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Path Not Found</h1>
          <p className="text-gray-600 mb-6">The learning path you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning Paths
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Path Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={getCategoryColorClass(path.category)}>
                    {path.category.charAt(0).toUpperCase() + path.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColorClass(path.difficulty)}>
                    {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{path.title}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{path.rating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{path.resources.length} resources</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{path.learners} learners</span>
                </div>
                
                <p className="text-gray-700 mb-6">{path.description}</p>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {path.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Learning Resources</h2>
                    <div className="text-sm text-gray-600">{path.resources.length} resources</div>
                  </div>
                  
                  <div className="space-y-4">
                    {path.resources.map((resource, index) => {
                      if (resource.type === 'learningPath' && resource.linkedPathPreview) {
                        const preview = resource.linkedPathPreview;
                        return (
                          <Link key={resource.id} href={`/path/${preview.id}`} className="block no-underline">
                            <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 border-primary-100 hover:border-primary-300 bg-primary-50/30">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {preview.coverImage && (
                                    <img 
                                      src={preview.coverImage} 
                                      alt={`Cover for ${preview.title}`} 
                                      className="w-20 h-20 object-cover rounded-md flex-shrink-0 border border-primary-200"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <LinkIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                                      <h3 className="text-base font-medium text-primary-700 group-hover:text-primary-800">
                                        {resource.title} {/* User-customized title */}
                                      </h3>
                                    </div>
                                    {resource.title !== preview.title && (
                                       <p className="text-xs text-gray-500 mb-1 italic">Original title: {preview.title}</p>
                                    )}
                                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{resource.description || 'View linked learning path details.'}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {preview.category && (
                                        <Badge variant="outline" className={`text-xs ${getCategoryColorClass(preview.category)}`}>
                                          {preview.category.charAt(0).toUpperCase() + preview.category.slice(1)}
                                        </Badge>
                                      )}
                                      {preview.difficulty && (
                                        <Badge variant="outline" className={`text-xs ${getDifficultyColorClass(preview.difficulty)}`}>
                                          {preview.difficulty.charAt(0).toUpperCase() + preview.difficulty.slice(1)}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      } else {
                        // Existing resource rendering logic
                        return (
                          <Card key={resource.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col space-y-4">
                                {/* Show YouTube video thumbnails */}
                                {resource.type === 'video' && resource.url && resource.url.includes('youtube') && (
                                  <div className="w-full relative rounded-md overflow-hidden">
                                    <div className="pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                      {(() => {
                                        const videoIdMatch = resource.url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                                        const videoId = videoIdMatch ? videoIdMatch[1] : null;
                                        return videoId && (
                                          <img 
                                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                            alt={resource.title || "Video thumbnail"}
                                            className="absolute inset-0 w-full h-full object-cover"
                                          />
                                        );
                                      })()}
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
                                
                                {/* Image resource preview */}
                                {resource.type === 'image' && resource.url && (
                                  <div className="w-full rounded-md overflow-hidden max-h-48">
                                    <img 
                                      src={resource.url}
                                      alt={resource.title || "Image resource"}
                                      className="w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'; // Hide if image fails to load
                                      }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex items-start">
                                  {getResourceIcon(resource.type)}
                                  <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-base font-medium text-gray-900">{resource.title || `Resource ${index + 1}`}</h3>
                                      <span className="text-xs font-medium text-gray-500 capitalize">{resource.type}</span>
                                    </div>
                                    {resource.description && (
                                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                                    )}
                                    <div className="mt-2">
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                                      >
                                        Open Resource
                                        <ExternalLink className="h-4 w-4 ml-1" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Sidebar (remains unchanged) */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">About this path</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(path.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resources</span>
                      <span className="text-sm font-medium text-gray-900">{path.resources.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Level</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{path.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-3"
                  onClick={() => {
                    if (path.resources.length > 0 && path.resources[0].type !== 'learningPath') {
                      window.open(path.resources[0].url, '_blank');
                    } else if (path.resources.length > 0 && path.resources[0].type === 'learningPath' && path.resources[0].linkedPathPreview) {
                       // For a linked path, perhaps navigate to its preview page on the site
                       // Or, if it has its own resources, the first one.
                       // For now, let's assume we don't auto-open linked paths this way.
                       console.log("Start Learning clicked on a linked path resource.");
                    }
                  }}
                  // Disable if first resource is a linked path, as "Start Learning" implies external content
                  disabled={path.resources.length > 0 && path.resources[0].type === 'learningPath'} 
                >
                  Start Learning
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center mb-4"
                  onClick={() => {
                    const shareUrl = window.location.href;
                    if (navigator.share) {
                      navigator.share({
                        title: path.title,
                        text: `Check out this learning path: ${path.title}`,
                        url: shareUrl,
                      }).catch(err => {
                        console.error('Error sharing:', err);
                        navigator.clipboard.writeText(shareUrl)
                          .then(() => alert('Link copied to clipboard!'))
                          .catch(e => console.error('Could not copy link:', e));
                      });
                    } else {
                      navigator.clipboard.writeText(shareUrl)
                        .then(() => alert('Link copied to clipboard!'))
                        .catch(e => console.error('Could not copy link:', e));
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Path
                </Button>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This learning path contains only links to freely available resources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
