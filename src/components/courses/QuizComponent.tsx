
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { userService } from '@/services/dataService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Skill } from '@/types/user';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  quizId: string;
  title: string;
  questions: Question[];
  onComplete: (score: number, totalQuestions: number) => void;
}

const QuizComponent = ({ quizId, title, questions, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress as percentage of questions completed
    setProgress((currentQuestion / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    const correct = selectedOption === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // Wait 1.5 seconds before moving to next question or showing final result
    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz completed
        setCompleted(true);
        
        // Calculate percentage score
        const finalScore = score + (correct ? 1 : 0);
        const percentage = (finalScore / questions.length) * 100;
        
        // Update user skills based on quiz performance
        updateUserSkills(title, percentage);
        
        // Call completion callback
        onComplete(finalScore, questions.length);
      }
    }, 1500);
  };
  
  const updateUserSkills = (skillName: string, percentage: number) => {
    try {
      const currentUser = userService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'hacker') {
        return;
      }
      
      // Determine skill level based on percentage (0-10 scale)
      const skillImprovement = Math.min(Math.ceil(percentage / 10), 10);
      
      // Default skill name based on quiz title
      const normalizedSkill = skillName.split(' ')[0];
      
      // Update user's skills
      const userSkills = [...(currentUser.skills || [])];
      
      // Find if skill already exists
      const existingSkillIndex = userSkills.findIndex(s => 
        s.name.toLowerCase().includes(normalizedSkill.toLowerCase()));
      
      if (existingSkillIndex >= 0) {
        // Update existing skill - max level is 10
        userSkills[existingSkillIndex].level = Math.min(
          userSkills[existingSkillIndex].level + Math.ceil(skillImprovement / 3), 
          10
        );
      } else {
        // Add new skill
        userSkills.push({
          name: `${normalizedSkill}`,
          level: Math.ceil(skillImprovement / 2)
        });
      }
      
      // Update user data
      currentUser.skills = userSkills;
      userService.updateCurrentUser(currentUser);
      
      toast.success(`Ваш навык "${normalizedSkill}" улучшен!`);
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };

  if (completed) {
    return (
      <Card className="hack-card">
        <CardHeader>
          <CardTitle className="text-center">Квиз завершен!</CardTitle>
          <CardDescription className="text-center">
            Вы ответили правильно на {score} из {questions.length} вопросов
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <Progress value={(score / questions.length) * 100} className="w-full h-3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hack-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Вопрос {currentQuestion + 1} из {questions.length}
        </CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent>
        <div className="text-lg font-medium mb-4">
          {questions[currentQuestion].question}
        </div>
        
        <RadioGroup onValueChange={(value) => handleOptionSelect(parseInt(value))}>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className={`flex items-center space-x-2 p-3 rounded-md ${
              showResult && index === selectedOption 
                ? isCorrect ? 'bg-green-500/20' : 'bg-red-500/20' 
                : 'hover:bg-muted'
            }`}>
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`}
                disabled={showResult}
              />
              <Label 
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer py-2"
              >
                {option}
              </Label>
              
              {showResult && index === selectedOption && (
                isCorrect 
                  ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                  : <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {showResult && (
          <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <p className="font-medium">
              {isCorrect ? 'Правильно!' : 'Неправильно!'}
            </p>
            {!isCorrect && (
              <p className="text-sm mt-1">
                Правильный ответ: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleNextQuestion} 
          className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black" 
          disabled={selectedOption === null || showResult}
        >
          {currentQuestion < questions.length - 1 ? 'Следующий вопрос' : 'Завершить'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;
