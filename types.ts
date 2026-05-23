
export enum Category {
  UTILITY = 'Utility',
  ENTERTAINMENT = 'Entertainment',
  SKILLS = 'Skills',
  TRENDING = 'Trending'
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface SearchResult {
  text: string;
  sources: GroundingSource[];
  category: Category;
  timestamp: number;
}

export interface Suggestion {
  id: string;
  category: Category;
  query: string;
  icon: string;
}

export interface CuratedSkill {
  id: string;
  title: string;
  description: string;
  category: 'Cooking' | 'DIY' | 'Coding' | 'Finance';
  level: SkillLevel;
  icon: string;
  duration: string;
  featured?: boolean;
}

export interface HistoryItem {
  id: string;
  query: string;
  category: Category;
  timestamp: number;
}
