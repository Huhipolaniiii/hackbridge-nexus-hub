import { Course } from '@/types/course';
import { Task } from '@/types/task';
import { User } from '@/types/user';

// Mock courses
export const courses: Course[] = [
  {
    id: '1',
    title: 'Основы XSS-уязвимостей',
    description: 'Изучите основы Cross-Site Scripting (XSS) уязвимостей, методы обнаружения и эксплуатации.',
    price: 3500,
    difficulty: 'Лёгкая',
    category: 'Web',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    lessonsCount: 8,
    studentsCount: 845,
    createdAt: '2025-02-15T10:30:00Z',
    categories: ['Web', 'Security'],
  },
  {
    id: '2',
    title: 'SQL-инъекции: от новичка до профессионала',
    description: 'Полный курс по SQL-инъекциям: теория, практика, защита и обход WAF.',
    price: 5200,
    difficulty: 'Средняя',
    category: 'Web',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    lessonsCount: 12,
    studentsCount: 1243,
    createdAt: '2025-01-20T14:15:00Z',
    categories: ['Web', 'Database'],
  },
  {
    id: '3',
    title: 'LFI и RFI уязвимости в веб-приложениях',
    description: 'Как обнаружить и использовать уязвимости включения локальных и удаленных файлов.',
    price: 4800,
    difficulty: 'Средняя',
    category: 'Web',
    imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2021&auto=format&fit=crop',
    lessonsCount: 10,
    studentsCount: 756,
    createdAt: '2025-03-05T09:45:00Z',
    categories: ['Web', 'Security'],
  },
  {
    id: '4',
    title: 'OSINT: Разведка на основе открытых источников',
    description: 'Техники и инструменты для сбора информации из публично доступных источников.',
    price: 4200,
    difficulty: 'Лёгкая',
    category: 'OSINT',
    imageUrl: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2074&auto=format&fit=crop',
    lessonsCount: 14,
    studentsCount: 1567,
    createdAt: '2025-01-10T11:20:00Z',
    categories: ['OSINT', 'Intelligence'],
  },
  {
    id: '5',
    title: 'Криптографические уязвимости',
    description: 'Изучение слабых мест в реализациях криптографических алгоритмов и протоколов.',
    price: 6500,
    difficulty: 'Сложная',
    category: 'Crypto',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2032&auto=format&fit=crop',
    lessonsCount: 16,
    studentsCount: 678,
    createdAt: '2025-02-28T16:40:00Z',
    categories: ['Crypto', 'Security'],
  },
  {
    id: '6',
    title: 'Мобильная безопасность: Android',
    description: 'Анализ безопасности Android-приложений, выявление уязвимостей в мобильных приложениях.',
    price: 5800,
    difficulty: 'Средняя',
    category: 'Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?q=80&w=2070&auto=format&fit=crop',
    lessonsCount: 12,
    studentsCount: 924,
    createdAt: '2025-03-15T13:10:00Z',
    categories: ['Mobile', 'Android'],
  },
];

// Mock tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Поиск XSS в онлайн-магазине',
    description: 'Требуется обнаружить XSS-уязвимости в тестовом онлайн-магазине. Необходимо найти как минимум два различных вектора атаки.',
    difficulty: 'Средняя',
    category: 'Web',
    reward: 15000,
    companyId: '1',
    companyName: 'ИнфоСекъюрити',
    status: 'Открыто',
  },
  {
    id: '2',
    title: 'Аудит безопасности API',
    description: 'Проведение аудита безопасности REST API нашего сервиса. Поиск уязвимостей в аутентификации и авт��ризации.',
    difficulty: 'Сложная',
    category: 'Web',
    reward: 30000,
    companyId: '2',
    companyName: 'ТехноЩит',
    status: 'Открыто',
  },
  {
    id: '3',
    title: 'Анализ Android-приложения',
    description: 'Необходимо провести анализ безопасности нашего Android-приложения и выявить потенциальные уязвимости.',
    difficulty: 'Средняя',
    category: 'Mobile',
    reward: 25000,
    companyId: '3',
    companyName: 'МобильСекьюр',
    status: 'Открыто',
  },
  {
    id: '4',
    title: 'Поиск утечек данных компании',
    description: 'Используя методы OSINT, найдите информацию о компании, которая может представлять угрозу при попадании в открытый доступ.',
    difficulty: 'Лёгкая',
    category: 'OSINT',
    reward: 12000,
    companyId: '2',
    companyName: 'ТехноЩит',
    status: 'Открыто',
  },
  {
    id: '5',
    title: 'Криптоанализ защищенного протокола',
    description: 'Требуется провести анализ разработанного нами протокола шифрования и выявить его потенциальные слабости.',
    difficulty: 'Сложная',
    category: 'Crypto',
    reward: 40000,
    companyId: '4',
    companyName: 'КриптоТех',
    status: 'Открыто',
  },
  {
    id: '6',
    title: 'Расследование инцидента безопасности',
    description: 'Проведите форензик-анализ предоставленного образа диска и определите способ и время проникновения злоумышленника.',
    difficulty: 'Сложная',
    category: 'Forensics',
    reward: 35000,
    companyId: '1',
    companyName: 'ИнфоСекъюрити',
    status: 'Открыто',
  },
];

// Mock users (we'll have just one for now)
export const users: User[] = [
  {
    id: '1',
    username: 'hacker123',
    email: 'hacker@example.com',
    role: 'hacker',
    rating: 850,
    balance: 45000,
    completedTasks: 12,
    skills: [
      { name: 'Web', level: 8 },
      { name: 'Mobile', level: 6 },
      { name: 'Crypto', level: 4 },
      { name: 'OSINT', level: 7 },
      { name: 'Forensics', level: 5 },
    ],
    purchasedCourses: ['1', '3'],
  },
];

// Helper function to simulate API requests
export const simulateApiRequest = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
