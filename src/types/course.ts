
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
}
