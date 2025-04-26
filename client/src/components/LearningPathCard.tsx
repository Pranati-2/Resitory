import { Link } from "wouter";
import { Bookmark, Star } from "lucide-react";
import { LearningPath } from "@/lib/types";

interface LearningPathCardProps {
  path: LearningPath;
}

export default function LearningPathCard({ path }: LearningPathCardProps) {
  const getCategoryColor = () => {
    switch (path.category) {
      case "programming":
        return "bg-blue-50 text-blue-600";
      case "design":
        return "bg-pink-50 text-pink-600";
      case "datascience":
        return "bg-purple-50 text-purple-600";
      case "business":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getDifficultyColor = () => {
    switch (path.difficulty) {
      case "beginner":
        return "bg-blue-50 text-blue-600";
      case "intermediate":
        return "bg-yellow-50 text-yellow-600";
      case "advanced":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={path.coverImage} 
          alt={`${path.title} Learning Path`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm">
          <Bookmark className="h-5 w-5 text-gray-600" />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-1 text-xs font-medium ${getCategoryColor()} rounded-full`}>{path.category.charAt(0).toUpperCase() + path.category.slice(1)}</span>
          <span className={`ml-2 px-2 py-1 text-xs font-medium ${getDifficultyColor()} rounded-full`}>{path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{path.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-1">{path.description}</p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <span className="ml-1 text-sm text-gray-700">{path.rating.toFixed(1)}</span>
              <span className="mx-1 text-gray-400">|</span>
              <span className="text-sm text-gray-600">{path.resources.length} resources</span>
            </div>
            <span className="text-sm text-gray-500">{path.learners.toLocaleString()} learners</span>
          </div>
          <Link href={`/path/${path.id}`} className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150">
            Preview Path
          </Link>
        </div>
      </div>
    </div>
  );
}
