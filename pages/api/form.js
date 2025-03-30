import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the teacher's session (and therefore their access token)
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "teacher") {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { questions, title = "Generated Quiz", description } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const forms = google.forms({ version: 'v1', auth: oauth2Client });

    const formResponse = await forms.forms.create({
      requestBody: {
        info: {
          title: title,
          description: description || "",
        },
      },
    });

    const formId = formResponse.data.formId;

    const items = questions.map((q) => ({
      title: q.question,
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: q.options.map((opt) => ({ value: opt })),
            shuffle: false,
          },
        },
      },
    }));

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
    console.error("Form creation error:", error);
    res.status(500).json({ message: 'Failed to create form', error: error.message });
  }
}
