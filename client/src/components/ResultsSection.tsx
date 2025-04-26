import { useState, useEffect } from "react";
import { X, Filter, Book, ArrowUp, ArrowDown } from "lucide-react";
import LearningPathCard from "./LearningPathCard";
import { LearningPath } from "@/lib/types";
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sortLearningPaths } from "@/lib/search";

interface ResultsSectionProps {
  learningPaths: LearningPath[];
  totalResults: number;
}

export default function ResultsSection({ learningPaths, totalResults }: ResultsSectionProps) {
  const [filters, setFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("relevance");
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>(learningPaths);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Filter options
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  
  // Available filter options
  const categories = ["programming", "design", "datascience", "business"];
  const difficulties = ["beginner", "intermediate", "advanced"];
  const ratings = [3, 4, 4.5, 5];

  useEffect(() => {
    let result = [...learningPaths];
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(path => selectedCategories.includes(path.category));
    }
    
    // Apply difficulty filters
    if (selectedDifficulties.length > 0) {
      result = result.filter(path => selectedDifficulties.includes(path.difficulty));
    }
    
    // Apply rating filter
    if (minRating !== null) {
      result = result.filter(path => path.rating >= minRating);
    }
    
    // Apply sorting
    result = sortLearningPaths(result, sortOption as any);
    
    setFilteredPaths(result);
    
    // Generate filter tags
    const newFilters: string[] = [];
    
    selectedCategories.forEach(cat => {
      newFilters.push(`Category: ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    });
    
    selectedDifficulties.forEach(diff => {
      newFilters.push(`Level: ${diff.charAt(0).toUpperCase() + diff.slice(1)}`);
    });
    
    if (minRating !== null) {
      newFilters.push(`Rating: ${minRating}+ stars`);
    }
    
    if (sortOption !== 'relevance') {
      newFilters.push(`Sort: ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`);
    }
    
    setFilters(newFilters);
    
  }, [learningPaths, selectedCategories, selectedDifficulties, minRating, sortOption]);

  const removeFilter = (filter: string) => {
    // Extract filter type and value
    const filterParts = filter.split(': ');
    if (filterParts.length === 2) {
      const [filterType, filterValue] = filterParts;
      
      switch (filterType) {
        case 'Category':
          setSelectedCategories(prev => 
            prev.filter(cat => cat.toLowerCase() !== filterValue.toLowerCase())
          );
          break;
        case 'Level':
          setSelectedDifficulties(prev => 
            prev.filter(diff => diff.toLowerCase() !== filterValue.toLowerCase())
          );
          break;
        case 'Rating':
          setMinRating(null);
          break;
        case 'Sort':
          setSortOption('relevance');
          break;
        default:
          break;
      }
    }
  };

  const getFilterColor = (filter: string): string => {
    if (filter.startsWith('Category')) return "bg-primary-50 text-primary-600";
    if (filter.startsWith('Level')) return "bg-blue-50 text-blue-600";
    if (filter.startsWith('Rating')) return "bg-yellow-50 text-yellow-600";
    if (filter.startsWith('Sort')) return "bg-purple-50 text-purple-600";
    return "bg-green-50 text-green-600";
  };

  return (
    <main className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <span key={filter} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFilterColor(filter)}`}>
              {filter}
              <button
                type="button"
                onClick={() => removeFilter(filter)}
                className="ml-1 inline-flex text-primary-500 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          
          <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <DrawerTrigger asChild>
              <button
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => setIsFiltersOpen(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Add Filter
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-lg">
                <DrawerHeader>
                  <DrawerTitle>Filters</DrawerTitle>
                  <DrawerDescription>
                    Refine your search with these filters.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Category Filters */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`} 
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories(prev => [...prev, category]);
                                } else {
                                  setSelectedCategories(prev => prev.filter(c => c !== category));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`category-${category}`}
                              className="capitalize"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Difficulty Filters */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty Level</h3>
                      <div className="space-y-2">
                        {difficulties.map(difficulty => (
                          <div key={difficulty} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`difficulty-${difficulty}`}
                              checked={selectedDifficulties.includes(difficulty)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDifficulties(prev => [...prev, difficulty]);
                                } else {
                                  setSelectedDifficulties(prev => prev.filter(d => d !== difficulty));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`difficulty-${difficulty}`}
                              className="capitalize"
                            >
                              {difficulty}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating Filter */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h3>
                    <div className="flex gap-2">
                      {ratings.map(rating => (
                        <Button
                          key={rating}
                          variant={minRating === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMinRating(minRating === rating ? null : rating)}
                          className="flex items-center"
                        >
                          {rating}+ <span className="ml-1 text-yellow-500">★</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Apply Button */}
                  <div className="mt-8 mb-6 flex justify-end">
                    <Button 
                      onClick={() => setIsFiltersOpen(false)}
                      className="px-6"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Results Stats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filters.length > 0 
              ? `Showing ${filteredPaths.length} of ${totalResults} learning paths`
              : `Showing ${totalResults} learning paths`
            }
          </p>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <select
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Learning Path Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPaths.length > 0 ? (
            filteredPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="mx-auto max-w-md">
                <Book className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No learning paths found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">12</span> of{" "}
                <span className="font-medium">{totalResults}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary-50 text-sm font-medium text-primary-600 hover:bg-primary-100"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  8
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
