
import { useMemo } from "react";
import { Star, Award, User as UserIcon, BookOpen, Briefcase, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Мок-данные. Подключи реальные через контекст/запрос.
const user = {
  username: "Алексей Иванов",
  email: "ivanov@example.com",
  avatarUrl: "/placeholder.svg",
  rating: 4.95,
  balance: 8900,
  completedTasks: 37,
  role: "hacker",
  skills: [
    { name: "XSS", level: 7 },
    { name: "SQLi", level: 5 },
    { name: "OSINT", level: 4 },
  ],
  purchasedCourses: [
    { id: "web-1", title: "Введение в XSS", difficulty: "Лёгкая" },
    { id: "web-2", title: "SQL Injection: базовый курс", difficulty: "Средняя" },
  ],
  activeTasks: [
    { id: "t-134", title: "BugBounty для Acme Corp", reward: 2500, status: "В работе" },
  ]
};

const gradientBg = "bg-gradient-to-r from-hack-blue/70 via-hack-purple to-hack-green/70";
const glass = "backdrop-blur-md bg-white/5 border border-white/10 shadow-xl";

export default function ProfileDetails() {
  // В реальном приложении данные должны приходить из useQuery/useUser
  const mainSkills = useMemo(() => user.skills.sort((a, b) => b.level - a.level), []);

  return (
    <section className="w-full animate-fade-in">
      {/* Верх - аватар + базовая инфа */}
      <div className={`flex flex-col md:flex-row gap-6 items-center md:items-start mb-8 p-6 rounded-xl ${gradientBg} glass-morphism shadow-lg transition-all`}>
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="rounded-full w-24 h-24 border-4 border-hack-blue shadow-lg animate-fade-in"
        />
        <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
          <h2 className="text-2xl font-bold text-gradient animate-fade-in">{user.username}</h2>
          <div className="flex gap-3 items-center">
            <Badge variant="secondary" className="gap-1">
              <UserIcon className="text-hack-blue" size={16} /> Хакер
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Award className="text-hack-green" size={16} /> Рейтинг: {user.rating}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <CreditCard className="text-hack-green" size={16} /> Баланс: {user.balance}₽
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </div>
      {/* Основные блоки - с анимацией карточек */}
      <div className="grid md:grid-cols-3 gap-6 w-full">
        {/* Курсы */}
        <div className="hack-card animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-hack-blue" size={20} />
            <span className="font-semibold">Мои курсы</span>
          </div>
          <ul className="space-y-2">
            {user.purchasedCourses.length === 0 ? (
              <li className="text-muted-foreground text-sm">Нет купленных курсов</li>
            ) : user.purchasedCourses.map((course) =>
              <li
                key={course.id}
                className="rounded-md px-3 py-2 bg-hack-dark/60 hover:scale-105 hover:bg-hack-blue/10 transition-all duration-200 shadow"
              >
                <span className="font-medium">{course.title}</span>
                <Badge variant="outline" className="ml-2">{course.difficulty}</Badge>
              </li>
            )}
          </ul>
        </div>
        {/* Активные задания */}
        <div className="hack-card animate-slide-up delay-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-hack-blue" size={20} />
            <span className="font-semibold">Активные задания</span>
          </div>
          <ul className="space-y-2">
            {user.activeTasks.length === 0 ? (
              <li className="text-muted-foreground text-sm">Нет активных заданий</li>
            ) : user.activeTasks.map((task) =>
              <li
                key={task.id}
                className="rounded-md px-3 py-2 bg-hack-dark/60 hover:scale-105 hover:bg-hack-green/10 transition-all duration-200 shadow"
              >
                <span className="font-medium">{task.title}</span>
                <Badge variant="outline" className="ml-2">{task.reward}₽</Badge>
              </li>
            )}
          </ul>
        </div>
        {/* Навыки */}
        <div className="hack-card animate-slide-up delay-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-hack-blue" size={20} />
            <span className="font-semibold">Навыки</span>
          </div>
          <ul className="space-y-2">
            {mainSkills.length === 0 ? (
              <li className="text-muted-foreground text-sm">Нет данных</li>
            ) : mainSkills.map((skill) =>
              <li
                key={skill.name}
                className="flex justify-between items-center px-3 py-2 rounded-md bg-hack-dark/60 transition-all duration-200 relative"
              >
                <span>{skill.name}</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 rounded bg-hack-blue/40 h-2 mr-1 overflow-hidden">
                    <div style={{ width: `${skill.level * 10}%` }} className="bg-hack-blue h-2 transition-all duration-300"></div>
                  </div>
                  <span className="text-xs">{skill.level}/10</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
