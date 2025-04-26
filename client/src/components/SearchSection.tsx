import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onCreatePath: () => void;
}

export default function SearchSection({ onSearch, onCreatePath }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [customTabs, setCustomTabs] = useState<string[]>([]);
  const [showAddTabInput, setShowAddTabInput] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  const defaultTabs = [
    { id: "all", name: "All Paths" },
    { id: "programming", name: "Programming" },
    { id: "datascience", name: "Data Science" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
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
      handleAddCustomTab();
    }
  };

  return (
    <section className="bg-white pt-8 pb-6 shadow-inner">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find your perfect learning path</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-4">
          Discover curated learning paths using free resources from across the web
        </p>
        
        {/* Search Bar */}
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button 
              className="bg-primary-500 text-white px-5 py-3 font-medium hover:bg-primary-600 transition duration-150 flex items-center"
              onClick={handleSearch}
            >
              Search
            </button>
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
