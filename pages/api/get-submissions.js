import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const submissions = await prisma.quizTaken.findMany({
      include: {
        user: { select: { username: true } },
        quiz: { select: { title: true } },
      },
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
