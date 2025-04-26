import { useState } from "react";
import { X } from "lucide-react";
import LearningPathCard from "./LearningPathCard";
import { LearningPath } from "@/lib/types";

interface ResultsSectionProps {
  learningPaths: LearningPath[];
  totalResults: number;
}

export default function ResultsSection({ learningPaths, totalResults }: ResultsSectionProps) {
  const [filters, setFilters] = useState<string[]>(["Most Popular", "Beginner Level"]);
  const [sortOption, setSortOption] = useState("relevance");

  const removeFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  const addFilter = () => {
    // This would typically open a dropdown or modal to add filters
    // For this example, we'll just add a dummy filter
    const newFilter = "Added Filter";
    if (!filters.includes(newFilter)) {
      setFilters([...filters, newFilter]);
    }
  };

  const getFilterColor = (filter: string): string => {
    if (filter === "Most Popular") return "bg-primary-50 text-primary-600";
    if (filter === "Beginner Level") return "bg-blue-50 text-blue-600";
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
          <button
            onClick={addFilter}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600"
          >
            Add Filter
            <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Results Stats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing {totalResults} learning paths</p>
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
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
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
