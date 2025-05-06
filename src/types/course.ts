
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
  category: 'Web' | 'Mobile' | 'Crypto' | 'OSINT' | 'Forensics';
  imageUrl: string;
  lessonsCount: number;
  purchased?: boolean;
  inCart?: boolean;
  studentsCount?: number;
  createdAt?: string;
  categories?: string[];
  rating?: number;
  level?: string;
  duration?: string;
  modules?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}
