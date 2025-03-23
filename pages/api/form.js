import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("REQ BODY:", req.body);
    const { questions, title, description } = req.body;
    console.log("recieved questions: ", questions);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "teach-assist@test-project-453107.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDK13F/j2SyxeO9\\nv6KiSPSRrVplqEgB2gf8fT3mq0kAto7swj2gcs1C/fkzT7Sm0MEml6tQyImihwT+\\nC1D/tO0chvLbr6612hLn6Hw+/DzXIVSLisABDG8c2y5FIQ22UDuTNEY9QgJjsfK4\\nTjVC6Ghcf1uw3DjJIPFLDoPkPDaI/dqkJM82rNwSf09gMcn4UtZx9Z7b7uSXKeTM\\nSKFV5Gz7dgGe9i/I3zkPm5jjCDhB1GVmfUCeavJiu70ArWC1X68hHDJ9/Qr8dGqr\\nPz0wgVqJY5IjufJlSZ7FuthafjcOI2FDfcTf0j8ht+gPo864t8PpCeunE2cMvVMw\nER7R29K7AgMBAAECggEASL3rY3n6fEwQSJdlTPqJzoZS8Trgm91jWM5XORY7B2jw\np4JfFF+nMbuftyGB4QLjCaKBmuZXyXPPPAW15gWttLnGdTczGd8bQZRznijZ7rJy\nvdoj0hxx6nDFzp+0aamrO7aW69f0wGjr6OGPIy/yYR2BNdM8ABDyx15suRhI3GY9\nl+PSHu/xnpM7VaDYHiYH+0zcSlWSS2zMsnyvLEpNL0ZyH6C4h0hYgorxmKMLbxq2\nc1q5gxXME6aZfeQ17itjDjgBDuEkpUbcyOWeeTRMg6c2hW3JHfwvo/0VkjPYOmLS\nf16nMGhuUc2yT3WUEmjjJlbFk+tDKnrLU75kQM3R8QKBgQDp2tVD6IRC1Nezxdaa\nwIMkULsgnbqskvQhaNdBjRg24EunPLkSieG5o2R/R5LWt0hl+Z3AMGE0bkkRVrwR\nZMY9EdnspJ42BTjwukH5JKQYeT5V5Fnz18j2SZv5s3uVp3QBsG4sMfsUwjQxATZ/\nGcmsDtbX9YvlNZHjuQ0YrH1B8QKBgQDeDMeQBj2MtBLd6Y2lgpuzAiuc8PYsiSxY\nansOSYqYb9u7fqGxiTOwotSdRkAv2odRn96gVJnNzGvyx+I/W9N5AJ0Ca6z9jq+5\ntVwPD9kUE1yYKBVkMr5JSzM6IpB5CsNXKdPGPdZlJtXexMBqKRGTIBHunQw8fxlg\nuLd2AQJzawKBgQC/nQov2V498G5JpCpCpMkPwYKCqBrj+olEssXltTmJBWGXx16R\nvR6SYDohPEEp5AXTYKOMbVfIgTEnntz8l4kDUxQwHXZxJvhP7x3NieNXFkkoUbIO\n5dmJTCkcgZ8asZmRJMIxPkbP7IydNrQzkqq3a3VIgK6/AZTndaIwfG0p0QKBgFgU\n/7C9GPtQj09iDyNBjRvUV5KY7z45Z9Lm4kuHlqfjb2mP0PpI76042lhM/rc824Lg\nhQJarOw7E/MpoTD67wdH3ACSz/uA92oWbB85bSYOjCN7ewjVLDCM2RRNk7vALj7M\nQ8qWyw4y+pG0wJMcGXGgPhzGRY1V6a45d+Uif2NjAoGBAMuyHIT5ZfOiSZJuPWPy\nmFPHslmQBBV1DOlFdNoWZVmlIjGRfUwka6gfoq571uQY9Vk6JjOBpaFvR+j+Z+bN\nQbwZd7At9BbiQCVisQTa0+wKgFnm1xBY2USDFTGKz5pO/wc9lP02BT/UIF3ND1LH\nrL72NtW1SWiKUCjAt9HNCLo9\\n-----END PRIVATE KEY-----\\n".replace(/\\n/g, '\n'),
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
