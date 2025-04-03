import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, classCode, teacherId } = req.body;
      console.log("Received teacherId:", teacherId); 

      if (!name || !classCode || !teacherId) {
        return res.status(400).json({ error: "Missing fields. Ensure all fields are provided." });
      }

      // Ensure teacherId exists in the User table
      const teacher = await prisma.user.findUnique({
        where: { id: parseInt(teacherId) },
      });

      if (!teacher) {
        return res.status(400).json({ error: "Invalid teacher ID." });
      }

      // Check if classCode is unique
      const existingClass = await prisma.room.findUnique({ where: { classCode } });

      if (existingClass) {
        return res.status(400).json({ error: "Class code already exists. Try another one." });
      }

      const newClass = await prisma.room.create({
        data: { name, classCode, createdById:teacherId },
      });

      return res.status(201).json(newClass);
    }

    // 🔹 Handle GET request: Fetch classes for the logged-in teacher
    if (req.method === "GET") {
      const { teacherId } = req.query;

      if (!teacherId) {
        return res.status(400).json({ error: "Missing teacherId in request." });
      }

      const classes = await prisma.room.findMany({
        where: { teacherId },
      });

      return res.status(200).json(classes);
    }
    await prisma.$disconnect();

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
