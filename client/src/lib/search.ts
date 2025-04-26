import { LearningPath } from "./types";
import { getLearningPaths } from "./storage";

/**
 * Simple search function that filters learning paths based on the query string
 * Searches across title, description, category, tags, and resource titles
 */
export const searchLearningPaths = (query: string): LearningPath[] => {
  if (!query.trim()) {
    return getLearningPaths();
  }

  const normalizedQuery = query.toLowerCase().trim();
  const paths = getLearningPaths();

  return paths.filter((path) => {
    // Search in title, description, category
    if (
      path.title.toLowerCase().includes(normalizedQuery) ||
      path.description.toLowerCase().includes(normalizedQuery) ||
      path.category.toLowerCase().includes(normalizedQuery) ||
      path.difficulty.toLowerCase().includes(normalizedQuery)
    ) {
      return true;
    }

    // Search in tags
    if (path.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    // Search in resource titles and descriptions
    if (
      path.resources.some(
        (resource) =>
          resource.title.toLowerCase().includes(normalizedQuery) ||
          resource.description.toLowerCase().includes(normalizedQuery)
      )
    ) {
      return true;
    }

    return false;
  });
};

/**
 * Filter learning paths by category
 */
export const filterByCategory = (category: string): LearningPath[] => {
  if (category === "all") {
    return getLearningPaths();
  }

  const paths = getLearningPaths();
  return paths.filter((path) => path.category.toLowerCase() === category.toLowerCase());
};

/**
 * Filter learning paths by difficulty
 */
export const filterByDifficulty = (difficulty: string): LearningPath[] => {
  const paths = getLearningPaths();
  return paths.filter((path) => path.difficulty.toLowerCase() === difficulty.toLowerCase());
};

/**
 * Sort learning paths by different criteria
 */
export const sortLearningPaths = (
  paths: LearningPath[],
  sortBy: "relevance" | "popular" | "newest" | "rating"
): LearningPath[] => {
  const sortedPaths = [...paths];

  switch (sortBy) {
    case "popular":
      return sortedPaths.sort((a, b) => b.learners - a.learners);
    case "newest":
      return sortedPaths.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "rating":
      return sortedPaths.sort((a, b) => b.rating - a.rating);
    case "relevance":
    default:
      // Default sorting - can be enhanced with more sophisticated relevance algorithms
      return sortedPaths;
  }
};
