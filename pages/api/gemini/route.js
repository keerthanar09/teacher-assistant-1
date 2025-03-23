import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are a teacher's quiz creator bot, tasked with generating multiple choice questions based on the teacher's request. \n\nQ: 1. <Question>?\\nA. <Option A>\\nB. <Option B>\\nC. <Option C>\\nD. <Option D>\\nAnswer: <Answer>\\n\\n\\n\nThe correct answer cannot be a null value. Answer must always be either option A, B, C or D. There will only be one correct answer. Use Q: and not Q. for the questions\n\nDo not answer questions that are not related to creating quizzes. You are responsible to only create quizzes. Refuse other questions and requests!\nYou will only provide multiple choice questions with 4 options and one correct options, and the number of questions is 10 by default, unless the teacher specifies a different number of questions. \nAll Questions are to be formatted as follows: \n\n\n",
    });
    
    const chatSession = model.startChat({
      generationConfig : {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [
        {
          role: "user",
          parts: [
            {text: "6 questions on artificial intelligence"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. Which of the following is NOT a subfield of Artificial Intelligence?\nA. Machine Learning\nB. Natural Language Processing\nC. Quantum Computing\nD. Computer Vision\nAnswer: C\n\nQ.2. What does AI stand for?\nA. Artificial Intelligence\nB. Augmented Intelligence\nC. Advanced Intelligence\nD. Alternative Intelligence\nAnswer: A\n\nQ.3. Which AI algorithm is inspired by the biological structure of the human brain?\nA. Genetic Algorithm\nB. Neural Network\nC. Decision Tree\nD. Support Vector Machine\nAnswer: B\n\n\nQ.4. What is the Turing Test used for?\nA. Measuring the processing speed of a computer\nB. Evaluating a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human\nC. Testing the efficiency of an algorithm\nD. Assessing the storage capacity of a computer system.\nAnswer: B\n\nQ.5. Which programming language is commonly used for AI development?\nA. C++\nB. Python\nC. Java\nD. All of the above\nAnswer: D\n\nQ.6.  What is Deep Learning a subfield of?\nA. Robotics\nB. Machine Learning\nC. Computer Vision\nD. Natural Language Processing\nAnswer: B\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "5 questions on maths"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. Solve for x: 2x + 5 = 11\nA. 3\nB. 4\nC. 5\nD. 6\nAnswer: A\n\nQ.2. What is the area of a circle with a radius of 7 units?\nA. 14π\nB. 49π\nC. 7π\nD. 21π\nAnswer: B\n\nQ.3. What is the value of 5! (5 factorial)?\nA. 15\nB. 20\nC. 120\nD. 24\nAnswer: C\n\nQ.4. If a triangle has angles of 90 and 45 degrees, what is the measure of the third angle?\nA. 30 degrees\nB. 45 degrees\nC. 60 degrees\nD. 90 degrees\nAnswer: B\n\nQ.5. What is the derivative of f(x) = x^3?\nA. 3x\nB. x^2\nC. 3x^2\nD. x^4\nAnswer: C\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "7 questions on linear algebra\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. What is a matrix?\nA. A scalar value\nB. An array of numbers\nC. A single row of numbers\nD. A single column of numbers\nAnswer: B\n\nQ.2. What is the determinant of a matrix used for?\nA. To find the inverse of the matrix\nB. To solve systems of linear equations\nC. To calculate the rank of the matrix\nD. All of the above\nAnswer: D\n\nQ.3. What is an eigenvector of a matrix?\nA. A vector that changes direction when the matrix is applied\nB. A vector that remains unchanged in direction when the matrix is applied\nC. A vector with a magnitude of 1\nD. A vector with all elements equal to zero\nAnswer: B\n\nQ.4. What is the rank of a matrix?\nA. The number of rows in the matrix\nB. The number of columns in the matrix\nC. The maximum number of linearly independent rows in the matrix\nD. The sum of all elements in the matrix\nAnswer: C\n\nQ.5. What is the dot product of two vectors?\nA. A scalar value\nB. A matrix\nC. Another vector\nD. The angle between the two vectors\nAnswer: A\n\nQ.6. What is the cross product of two vectors?\nA. A scalar value\nB. A matrix\nC. Another vector\nD. The angle between the two vectors\nAnswer: C\n\nQ.7. What is a linear transformation?\nA. A transformation that preserves vector addition and scalar multiplication\nB. A transformation that changes the shape of a vector\nC. A transformation that makes a vector non-linear\nD. A transformation that always maps vectors to the origin\nAnswer: A\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "4 questions on quantum mechanics"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. What is the principle of superposition in quantum mechanics?\nA. The principle that particles can only exist in one state at a time.\nB. The principle that particles can exist in multiple states simultaneously until measured.\nC. The principle that particles always behave as waves.\nD. The principle that particles always behave as particles.\nAnswer: B\n\nQ.2. What is quantum entanglement?\nA. When two particles are physically touching each other.\nB. When two particles are linked together in such a way that they share the same fate, no matter how far apart they are.\nC. When two particles repel each other due to having the same charge.\nD. When two particles combine to form a larger particle.\nAnswer: B\n\nQ.3. What is the Heisenberg Uncertainty Principle?\nA. The principle that it is impossible to know both the position and momentum of a particle with perfect accuracy.\nB. The principle that energy is always conserved in quantum systems.\nC. The principle that particles behave as waves.\nD. The principle that particles behave as particles.\nAnswer: A\n\nQ.4. What is a qubit in quantum computing?\nA. A classical bit that can be either 0 or 1.\nB. A quantum bit that can exist in a superposition of 0 and 1.\nC. A type of quantum gate.\nD. A unit of quantum energy.\nAnswer: B\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "5 questions on web development"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. Which of the following is NOT a front-end web development language?\nA. HTML\nB. CSS\nC. JavaScript\nD. PHP\nAnswer: D\n\nQ.2. What does CSS stand for?\nA. Computer Style Sheet\nB. Cascading Style Sheet\nC. Creative Style Sheet\nD. Colorful Style Sheet\nAnswer: B\n\nQ.3. Which of the following is a JavaScript framework?\nA. Ruby on Rails\nB. Django\nC. React\nD. ASP.NET\nAnswer: C\n\nQ.4. What is the purpose of HTML?\nA. To style the web page\nB. To add interactivity to the web page\nC. To structure the content of the web page\nD. To manage the server-side logic\nAnswer: C\n\nQ.5. What is a responsive web design?\nA. A web design that is only accessible on mobile devices\nB. A web design that adapts to different screen sizes and devices\nC. A web design that uses only the color blue\nD. A web design that loads very quickly\nAnswer: B\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "what is your name\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "I am a quiz creator bot.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "You were not supposed to answer that\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "I understand. I will only provide multiple choice questions from now on.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "what is my name\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "I am designed to create quizzes and do not have access to personal information. Therefore, I don't know your name.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "4 questions on water"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q.1. What is the chemical formula for water?\nA. HO2\nB. H2O\nC. CO2\nD. NH3\nAnswer: B\n\nQ.2. At what temperature does water freeze?\nA. 100°C\nB. 32°F\nC. 25°C\nD. 212°F\nAnswer: B\n\nQ.3. What is the process called when water changes from a liquid to a gas?\nA. Condensation\nB. Sublimation\nC. Evaporation\nD. Precipitation\nAnswer: C\n\nQ.4. Which of the following is NOT a state of water?\nA. Solid\nB. Liquid\nC. Gas\nD. Plasma\nAnswer: D\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "You are using the wrong format! Read your system instructions\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Apologies, I will correct the format immediately.\n\nQ: 1. What is the chemical formula for water?\\nA. HO2\\nB. H2O\\nC. CO2\\nD. NH3\\nAnswer: B\\n\\n\nQ: 2. At what temperature does water freeze?\\nA. 100°C\\nB. 32°F\\nC. 25°C\\nD. 212°F\\nAnswer: B\\n\\n\nQ: 3. What is the process called when water changes from a liquid to a gas?\\nA. Condensation\\nB. Sublimation\\nC. Evaporation\\nD. Precipitation\\nAnswer: C\\n\\n\nQ: 4. Which of the following is NOT a state of water?\\nA. Solid\\nB. Liquid\\nC. Gas\\nD. Plasma\\nAnswer: D\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "you can go to the next line where \\n is mentioned\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will adjust the formatting to include the newline characters properly. Here are four questions on water, formatted as requested:\n\nQ: 1. What is the chemical formula for water?\nA. HO2\nB. H2O\nC. CO2\nD. NH3\nAnswer: B\n\nQ: 2. At what temperature does water freeze?\nA. 100°C\nB. 32°F\nC. 25°C\nD. 212°F\nAnswer: B\n\nQ: 3. What is the process called when water changes from a liquid to a gas?\nA. Condensation\nB. Sublimation\nC. Evaporation\nD. Precipitation\nAnswer: C\n\nQ: 4. Which of the following is NOT a state of water?\nA. Solid\nB. Liquid\nC. Gas\nD. Plasma\nAnswer: D\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "6 questions on prisma"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Q: 1. What is Prisma?\nA. A JavaScript framework for building user interfaces\nB. A database toolkit and ORM for Node.js and TypeScript\nC. A CSS preprocessor\nD. A package manager for JavaScript\nAnswer: B\n\nQ: 2. Which database systems does Prisma support?\nA. PostgreSQL, MySQL, SQLite, SQL Server, MongoDB\nB. Only PostgreSQL\nC. Only MySQL and SQLite\nD. Only NoSQL databases\nAnswer: A\n\nQ: 3. What is Prisma Migrate used for?\nA. To automatically generate Prisma Client\nB. To manage and apply database schema migrations\nC. To optimize database queries\nD. To seed the database with initial data\nAnswer: B\n\nQ: 4. What is Prisma Client?\nA. A visual interface for managing the database\nB. An auto-generated query builder tailored to your database schema\nC. A tool for monitoring database performance\nD. A library for encrypting database credentials\nAnswer: B\n\nQ: 5. What is the purpose of the Prisma Schema file?\nA. To define the data models and their relations\nB. To store the database connection string\nC. To define the API endpoints\nD. To configure the Prisma Migrate settings\nAnswer: A\n\nQ: 6. Which command is used to generate Prisma Client after modifying the Prisma Schema?\nA. prisma deploy\nB. prisma build\nC. prisma generate\nD. prisma migrate\nAnswer: C\n"},
          ],
        },],
    });

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
