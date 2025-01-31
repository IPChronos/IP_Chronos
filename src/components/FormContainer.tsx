import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "room"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const authPromise = auth(); // auth() returns a Promise<Auth>
  const { userId, sessionClaims } = await authPromise; 
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classSpecializations = await prisma.specialization.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, specializations: classSpecializations };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentSpecializations = await prisma.specialization.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, specializations: studentSpecializations };
        break;
      case "exam":
          const examLessons = await prisma.lesson.findMany({
            where: {
              ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
            },
            select: { id: true, name: true },
          });
        
          const availableRooms = await prisma.room.findMany({
            select: { id: true, name: true },
          });
        
          relatedData = { lessons: examLessons, rooms: availableRooms };
          break;
       case "lesson":
            const lessonSubjects = await prisma.subject.findMany({
              select: { id: true, name: true },
            });
            const lessonTeachers = await prisma.teacher.findMany({
              select: { id: true, name: true, surname: true },
            });
            const lessonClasses = await prisma.class.findMany({
              select: { id: true, name: true }, // Adjust the fields based on your database schema
            });
          
            relatedData = {
              subjects: lessonSubjects,
              teachers: lessonTeachers,
              classes: lessonClasses, // Add classes to the relatedData
            };
            break;
          
     
       
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;