
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserCog, Shield, Bell, CreditCard, Lock, Download } from "lucide-react";
import { zipService } from "@/services/zipService";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    about: "",
    notifications: {
      email: true,
      marketing: false,
    },
    security: {
      twoFactor: false,
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  useEffect(() => {
    // Load user data from localStorage
    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";
    const userRole = localStorage.getItem("userRole") || "";
    
    setUserData({
      ...userData,
      username: userName,
      email: userEmail,
    });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem("userName", userData.username);
      localStorage.setItem("userEmail", userData.email);
      
      setIsLoading(false);
      toast.success("Настройки успешно сохранены");
    }, 800);
  };
  
  const handleChangePassword = () => {
    // Проверяем, что новый пароль и подтверждение совпадают
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Новый пароль и подтверждение не совпадают");
      return;
    }
    
    // Проверяем, что новый пароль не пустой и имеет минимальную длину
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error("Новый пароль должен содержать минимум 6 символов");
      return;
    }
    
    // Симуляция API запроса
    setIsLoading(true);
    setTimeout(() => {
      // В реальном приложении здесь был бы запрос к API для смены пароля
      
      // Очищаем поля после успешной смены пароля
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setIsLoading(false);
      toast.success("Пароль успешно изменен");
    }, 800);
  };
  
  const handleDownloadData = async () => {
    // Получаем данные пользователя для экспорта
    const userDataForExport = {
      username: userData.username,
      email: userData.email,
      role: localStorage.getItem("userRole") || "",
      balance: localStorage.getItem("userBalance") || "0",
      rating: localStorage.getItem("userRating") || "0",
      completedTasks: localStorage.getItem("userCompletedTasks") || "0",
      skills: JSON.parse(localStorage.getItem("userSkills") || "[]")
    };
    
    // Создаем и скачиваем zip-файл
    const success = await zipService.createUserDataZip(userDataForExport);
    if (success) {
      toast.success("Данные успешно экспортированы");
    } else {
      toast.error("Ошибка при экспорте данных");
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <section className="w-full animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <Card className="hack-card md:w-64 w-full">
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
                <CardDescription>Управление вашим аккаунтом</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TabsList className="grid grid-cols-1 h-auto bg-transparent">
                  <TabsTrigger 
                    value="account" 
                    className="justify-start data-[state=active]:bg-hack-dark rounded-none border-l-2 border-transparent data-[state=active]:border-hack-blue px-4 py-3"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Учетная запись
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start data-[state=active]:bg-hack-dark rounded-none border-l-2 border-transparent data-[state=active]:border-hack-blue px-4 py-3"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Уведомления
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start data-[state=active]:bg-hack-dark rounded-none border-l-2 border-transparent data-[state=active]:border-hack-blue px-4 py-3"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Безопасность
                  </TabsTrigger>
                  <TabsTrigger 
                    value="billing" 
                    className="justify-start data-[state=active]:bg-hack-dark rounded-none border-l-2 border-transparent data-[state=active]:border-hack-blue px-4 py-3"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Платежи
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>

            <div className="flex-1">
              <TabsContent value="account" className="m-0">
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Учетная запись</CardTitle>
                    <CardDescription>
                      Обновите личную информацию и настройки аккаунта
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg" alt={userData.username} />
                        <AvatarFallback className="text-xl">
                          {getInitials(userData.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Фото профиля</h4>
                        <p className="text-sm text-muted-foreground">
                          Рекомендуемый размер: 400x400 пикселей
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            Изменить
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Имя пользователя</Label>
                          <Input
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about">О себе</Label>
                        <Textarea
                          id="about"
                          name="about"
                          value={userData.about}
                          onChange={handleInputChange}
                          placeholder="Расскажите о себе, ваших навыках и опыте"
                          className="min-h-32"
                        />
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          onClick={handleDownloadData}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Экспортировать данные (.zip)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveSettings} 
                      disabled={isLoading}
                      className="bg-hack-blue hover:bg-hack-blue/80 text-black"
                    >
                      {isLoading ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                    <CardDescription>
                      Настройте каналы и типы получаемых уведомлений
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      Эта функция находится в разработке и будет доступна в ближайшее время.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Безопасность</CardTitle>
                    <CardDescription>
                      Управляйте настройками безопасности вашего аккаунта
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-hack-blue" />
                          Изменение пароля
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          Регулярно меняйте пароль для обеспечения безопасности аккаунта
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Текущий пароль</Label>
                            <Input
                              id="current-password"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Новый пароль</Label>
                            <Input
                              id="new-password"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                            <Input
                              id="confirm-password"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                            />
                          </div>
                          <Button 
                            className="bg-hack-blue hover:bg-hack-blue/80 text-black mt-2" 
                            onClick={handleChangePassword}
                          >
                            Изменить пароль
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="m-0">
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Платежи и подписки</CardTitle>
                    <CardDescription>
                      Управляйте платежными данными и подписками
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      Эта функция находится в разработке и будет доступна в ближайшее время.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
