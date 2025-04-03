import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required." });
    }

    try {
      const quizzes = await prisma.quiz.findMany({
        where: { classId: parseInt(classId) },
      });

      return res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
