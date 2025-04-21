
export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'Лёгкая' | 'Средняя' | 'Сложная';
  category: 'Web' | 'Mobile' | 'Crypto' | 'OSINT' | 'Forensics';
  reward: number;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  status: 'Открыто' | 'В работе' | 'Закрыто';
}
