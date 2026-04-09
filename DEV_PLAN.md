# Development Plan

v0.1 and v0.2 are done. So far, teachers and students can register and login. JWT authentication is used. Teachers can create rooms and quizzes, and students can join a class using the unique classcode, and take quizzes created in that room by the teacher.

## [DONE] v0.3 - Teacher view: per-room, per-quiz history & review

### Features:
- Teachers can open quiz history for a quiz inside a room: list attempts, view per-student answers and score.
- Reused Layout and auth gate useAuth.
- Teacher can export the list of attempts *for the given quiz* into a CSV file.
- Added Backend APIs:
GET quiz/:quizId/attempts 
GET /attempt/:attemptId (full attempt payload)

## [DONE]v0.4 - User profiles

### Features:
- User can access their profile page from the side navigation bar.
- Profile pages for Teacher and Student: display name, email and role.

## Test-1 : Testing Current Backend Views

*Only proceed to v0.5 after testing current views and noting bugs/flaws in system.*

## v0.5 - Teacher quiz management (delete, edit, reorder questions)

### Patches/Improvements Required from previous versions.

- Session timeout is not handled gracefully. This needs to be fixed.
- Need to view per question marks while viewing answers from students in an attempt. 
- Limit the marks alloted for a DESC question by a teacher to the maximum marks.
- Paginations and Numbering of records required
- Filter option not implemented yet.
- **An update to the questions of a quiz makes the grades of previous attempts fluctuate. Quizzes need to be saved once the teacher is done creating it, thereby not allowing this glitch.**
- Make it possible for user to edit their profile.
- Add user avatar, and user statistics to their profile to make it interesting.

### Features:
- Teacher can delete quizzes and questions; confirm modal + cascade options handling.
- Edit quiz metadata and reorder questions (drag-and-drop or numeric order).
- Backend/API:
DELETE /quiz/:id, DELETE /question/:id, PATCH /quiz/:id (reorder/bulk updates).
- Soft-delete flag or hard delete with cascade—decide per retention policy.
- Frontend files to update:
pages/teacher/quiz/[id].js (add delete, reorder controls)
- Add API helper module to centralize fetch calls.
- Acceptance: Teachers can delete quizzes/questions; teacher UI updates immediately; audit logs optional.

## v0.6 - Quality improvements, analytics, and concurrency features

### Features:
- Analytics dashboard per room/teacher (average scores, question difficulty).
- Timed quizzes with client/server enforcement.
- Real-time notifications for room events (student joined, quiz started) via WebSockets or SSE.
- Backend:
Add analytics aggregation jobs or DB views.
Implement WebSocket/SSE service.
- Frontend:
pages/teacher/analytics.js
Real-time client integration.
- Acceptance: Analytics visible and reasonably performant; timed quiz enforcement and real-time events working.

## v0.7 - Polish, performance, security, testing

### Tasks:
- E2E tests for full student-teacher flows.
- Load testing on quiz submission endpoints.
- Harden auth checks server-side (use useAuth patterns).
- Accessibility and responsive fixes.
- Acceptance: CI with test coverage; security review done.

## v1.0 - Setup for RAG-based functionalities and integration of external APIs

- Setup chromaDB and document schema. This is to implement a feature that lets a teacher generate study notes and tests from various study materials.
- Setup `.env` file and other configuration files that may be required to integrate external APIs such as Gemini API, Google Forms and Google Sheets API, which may enable a student management automation system.
- Acceptance: All tests for the setup passes.