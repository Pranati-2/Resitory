import { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, Book, Compass, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onCreatePath: () => void;
  searchMode?: 'standard' | 'semantic';
  onSearchModeChange?: (mode: 'standard' | 'semantic') => void;
}

export default function SearchSection({ 
  onSearch, 
  onCreatePath, 
  searchMode: externalSearchMode, 
  onSearchModeChange 
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [customTabs, setCustomTabs] = useState<string[]>([]);
  const [showAddTabInput, setShowAddTabInput] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [internalSearchMode, setInternalSearchMode] = useState<'standard' | 'semantic'>(externalSearchMode || 'standard');
  const [showFilters, setShowFilters] = useState(false);
  
  // Use the external searchMode if provided, otherwise use internal state
  const searchMode = externalSearchMode || internalSearchMode;

  // Additional filter states
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  const defaultTabs = [
    { id: "all", name: "All Paths" },
    { id: "programming", name: "Programming" },
    { id: "datascience", name: "Data Science" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
  ];

  const difficultyOptions = ["beginner", "intermediate", "advanced"];

  const handleSearch = () => {
    // Pass the search query to the parent component
    if (searchQuery.trim()) {
      // Here we could include the search mode in the parent search handler
      // For now we're just passing the query
      onSearch(searchQuery);
    }
  };

  const handleAddCustomTab = () => {
    if (newTabName.trim() !== "") {
      setCustomTabs([...customTabs, newTabName.trim()]);
      setActiveTab(newTabName.trim().toLowerCase().replace(/\s+/g, '-'));
      setNewTabName("");
      setShowAddTabInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showAddTabInput) {
        handleAddCustomTab();
      } else {
        handleSearch();
      }
    }
  };

  const toggleDifficulty = (level: string) => {
    if (difficulty.includes(level)) {
      setDifficulty(difficulty.filter(d => d !== level));
    } else {
      setDifficulty([...difficulty, level]);
    }
  };
  
  // When filters change, update the search results
  useEffect(() => {
    if (activeTab !== 'all' || difficulty.length > 0 || rating !== null) {
      // In a real implementation, this would trigger a search with these parameters
      // For now, we're just using the simple search from the search box
      handleSearch();
    }
  }, [activeTab, difficulty, rating]);

  return (
    <section className="bg-white pt-8 pb-6 shadow-inner">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 space-x-6">
          <Link href="/" className="flex items-center text-gray-900 font-medium">
            <Compass className="h-5 w-5 mr-1" />
            Discover
          </Link>
          <Link href="/mypaths" className="flex items-center text-gray-500 hover:text-gray-900">
            <Book className="h-5 w-5 mr-1" />
            My Paths
          </Link>
          <Link href="/about" className="flex items-center text-gray-500 hover:text-gray-900">
            <User className="h-5 w-5 mr-1" />
            About
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find your perfect learning path</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-4">
          Discover curated learning paths using free resources from across the web
        </p>
        
        {/* Search Bar with Semantic Switch */}
        <div className="mt-6 relative">
          <div className="flex items-center rounded-full shadow-sm border border-gray-300 bg-white overflow-hidden">
            <div className="pl-4 pr-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="w-full py-3 pl-2 pr-3 text-gray-700 focus:outline-none" 
              placeholder="Search for learning paths, topics, or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center">
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <div className="flex items-center mr-2">
                <button 
                  className={`px-3 py-1 text-xs font-medium rounded-full mr-1 ${
                    searchMode === 'standard' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setInternalSearchMode('standard');
                    if (onSearchModeChange) {
                      onSearchModeChange('standard');
                    }
                  }}
                >
                  Standard
                </button>
                <button 
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    searchMode === 'semantic' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setInternalSearchMode('semantic');
                    if (onSearchModeChange) {
                      onSearchModeChange('semantic');
                    }
                  }}
                >
                  Semantic
                </button>
              </div>
              <button 
                className="bg-primary-500 text-white px-5 py-3 font-medium hover:bg-primary-600 transition duration-150 flex items-center"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Create Learning Path Button */}
          <div className="mt-4 text-center">
            <button 
              onClick={onCreatePath}
              className="inline-flex items-center text-primary-500 hover:text-primary-700 font-medium"
            >
              <Plus className="h-5 w-5 mr-1" />
              Create a Learning Path
            </button>
          </div>
        </div>
        
        {/* Advanced Filters Button */}
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Advanced Filters
          </Button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyOptions.map(level => (
                    <button
                      key={level}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        difficulty.includes(level)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleDifficulty(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                <div className="flex items-center gap-2">
                  {[4, 4.5, 5].map(r => (
                    <button
                      key={r}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        rating === r
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setRating(rating === r ? null : r)}
                    >
                      {r}+ ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
              {defaultTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
              
              {customTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                  className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.toLowerCase().replace(/\s+/g, '-')
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
              
              {showAddTabInput ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary-500 text-sm"
                    placeholder="Tab name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <button
                    onClick={handleAddCustomTab}
                    className="ml-2 text-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTabInput(true)}
                  className="whitespace-nowrap pb-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-600 hover:text-primary-500 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Custom Tab
                </button>
              )}
            </nav>
            
            <div className="flex items-center">
              <button type="button" className="text-gray-600 hover:text-gray-900">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
