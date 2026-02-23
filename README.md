# Online Teacher's Assistant Application

This online application is created with the needs of teachers in mind, and to **eliminate** their *repetitive and time consuming* tasks by **automating** them, so that they have more time and energy to focus on their students, and so that the teachers are not overburdened.

## Key Features of the OTAA

1. JWT Authentication
2. Ability for teachers to create or generate quizzes, create classes with a class code, and post the quiz in the class.
3. Ability for students to join a room and take a quiz, view their grades and performance, and areas of improvements.
4. Teachers able to see student history and SWOTs.



## Development Plan

v0.1 and v0.2 are done. So far, teachers and students can register and login. JWT authentication is used. Teachers can create rooms and quizzes, and students can join a class using the unique classcode, and take quizzes created in that room by the teacher.

### v0.3 — Teacher view: per-room, per-quiz history & review — 2 sprints (1 weeks)

#### Features:
Teacher can open quiz history for a quiz inside a room: list attempts, view per-student answers, timestamps, and score.
Export CSV per quiz attempt list.
Backend/API:
GET /room/:roomId/quiz/:quizId/attempts (with pagination/filtering)
GET /attempt/:attemptId (full attempt payload)
Frontend files to update/add:
pages/teacher/room/[id]/quizzes/[quizId]/history.js
Reuse Layout and auth gate useAuth.
Acceptance: Teacher can view and export all attempts for a quiz in the room.

### v0.4 — User profiles & role UX — 2 sprints (1 weeks)

#### Features:
Profile pages for Teacher and Student: display name, email, avatar, stats (quizzes created/taken), edit profile.
Link profile in top nav (components: LoginNav.jsx / StudentNav.jsx / TeacherNav.jsx).
Backend/API:
GET/PUT /users/:id/profile endpoints.
DB changes: Users table extended (bio, avatarUrl, role-specific metadata) in schema.prisma.
Frontend files to add/update:
[id].js
components/ProfileEditor.jsx
update nav components under components to link profile.
Acceptance: Users can view/edit their profile; changes persist.

### v0.5 — Teacher quiz management (delete, edit, reorder questions) — 1–2 sprints

#### Features:
Teacher can delete quizzes and questions; confirm modal + cascade options handling.
Edit quiz metadata and reorder questions (drag-and-drop or numeric order).
Backend/API:
DELETE /quiz/:id, DELETE /question/:id, PATCH /quiz/:id (reorder/bulk updates).
Soft-delete flag or hard delete with cascade—decide per retention policy.
Frontend files to update:
pages/teacher/quiz/[id].js (add delete, reorder controls)
Add API helper module to centralize fetch calls.
Acceptance: Teachers can delete quizzes/questions; teacher UI updates immediately; audit logs optional.

### v0.6 — Quality improvements, analytics, and concurrency features — 3 sprints

#### Features:
Analytics dashboard per room/teacher (average scores, question difficulty).
Timed quizzes with client/server enforcement.
Real-time notifications for room events (student joined, quiz started) via WebSockets or SSE.
Backend:
Add analytics aggregation jobs or DB views.
Implement WebSocket/SSE service.
Frontend:
pages/teacher/analytics.js
Real-time client integration.
Acceptance: Analytics visible and reasonably performant; timed quiz enforcement and real-time events working.

### v0.7 — Polish, performance, security, testing — ongoing

#### Tasks:
E2E tests for full student-teacher flows.
Load testing on quiz submission endpoints.
Harden auth checks server-side (use useAuth patterns).
Accessibility and responsive fixes.
Acceptance: CI with test coverage; security review done.



