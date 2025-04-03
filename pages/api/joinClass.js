import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { studentId, classCode } = req.body;

    if (!studentId || !classCode) {
      return res.status(400).json({ error: "Student ID and Class Code are required." });
    }

    try {
      // Find the class using classCode
      const room = await prisma.room.findUnique({
        where: { classCode },
        include: { students: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Invalid class code. No class found." });
      }

      // Check if student is already in the class
      const alreadyJoined = room.students.some((student) => student.id === studentId);
      if (alreadyJoined) {
        return res.status(400).json({ error: "You are already enrolled in this class." });
      }

      // Add student to the class
      await prisma.room.update({
        where: { id: room.id },
        data: { students: { connect: { id: studentId } } },
      });

      return res.status(201).json({ message: "Successfully joined the class!", class: room });
    } catch (error) {
      console.error("Error joining class:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
