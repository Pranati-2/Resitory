import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, ExternalLink, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LearningPath, Resource } from "@/lib/types";
import { getLearningPathById } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      case "article":
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
      default:
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
                  <Badge variant="outline" className={`${path.category === 'programming' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                                          path.category === 'design' ? 'bg-pink-50 text-pink-600 border-pink-200' : 
                                                          path.category === 'datascience' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                                          'bg-green-50 text-green-600 border-green-200'}`}>
                    {path.category.charAt(0).toUpperCase() + path.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={`${path.difficulty === 'beginner' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                                          path.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                                                          'bg-red-50 text-red-600 border-red-200'}`}>
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
                    {path.resources.map((resource, index) => (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            {getResourceIcon(resource.type)}
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-gray-900">{resource.title || `Resource ${index + 1}`}</h3>
                                <span className="text-xs font-medium text-gray-500 capitalize">{resource.type}</span>
                              </div>
                              {resource.description && (
                                <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
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
                
                <Button className="w-full mb-3">Start Learning</Button>
                
                <Button variant="outline" className="w-full flex items-center justify-center mb-4">
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
