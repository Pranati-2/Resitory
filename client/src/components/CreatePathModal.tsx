import { useState, useRef, useEffect } from "react";
import { X, Info } from "lucide-react";
import ResourceItem from "./ResourceItem";
import { LearningPath, Resource, ResourceType } from "@/lib/types";
import { saveLearningPath } from "@/lib/storage";

interface CreatePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathCreated: (path: LearningPath) => void;
}

export default function CreatePathModal({ isOpen, onClose, onPathCreated }: CreatePathModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      type: "website",
      title: "",
      url: "",
      description: "",
    },
  ]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [category, setCategory] = useState("programming");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setCurrentStep(1);
      setTitle("");
      setDescription("");
      setDifficulty("beginner");
      setCategory("programming");
      setTags("");
      setCoverImage("");
      setResources([
        {
          id: "1",
          type: "website",
          title: "",
          url: "",
          description: "",
        },
      ]);
    }
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const addResource = () => {
    setResources([
      ...resources,
      {
        id: String(Date.now()),
        type: "website" as ResourceType,
        title: "",
        url: "",
        description: "",
      },
    ]);
  };

  const removeResource = (id: string) => {
    if (resources.length > 1) {
      setResources(resources.filter((resource) => resource.id !== id));
    }
  };

  const updateResource = (id: string, updatedResource: Partial<Resource>) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, ...updatedResource } : resource
      )
    );
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handlePublish = () => {
    const newPath: LearningPath = {
      id: String(Date.now()),
      title,
      description,
      category,
      difficulty,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      coverImage: coverImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      resources,
      createdAt: new Date().toISOString(),
      rating: 4.8,
      learners: 0
    };

    saveLearningPath(newPath);
    onPathCreated(newPath);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full" ref={modalRef}>
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button 
              type="button" 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress steps */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create Learning Path</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
                    <div className="ml-4 flex space-x-1">
                      <div className={`h-2 w-8 rounded ${currentStep >= 1 ? "bg-primary-500" : "bg-gray-200"}`}></div>
                      <div className={`h-2 w-8 rounded ${currentStep >= 2 ? "bg-primary-500" : "bg-gray-200"}`}></div>
                      <div className={`h-2 w-8 rounded ${currentStep >= 3 ? "bg-primary-500" : "bg-gray-200"}`}></div>
                    </div>
                  </div>
                </div>
                
                {/* Step 1: Basic Information */}
                <div className={`space-y-6 ${currentStep === 1 ? "" : "hidden"}`}>
                  <div>
                    <label htmlFor="pathTitle" className="block text-sm font-medium text-gray-700">Learning Path Title</label>
                    <input 
                      type="text" 
                      name="pathTitle" 
                      id="pathTitle" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                      placeholder="e.g., Complete JavaScript Development"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pathDescription" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      id="pathDescription" 
                      name="pathDescription" 
                      rows={3} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                      placeholder="Describe what learners will achieve with this learning path"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                      <select 
                        id="difficulty" 
                        name="difficulty" 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                      <select 
                        id="category" 
                        name="category" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="datascience">Data Science</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      name="tags" 
                      id="tags" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                      placeholder="e.g., javascript, frontend, web development"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image URL (optional)</label>
                    <input 
                      type="url" 
                      name="coverImage" 
                      id="coverImage" 
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Need to create an image? Try <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Canva</a>.
                    </p>
                  </div>
                </div>
                
                {/* Step 2: Add Resources */}
                <div className={`space-y-6 ${currentStep === 2 ? "" : "hidden"}`}>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Repository doesn't store content. Add links to free resources like YouTube videos, websites, PDFs, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-medium text-gray-900">Resources</h4>
                      <button 
                        type="button" 
                        onClick={addResource}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Resource
                      </button>
                    </div>
                    
                    {/* Resource Items */}
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <ResourceItem
                          key={resource.id}
                          resource={resource}
                          onChange={(updatedResource) => updateResource(resource.id, updatedResource)}
                          onRemove={() => removeResource(resource.id)}
                          isRemovable={resources.length > 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Step 3: Review */}
                <div className={`space-y-6 ${currentStep === 3 ? "" : "hidden"}`}>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Learning Path Preview</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Title</span>
                        <p className="text-base text-gray-900">{title || "Complete JavaScript Development"}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Description</span>
                        <p className="text-sm text-gray-700">{description || "A comprehensive learning path to master JavaScript from basics to advanced concepts and frameworks."}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Difficulty</span>
                          <p className="text-sm text-gray-700">
                            {difficulty === "beginner" ? "Beginner" : difficulty === "intermediate" ? "Intermediate" : "Advanced"}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500">Category</span>
                          <p className="text-sm text-gray-700">
                            {category === "programming" ? "Programming" : 
                             category === "design" ? "Design" : 
                             category === "datascience" ? "Data Science" : 
                             category === "business" ? "Business" : "Other"}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Tags</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tags
                            ? tags.split(',').map((tag, index) => 
                                tag.trim() && (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {tag.trim()}
                                  </span>
                                )
                              )
                            : ["javascript", "frontend", "web development"].map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Resources ({resources.length})</h5>
                      <div className="space-y-3">
                        {resources.map((resource) => (
                          <div key={resource.id} className="bg-white p-3 rounded border border-gray-200 flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded flex items-center justify-center">
                              <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{resource.title || "Resource Title"}</p>
                              <p className="text-xs text-gray-500">
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} - {resource.url || "URL"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          By publishing this learning path, you confirm that it only contains links to publicly available resources.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal footer with action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={() => goToStep(currentStep + 1)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handlePublish}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Publish Learning Path
              </button>
            )}
            
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={() => goToStep(currentStep - 1)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Previous
              </button>
            )}
            
            <button 
              type="button" 
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
