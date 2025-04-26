import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Book, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningPath } from "@/lib/types";
import { getLearningPaths } from "@/lib/storage";
import LearningPathCard from "@/components/LearningPathCard";
import CreatePathModal from "@/components/CreatePathModal";

export default function MyPaths() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [myPaths, setMyPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch only paths created by the current user
    // For this demo, we'll just show all paths
    const paths = getLearningPaths();
    setMyPaths(paths);
    setLoading(false);
  }, []);

  const handlePathCreated = (newPath: LearningPath) => {
    setMyPaths((prev) => [newPath, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Book className="h-6 w-6 text-primary-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">My Learning Paths</h1>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Path
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {myPaths.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths yet</h3>
                  <p className="text-gray-600 mb-4">Create your first learning path to share knowledge with others.</p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Learning Path
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myPaths.map((path) => (
                    <LearningPathCard key={path.id} path={path} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      <CreatePathModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onPathCreated={handlePathCreated}
      />
    </div>
  );
}