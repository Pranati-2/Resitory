export type ResourceType = 'video' | 'website' | 'pdf' | 'image' | 'learningPath' | 'other';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string; // This field will store an ID for 'learningPath' type
  description: string;
  linkedPathPreview?: LinkedPathPreview; // Added field
}

// Define a new interface for linked path previews
export interface LinkedPathPreview {
  id: string; // ID of the linked path, for navigation
  title: string;
  coverImage?: string;
  category?: string;
  difficulty?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  coverImage: string;
  resources: Resource[];
  createdAt: string;
  rating: number;
  learners: number;
}
