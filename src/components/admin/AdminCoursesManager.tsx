
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from '@/types/course';

interface AdminCoursesManagerProps {
  courses: Course[];
}

const AdminCoursesManager = ({ courses }: AdminCoursesManagerProps) => {
  return (
    <Card className="hack-card">
      <CardHeader>
        <CardTitle>Управление курсами</CardTitle>
        <CardDescription>
          Здесь вы можете управлять доступными курсами на платформе
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Сложность</TableHead>
              <TableHead>Цена</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.difficulty}</TableCell>
                <TableCell className="text-hack-green">{course.price} ₽</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminCoursesManager;
