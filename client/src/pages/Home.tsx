import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import CreatePathModal from "@/components/CreatePathModal";
import { LearningPath } from "@/lib/types";
import { searchLearningPaths } from "@/lib/search";
import { getLearningPaths } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'standard' | 'semantic'>('standard');

  useEffect(() => {
    // Fetch learning paths on component mount
    const paths = getLearningPaths();
    setLearningPaths(paths);
    setLoading(false);
  }, []);
  
  const performSemanticSearch = async (query: string) => {
    // In a real implementation, this would call an API with the Perplexity API
    // For now, we'll just use the standard search and show a toast message
    toast({
      title: "Semantic Search",
      description: "Searching for concepts related to: " + query,
    });
    
    // Simulating API call delay
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For this prototype, we'll use the standard search as a fallback
    const results = searchLearningPaths(query);
    setLoading(false);
    return results;
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      const paths = getLearningPaths();
      setLearningPaths(paths);
      return;
    }
    
    if (searchMode === 'semantic') {
      try {
        const results = await performSemanticSearch(query);
        setLearningPaths(results);
      } catch (error) {
        console.error("Semantic search error:", error);
        toast({
          title: "Search Error",
          description: "Semantic search is unavailable. Falling back to standard search.",
          variant: "destructive",
        });
        
        // Fallback to standard search
        const results = searchLearningPaths(query);
        setLearningPaths(results);
      }
    } else {
      // Standard search
      const results = searchLearningPaths(query);
      setLearningPaths(results);
    }
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
        searchMode={searchMode}
        onSearchModeChange={(mode) => setSearchMode(mode)}
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
