# Online Teacher's Assistant Application

This online application is created with the needs of teachers in mind, and to **eliminate** their *repetitive and time consuming* tasks by **automating** them, so that they have more time and energy to focus on their students, and so that the teachers are not overburdened.

## Key Features of the OTAA

1. JWT Authentication
2. Ability for teachers to create or generate quizzes, create classes with a class code, and post the quiz in the class.
3. Ability for students to join a room and take a quiz, view their grades and performance, and areas of improvements.
4. Teachers able to see student history and SWOTs.



## Project Setup

Follow the following steps for first time setup on a local device. Start off by cloning the repository and opening your code editer in the `teacher-assistant-1` folder.
```
git clone https://github.com/keerthanar09/teacher-assistant-1
cd teacher-assistant-1
```


1) Set up a database in supabase and enter the details of the database in `backend/settings.py`.

2) Open terminal 1 and run the following commands one by one: 
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

3) Open terminal 2 and run the following commands one by one: 
```
npm install
npm run dev
```

Following this, everytime you want to re-start the project, run the following commands in their respective terminals:
```
# Terminal 1 - Backend (Django)

cd backend 
venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend (Next.js)

npm run dev
```

## Database Structure

The following is the Entity Relationship Diagram for the application's database schema entities.

![ER Diagram](LearnCom.png "ER Diagram")