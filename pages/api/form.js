import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("REQ BODY:", req.body);
    const { questions, title, description } = req.body;
    console.log("recieved questions: ", questions);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "teach-assist@test-project-453107.iam.gserviceaccount.com",
        private_key:process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/forms.body', 'https://www.googleapis.com/auth/forms.responses.readonly'],
    });

    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });

    const formResponse = await forms.forms.create({
      requestBody: {
        info: {
          title: "Generated Quiz"
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
              location: { index: index } // Add location with index
            }
          }))
        }
      });
    // Save formId and questions to your database here
    res.status(200).json({ formId });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
