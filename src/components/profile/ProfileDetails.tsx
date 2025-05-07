
import { useMemo, useEffect, useState } from "react";
import { Star, Award, User as UserIcon, BookOpen, Briefcase, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { userService, courseService } from "@/services/dataService";
import { User } from "@/types/user";
import { Course } from "@/types/course";

export default function ProfileDetails() {
  const [userData, setUserData] = useState<User | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Get user data from our data service
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);

      // Get purchased courses
      if (currentUser.purchasedCourses && currentUser.purchasedCourses.length > 0) {
        const allCourses = courseService.getAllCourses();
        const userCourses = allCourses.filter(course => 
          currentUser.purchasedCourses.includes(course.id)
        );
        setPurchasedCourses(userCourses);
      }
    }
  }, []);

  // Format empty skills list for new users
  const mainSkills = useMemo(() => {
    return userData?.skills?.length ? userData.skills.sort((a, b) => b.level - a.level) : [];
  }, [userData?.skills]);

  if (!userData) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-hack-dark rounded-lg"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-hack-dark rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const gradientBg = "bg-gradient-to-r from-hack-blue/70 via-hack-purple to-hack-green/70";
  const glass = "backdrop-blur-md bg-white/5 border border-white/10 shadow-xl";

  return (
    <section className="w-full animate-fade-in">
      {/* Верх - аватар + базовая инфа */}
      <div className={`flex flex-col md:flex-row gap-6 items-center md:items-start mb-8 p-6 rounded-xl ${gradientBg} glass-morphism shadow-lg transition-all`}>
        <img
          src={userData.avatarUrl || "/placeholder.svg"}
          alt="avatar"
          className="rounded-full w-24 h-24 border-4 border-hack-blue shadow-lg animate-fade-in"
        />
        <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
          <h2 className="text-2xl font-bold text-gradient animate-fade-in">{userData.username}</h2>
          <div className="flex gap-3 items-center flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <UserIcon className="text-hack-blue" size={16} /> {userData.role === 'hacker' ? 'Хакер' : userData.role === 'company' ? 'Компания' : 'Админ'}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Award className="text-hack-green" size={16} /> Рейтинг: {userData.rating}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <CreditCard className="text-hack-green" size={16} /> Баланс: {userData.balance}₽
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="text-hack-blue" size={16} /> Курсов: {userData.purchasedCourses?.length || 0}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{userData.email}</span>
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
            {userData.purchasedCourses?.length > 0 ? (
              purchasedCourses.map((course) =>
                <li
                  key={course.id}
                  className="rounded-md px-3 py-2 bg-hack-dark/60 hover:scale-105 hover:bg-hack-blue/10 transition-all duration-200 shadow flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded bg-cover bg-center" 
                      style={{ backgroundImage: `url(${course.imageUrl || '/placeholder.svg'})` }}
                    />
                    <span className="font-medium line-clamp-1">{course.title}</span>
                  </div>
                  <Badge variant="outline" className="ml-2">{course.difficulty}</Badge>
                </li>
              )
            ) : (
              <li className="text-muted-foreground text-sm">Нет купленных курсов</li>
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
            {userData.role === 'company' ? (
              <li className="text-muted-foreground text-sm">
                Создайте задания для хакеров на странице заданий
              </li>
            ) : (
              <li className="text-muted-foreground text-sm">Нет активных заданий</li>
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
            {mainSkills.length > 0 ? (
              mainSkills.map((skill: any) =>
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
              )
            ) : (
              <li className="text-muted-foreground text-sm">Нет данных</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
