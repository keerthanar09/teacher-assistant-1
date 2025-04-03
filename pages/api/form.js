import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { questions, title = "Generated Quiz", description } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const forms = google.forms({ version: 'v1', auth: oauth2Client });

    // Step 1: Create the form
    const formResponse = await forms.forms.create({
      requestBody: {
        info: {
          title: title,
          description: description || "",
        },
      },
    });

    const formId = formResponse.data.formId;

    // Step 2: Enable Quiz Mode
    await forms.forms.batchUpdate({
      formId: formId,
      requestBody: {
        requests: [
          {
            updateSettings: {
              settings: {
                quizSettings: {
                  isQuiz: true,
                },
              },
              updateMask: "quizSettings.isQuiz",
            },
          },
        ],
      },
    });

    // Step 3: Process Questions with Validation
    const items = questions.map((q) => {
      const options = q.options.map(opt => opt.trim());
      let correctAnswer = q.correctAnswer.trim();

      // Convert correct answer letter (A, B, C) to full text
      const answerIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(correctAnswer);
      if (answerIndex !== -1 && answerIndex < options.length) {
        correctAnswer = options[answerIndex];
      }

      if (!options.includes(correctAnswer)) {
        console.error(`Invalid correct answer: "${correctAnswer}" not in options:`, options);
        throw new Error(`Correct answer "${correctAnswer}" is not in options for question: "${q.question}"`);
      }

      return {
        title: q.question,
        questionItem: {
          question: {
            required: true,
            choiceQuestion: {
              type: 'RADIO',
              options: options.map(opt => ({ value: opt })),
              shuffle: false,
            },
            grading: {
              pointValue: 10,
              correctAnswers: {
                answers: [{ value: correctAnswer }],
              },
            },
          },
        },
      };
    });

    await forms.forms.batchUpdate({
      formId: formId,
      requestBody: {
        requests: items.map((item, index) => ({
          createItem: {
            item,
            location: { index },
          },
        })),
      },
    });

    // Step 4: Save to Database
    await prisma.quiz.create({
      data: {
        formId,
        title,
        desc: description,
        subject: "subject if any",
        createdById: session.user.dbId,
      },
    });

    res.status(200).json({ formId });
  } catch (error) {
    console.error("Form creation error:", error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create form', error: error?.response?.data || error.message });
  }
}
