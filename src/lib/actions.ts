"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  SubjectSchema,
  StudentSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

  }
};


export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    // Check for duplicates in the database
    const existingTeacherByUsername = await prisma.teacher.findUnique({
      where: { username: data.username },
    });

    if (existingTeacherByUsername) {
      return { success: false, error: true, message: "Username already taken." };
    }

    const existingTeacherByEmail = await prisma.teacher.findUnique({
      where: { email: data.email || "" }, // Default to empty string in case email is undefined
    });

    if (existingTeacherByEmail) {
      return { success: false, error: true, message: "Email already taken." };
    }

    // Create a new user in Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    // Create the teacher record in Prisma
    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        faculty: data.faculty,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        specialization: data.specialization,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};


export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        faculty: data.faculty,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log("Input data:", data);
  try {
    const clerk = await clerkClient();
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: "Class is at full capacity." };
    }

    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        faculty: data.faculty,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        specializationId: data.specializationId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Error during student creation:", err);

    // Return a specific error message if available
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessages = err.errors.map((error: any) => error.message).join(", ");
      return { success: false, error: errorMessages };
    }

    // Generic fallback error
    return { success: false, error: err.message || "An unknown error occurred." };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        faculty: data.faculty,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        specializationId: data.specializationId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    // Ensure startDate is earlier than endDate
    if (new Date(data.startTime) >= new Date(data.endTime)) {
      return {
        success: false,
        error: true,
        message: "The start date and time must be earlier than the end date and time.",
      };
    }

    // Check if the room is available during the specified time
    const overlappingExam = await prisma.exam.findFirst({
      where: {
        roomId: data.roomId,
        AND: [
          { startTime: { lt: data.endTime } }, // Existing exam starts before the new one ends
          { endTime: { gt: data.startTime } }, // Existing exam ends after the new one starts
        ],
      },
      include: {
        lesson: {
          include: {
            teacher: true, // Include the teacher associated with the lesson
          },
        },
      },
    });

    if (overlappingExam) {
      // Format the start and end times as a readable string
      const startDate = new Date(overlappingExam.startTime);
      const endDate = new Date(overlappingExam.endTime);

      const formattedStart = `${startDate.toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })}, ${startDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      })}`;

      const formattedEnd = `${endDate.toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })}, ${endDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      })}`;

      return {
        success: false,
        error: true,
        message: `The room is already occupied during the selected time range by Professor ${overlappingExam.lesson.teacher.name} from ${formattedStart} to ${formattedEnd}.`,
      };
    }

    // Check if the lesson exists
    const lessonExists = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });

    if (!lessonExists) {
      return {
        success: false,
        error: true,
        message: "The selected lesson does not exist.",
      };
    }

    // Create the exam
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
        roomId: data.roomId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error(err);

    // Identify specific Prisma errors
    if (err.code === "P2002") {
      return {
        success: false,
        error: true,
        message: "A unique constraint was violated.",
      };
    }

    if (err.code === "P2025") {
      return {
        success: false,
        error: true,
        message: "Record not found.",
      };
    }

    // Generic error message
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred while creating the exam.",
    };
  }
};



export const updateExam = async (data: ExamSchema) => {
  try {
    // Check if the exam exists and other logic here

    // If everything is fine, update the exam
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
        roomId: data.roomId,
      },
    });

    return { success: true, error: false }; // Return the correct structure
  } catch (err: any) {
    console.error(err);

    // Handle specific Prisma errors or generic errors
    if (err.code === "P2002") {
      return { success: false, error: true, message: "A unique constraint was violated." };
    }

    if (err.code === "P2025") {
      return { success: false, error: true, message: "Record not found." };
    }

    return { success: false, error: true, message: "An unexpected error occurred." }; // Return a generic error message
  }
};


export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const joinExam = async (studentId: string, examId: number) => {
  try {
    // Check if the student exists
    const studentExists = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!studentExists) {
      return {
        success: false,
        error: true,
        message: "The student does not exist",
      };
    }

    // Check if the exam exists and include room capacity
    const examExists = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        room: true,
        joinedStudents: true,
      },
    });

    if (!examExists) {
      return {
        success: false,
        error: true,
        message: "The exam does not exist",
      };
    }

    // Check if the room is at capacity
    if (examExists.room && examExists.joinedStudents.length >= examExists.room.capacity) {
      return {
        success: false,
        error: true,
        message: `The room for this exam is at full capacity (${examExists.room.capacity} students).`,
      };
    }

    // Check if the student has already joined this exam
    const isStudentAlreadyJoined = examExists.joinedStudents.some(
      (student) => student.id === studentId
    );

    if (isStudentAlreadyJoined) {
      return {
        success: false,
        error: true,
        message: `You have already joined this exam: ${examExists.title}`,
      };
    }

    // Update the relationship to add the student to the exam
    await prisma.exam.update({
      where: { id: examId },
      data: {
        joinedStudents: {
          connect: { id: studentId },
        },
      },
    });

    return {
      success: true,
      error: false,
      message: `Great! You have successfully joined the exam: ${examExists.title}`,
    };
  } catch (err: any) {
    console.error(err);

    // Identify specific Prisma errors
    if (err.code === "P2002") {
      return {
        success: false,
        error: true,
        message: "A unique constraint was violated",
      };
    }

    if (err.code === "P2025") {
      return {
        success: false,
        error: true,
        message: "Record not found",
      };
    }

    // Generic error message
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred while joining the exam",
    };
  }
};

