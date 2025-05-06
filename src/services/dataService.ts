
import { User } from "@/types/user";
import { Course } from "@/types/course";
import { Task } from "@/types/task";
import { toast } from "sonner";

// Define storage keys
const STORAGE_KEYS = {
  USERS: 'hackbridge_users',
  COURSES: 'hackbridge_courses',
  TASKS: 'hackbridge_tasks',
  CURRENT_USER: 'hackbridge_current_user'
};

// Initialize data in localStorage if it doesn't exist
const initializeData = () => {
  try {
    // Import mock data for initial setup
    const { users, courses, tasks } = require('./mockData');
    
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    
    console.log('Data service initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize local storage data:', error);
    return false;
  }
};

// User management
export const userService = {
  getAllUsers: (): User[] => {
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersData ? JSON.parse(usersData) : [];
  },
  
  getUserById: (id: string): User | null => {
    const users = userService.getAllUsers();
    return users.find(user => user.id === id) || null;
  },
  
  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userId) return null;
    return userService.getUserById(userId);
  },
  
  createUser: (user: User): boolean => {
    try {
      const users = userService.getAllUsers();
      // Check if email already exists
      if (users.some(u => u.email === user.email)) {
        toast.error("Пользователь с таким email уже существует");
        return false;
      }
      
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  },
  
  updateUser: (updatedUser: User): boolean => {
    try {
      const users = userService.getAllUsers();
      const index = users.findIndex(user => user.id === updatedUser.id);
      
      if (index === -1) return false;
      
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },
  
  deleteUser: (id: string): boolean => {
    try {
      const users = userService.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length === users.length) return false;
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },
  
  loginUser: (email: string, password: string): User | null => {
    const users = userService.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      toast.error("Пользователь не найден");
      return null;
    }
    
    // In a real app, you would hash and compare passwords
    // This is just a simple implementation
    if (password !== "admin123" && password !== "user123") {
      toast.error("Неверный пароль");
      return null;
    }
    
    if (user.banned) {
      toast.error("Ваш аккаунт заблокирован");
      return null;
    }
    
    // Save current user ID
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.id);
    
    // Also save individual user data for legacy support
    localStorage.setItem('userName', user.username);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userBalance', user.balance.toString());
    
    return user;
  },
  
  logoutUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    // Clear legacy user data
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    return true;
  }
};

// Course management
export const courseService = {
  getAllCourses: (): Course[] => {
    const coursesData = localStorage.getItem(STORAGE_KEYS.COURSES);
    return coursesData ? JSON.parse(coursesData) : [];
  },
  
  getCourseById: (id: string): Course | null => {
    const courses = courseService.getAllCourses();
    return courses.find(course => course.id === id) || null;
  },
  
  createCourse: (course: Course): boolean => {
    try {
      const courses = courseService.getAllCourses();
      courses.push(course);
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error('Error creating course:', error);
      return false;
    }
  },
  
  updateCourse: (updatedCourse: Course): boolean => {
    try {
      const courses = courseService.getAllCourses();
      const index = courses.findIndex(course => course.id === updatedCourse.id);
      
      if (index === -1) return false;
      
      courses[index] = updatedCourse;
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  },
  
  deleteCourse: (id: string): boolean => {
    try {
      const courses = courseService.getAllCourses();
      const filteredCourses = courses.filter(course => course.id !== id);
      
      if (filteredCourses.length === courses.length) return false;
      
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(filteredCourses));
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }
};

// Task management
export const taskService = {
  getAllTasks: (): Task[] => {
    const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasksData ? JSON.parse(tasksData) : [];
  },
  
  getTaskById: (id: string): Task | null => {
    const tasks = taskService.getAllTasks();
    return tasks.find(task => task.id === id) || null;
  },
  
  createTask: (task: Task): boolean => {
    try {
      const tasks = taskService.getAllTasks();
      tasks.push(task);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  },
  
  updateTask: (updatedTask: Task): boolean => {
    try {
      const tasks = taskService.getAllTasks();
      const index = tasks.findIndex(task => task.id === updatedTask.id);
      
      if (index === -1) return false;
      
      tasks[index] = updatedTask;
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },
  
  deleteTask: (id: string): boolean => {
    try {
      const tasks = taskService.getAllTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      if (filteredTasks.length === tasks.length) return false;
      
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
};

// Initialize data on service import
initializeData();

export default {
  initializeData,
  userService,
  courseService,
  taskService
};
