import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import CreatePathModal from "@/components/CreatePathModal";
import { LearningPath } from "@/lib/types";
import { searchLearningPaths } from "@/lib/search";
import { getLearningPaths } from "@/lib/storage";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch learning paths on component mount
    const paths = getLearningPaths();
    setLearningPaths(paths);
    setLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchLearningPaths(query);
    setLearningPaths(results);
  };

  const handlePathCreated = (newPath: LearningPath) => {
    setLearningPaths((prev) => [newPath, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchSection 
        onSearch={handleSearch} 
        onCreatePath={() => setIsCreateModalOpen(true)} 
      />
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <ResultsSection 
          learningPaths={learningPaths} 
          totalResults={learningPaths.length} 
        />
      )}
      
      <Footer />
      
      <CreatePathModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onPathCreated={handlePathCreated}
      />
    </div>
  );
}
