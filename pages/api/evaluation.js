import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    console.log("🔥 [API] Received request at /api/evaluation");
    console.log("🛠 Method:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { formId } = req.body;
    console.log("Received formId:", formId);

    if (!formId) {
      return res.status(400).json({ message: "formId is required" });
    }

    // 🔍 Fetch quiz from database (ensure your database actually stores formId)
    const quiz = await prisma.quiz.findFirst({ where: { formId } });

    if (!quiz) {
      console.error("Quiz not found in database for formId:", formId);
      return res.status(400).json({ message: "Quiz not found in database" });
    }

    console.log("Using formId from database:", quiz.formId);

    // Fetch results from Google Forms API
    const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!response.ok) {
      console.error("Google Forms API error:", await response.text());
      return res.status(400).json({ message: "Failed to fetch quiz responses" });
    }

    const formResponses = await response.json();
    console.log("Full Response:", JSON.stringify(formResponses, null, 2));

    if (!formResponses.responses || formResponses.responses.length === 0) {
      return res.status(400).json({ message: "No responses found" });
    }

    for (const response of formResponses.responses) {
      const userEmail = response.respondentEmail || response.answers?.email?.textAnswers?.answers[0]?.value;

      if (!userEmail) {
        console.warn("No email found for a response. Skipping...");
        continue;
      }

      const user = await prisma.user.findUnique({ where: { email: userEmail } });

      if (!user) {
        console.warn("User not found:", userEmail);
        continue;
      }

      const quizScore = response.totalScore; // Ensure this function is implemented

      console.log(`Inserting: User ${user.id}, Quiz ${formId}, Score ${quizScore}`);

      const existingRecord = await prisma.quizTaken.findFirst({
        where: {
          userId: user.id,
          quizId: formId,
        },
      });
      
      if (existingRecord) {
        // Update existing record
        await prisma.quizTaken.update({
          where: { id: existingRecord.id }, // Use primary key for update
          data: { grades: quizScore },
        });
      } else {
        // Create new record
        await prisma.quizTaken.create({
          data: {
            userId: user.id,
            quizId: formId,
            grades: quizScore,
          },
        });
      }
      
    }

    return res.status(200).json({ message: "Results Updated" });
  } catch (error) {
    console.error("Error inserting quiz results:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
