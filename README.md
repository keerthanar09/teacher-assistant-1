# Online Teacher's Assistant Application

This online application is created with the needs of teachers in mind, and to **eliminate** their *repetitive and time consuming* tasks by **automating** them, so that they have more time and energy to focus on their students, and so that the teachers are not overburdened.

## Key Features of the OTAA

### Implemented Features

1. AI powered Quiz generation using Google Forms API
2. Automated Quiz Evaluation
3. User Authentication
4. Automated Feedback for students
5. Ease of access to important information
6. Quiz Creation
7. Separate dashboards for teachers and students.

### Upcoming Features

1. Smart grouping of students to form efficient study groups, based on each student's strenghts and weaknesses.
2. Ability for students to create their own quizzes for practice.

## Hardware Requirements

## Software Requirements

1. Windows 10 or above.
2. Visual Studio Code or a similar code editor.
3. Node.js (Next.js)
4. Gemini API
5. Google Forms API
6. PostgreSQL

## Tech Stack

1. Next.js 
2. Tailwind CSS
3. Gemini API
4. Google Forms API
5. Prisma ORM
6. PostgreSQL
7. React
**Refer to package.json for all the additional installed packages!**

## Set-up Instructions

**Step 1: Clone this GitHub Repository**

Copy this repository link and run `git clone` in your device's terminal. Then run `cd teacher-assistant-1` to enter the project folder.
Run `code .` to open the project in Visual Studio Code.

**Step 2: Install dependencies**

Run `npm install` in the VS Code terminal to install dependencies, and the node_modules folder.

**Step 3: Set-up your .env file**

In the teacher-assistant-1 folder, create a `.env` file and add the following environment variables with appropriate values.

*Get Gemini API key, client email and private key from google AI studio.*
GEMINI_API_KEY
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY

*Get database related variables from vercel after deployment*
POSTGRES_URL
POSTGRES_PRISMA_URL
SUPABASE_URL
NEXT_PUBLIC_SUPABASE_URL
POSTGRES_URL_NON_POOLING
SUPABASE_JWT_SECRET
POSTGRES_USER
NEXT_PUBLIC_SUPABASE_ANON_KEY
POSTGRES_DATABASE="postgres"
SUPABASE_SERVICE_ROLE_KEY
POSTGRES_HOST
SUPABASE_ANON_KEY
EMAIL_USER
EMAIL_PASS
JWT_SECRET

*Obtain the google variables from google cloud console.*
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000

**Step 4: Run Prisma Migrations**

Run `npx prisma migrate dev` in the VS Code terminal.

**Step 5: Start development server**

Run `npm run dev` in the VS Code terminal. *This project is ready for deployment in vercel.*

## References

1) [Next.js Documentation](https://nextjs.org/docs) 
2) [Learn Next.js](https://nextjs.org/learn-pages-router) 
3) [TailwindCSS Documentation](https://tailwindcss.com/docs/)
4) [Prisma ORM Documentation](https://www.prisma.io/docs)
5) [Google Forms API Documentation](https://developers.google.com/apps-script/reference/forms)
6) [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## Authors

1. [Keerthana R](https://github.com/keerthanar09)
2. Monica S
3. Sneha K M
4. Poorvi V Jain








