import { LearningPath } from "./types";

const STORAGE_KEY = "repository-learning-paths";

// Sample data for initial state
const sampleLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Full-Stack Web Development Roadmap",
    description: "A comprehensive learning path from HTML basics to building full-stack web applications.",
    category: "programming",
    difficulty: "beginner",
    tags: ["javascript", "frontend", "web development"],
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    resources: [
      {
        id: "1-1",
        type: "video",
        title: "HTML & CSS Crash Course",
        url: "https://www.youtube.com/watch?v=hu-q2zYwEYs",
        description: "Learn the basics of HTML and CSS in this comprehensive tutorial."
      },
      {
        id: "1-2",
        type: "article",
        title: "JavaScript Fundamentals",
        url: "https://javascript.info/",
        description: "Modern JavaScript tutorial with simple, detailed explanations."
      },
      {
        id: "1-3",
        type: "video",
        title: "React JS Crash Course",
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        description: "Learn React in this comprehensive crash course."
      }
    ],
    createdAt: "2023-01-15T12:00:00Z",
    rating: 4.8,
    learners: 5243
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    description: "Learn the core concepts of machine learning and how to apply them to real-world problems.",
    category: "datascience",
    difficulty: "intermediate",
    tags: ["machine learning", "python", "data science"],
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    resources: [
      {
        id: "2-1",
        type: "video",
        title: "Machine Learning Crash Course",
        url: "https://www.youtube.com/watch?v=NWONeJKn6kc",
        description: "A fast-paced, practical introduction to machine learning."
      },
      {
        id: "2-2",
        type: "article",
        title: "Python for Data Science Handbook",
        url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        description: "Comprehensive guide to the scientific Python ecosystem."
      }
    ],
    createdAt: "2023-02-20T09:30:00Z",
    rating: 4.7,
    learners: 3829
  },
  {
    id: "3",
    title: "UI/UX Design Essentials",
    description: "Discover the principles of user-centered design and create beautiful, functional interfaces.",
    category: "design",
    difficulty: "beginner",
    tags: ["ui design", "ux design", "figma"],
    coverImage: "https://images.unsplash.com/photo-1534670007418-bc7b294e3b56",
    resources: [
      {
        id: "3-1",
        type: "video",
        title: "UI/UX Design Tutorial for Beginners",
        url: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        description: "Learn the fundamentals of UI/UX design in this beginner-friendly tutorial."
      },
      {
        id: "3-2",
        type: "article",
        title: "The Principles of Beautiful Web Design",
        url: "https://www.smashingmagazine.com/2008/01/10-principles-of-effective-web-design/",
        description: "Essential principles to create aesthetically pleasing designs."
      }
    ],
    createdAt: "2023-03-05T15:45:00Z",
    rating: 4.9,
    learners: 2471
  }
];

// Initialize storage with sample data if empty
const initializeStorage = (): void => {
  const existingPaths = localStorage.getItem(STORAGE_KEY);
  if (!existingPaths) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleLearningPaths));
  }
};

// Get all learning paths
export const getLearningPaths = (): LearningPath[] => {
  initializeStorage();
  const paths = localStorage.getItem(STORAGE_KEY);
  return paths ? JSON.parse(paths) : [];
};

// Get a specific learning path by ID
export const getLearningPathById = (id: string): LearningPath | null => {
  const paths = getLearningPaths();
  return paths.find(path => path.id === id) || null;
};

// Save a new learning path
export const saveLearningPath = (path: LearningPath): void => {
  const paths = getLearningPaths();
  const existingIndex = paths.findIndex(p => p.id === path.id);
  
  if (existingIndex !== -1) {
    // Update existing path
    paths[existingIndex] = path;
  } else {
    // Add new path
    paths.unshift(path);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
};

// Delete a learning path
export const deleteLearningPath = (id: string): void => {
  const paths = getLearningPaths();
  const updatedPaths = paths.filter(path => path.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPaths));
};
