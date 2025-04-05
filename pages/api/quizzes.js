//API to post a quiz in a room.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { formId, classId } = req.body; // get the quiz formId and new roomId

    if (!formId || !classId) {
      return res.status(400).json({ error: "Form ID and Class ID are required." });
    }

    try {
      // Update the quiz
      const updatedQuiz = await prisma.quiz.update({
        where: { formId }, // update by formId (quiz ID)
        data: { roomId: classId }, // set the new roomId
      });

      return res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
