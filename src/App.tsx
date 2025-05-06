
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import PostTask from "./pages/PostTask";
import AuthGuard from "./components/auth/AuthGuard";
import ProfileSettings from "./pages/ProfileSettings";
import AdminPanel from "./pages/AdminPanel";
import dataService from "./services/dataService";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize data service when the app starts
    dataService.initializeData();
    console.log("Data service initialized");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/tasks/post" element={<PostTask />} />
            
            {/* Protected routes */}
            <Route 
              path="/cart" 
              element={
                <AuthGuard>
                  <Cart />
                </AuthGuard>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } 
            />
            <Route 
              path="/profile/settings" 
              element={
                <AuthGuard>
                  <ProfileSettings />
                </AuthGuard>
              } 
            />
            
            {/* Admin route */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard>
                  <AdminPanel />
                </AuthGuard>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
