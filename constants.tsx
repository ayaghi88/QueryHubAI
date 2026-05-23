
import React from 'react';
import { Category, Suggestion, CuratedSkill, SkillLevel } from './types';

export const CATEGORIES = [
  { id: Category.UTILITY, label: 'Utility', icon: '⚡' },
  { id: Category.ENTERTAINMENT, label: 'Entertainment', icon: '🎬' },
  { id: Category.SKILLS, label: 'Practical Skills', icon: '🛠️' },
  { id: Category.TRENDING, label: 'Trending', icon: '🔥' },
];

export const SUGGESTIONS: Suggestion[] = [
  { id: '1', category: Category.UTILITY, query: "Current time in Tokyo and weather", icon: '🕒' },
  { id: '2', category: Category.ENTERTAINMENT, query: "What are the best sci-fi movies on Netflix right now?", icon: '🍿' },
  { id: '3', category: Category.SKILLS, query: "How to fix a leaky kitchen faucet step-by-step", icon: '🔧' },
  { id: '4', category: Category.TRENDING, query: "Latest breakthroughs in generative AI models", icon: '🤖' },
  { id: '5', category: Category.UTILITY, query: "Convert 150 USD to EUR and find nearest ATM", icon: '💰' },
  { id: '6', category: Category.SKILLS, query: "Basic sourdough starter recipe for beginners", icon: '🍞' },
];

export const CURATED_SKILLS: CuratedSkill[] = [
  {
    id: 's1',
    title: 'Master Knife Skills',
    description: 'Learn basic cuts like dice, julienne, and chiffonade for safer and faster cooking.',
    category: 'Cooking',
    level: SkillLevel.BEGINNER,
    icon: '🔪',
    duration: '20 min',
    featured: true
  },
  {
    id: 's2',
    title: 'Intro to React Hooks',
    description: 'Understanding useState and useEffect to build modern, functional web components.',
    category: 'Coding',
    level: SkillLevel.INTERMEDIATE,
    icon: '⚛️',
    duration: '45 min'
  },
  {
    id: 's3',
    title: 'Home Electrical Basics',
    description: 'Safe practices for replacing outlets, switches, and understanding your breaker box.',
    category: 'DIY',
    level: SkillLevel.INTERMEDIATE,
    icon: '🔌',
    duration: '1 hour'
  },
  {
    id: 's4',
    title: 'Retirement Fund 101',
    description: 'How to choose between 401(k), IRA, and Roth accounts for long-term wealth.',
    category: 'Finance',
    level: SkillLevel.BEGINNER,
    icon: '📈',
    duration: '30 min'
  },
  {
    id: 's5',
    title: 'Advanced CSS Animations',
    description: 'Creating high-performance complex animations using keyframes and transform properties.',
    category: 'Coding',
    level: SkillLevel.ADVANCED,
    icon: '🎨',
    duration: '1.5 hours'
  },
  {
    id: 's6',
    title: 'Sous Vide Perfection',
    description: 'Techniques for temperature-controlled cooking to achieve perfect results every time.',
    category: 'Cooking',
    level: SkillLevel.ADVANCED,
    icon: '🌡️',
    duration: '40 min'
  },
  {
    id: 's7',
    title: 'Brake Pad Replacement',
    description: 'A comprehensive guide to safely changing your vehicle\'s front disc brake pads.',
    category: 'DIY',
    level: SkillLevel.ADVANCED,
    icon: '🚗',
    duration: '2 hours'
  },
  {
    id: 's8',
    title: 'Tax Planning Basics',
    description: 'Simple strategies to optimize your annual tax filings and understand deductions.',
    category: 'Finance',
    level: SkillLevel.INTERMEDIATE,
    icon: '📄',
    duration: '45 min'
  },
  {
    id: 's9',
    title: 'Python for Data Analysis',
    description: 'Using Pandas and Matplotlib to visualize data trends and perform basic analysis.',
    category: 'Coding',
    level: SkillLevel.BEGINNER,
    icon: '🐍',
    duration: '1 hour'
  }
];
