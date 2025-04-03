//API to post a quiz
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { teacherId, classId, title, subject, desc } = req.body;

    if (!teacherId || !classId || !title || !subject) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      // Create quiz
      const quiz = await prisma.quiz.create({
        data: {
          title,
          subject,
          desc,
          createdById: teacherId,
          classId,
        },
      });

      return res.status(201).json(quiz);
    } catch (error) {
      console.error("Error posting quiz:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
