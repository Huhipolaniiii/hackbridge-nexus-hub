
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'hacker' | 'company' | 'admin';
  avatarUrl?: string;
  rating: number;
  balance: number;
  completedTasks: number;
  skills: Skill[];
  purchasedCourses: string[];
  banned?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 1-10
}
