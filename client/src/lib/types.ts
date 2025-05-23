export type ResourceType = 'video' | 'website' | 'pdf' | 'image' | 'learningPath' | 'other';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  description: string;
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
