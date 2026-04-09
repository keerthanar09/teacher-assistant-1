from django.urls import path
from .views import *
urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('createroom', CreateRoom.as_view()),
    path('listrooms', ListRooms.as_view()),
    path('updaterooms/<uuid:roomid>', UpdateRooms.as_view()),
    path('deleteroom/<uuid:roomid>', DeleteRoom.as_view()),
    path('quiz/<uuid:roomid>', QuizCreateList.as_view()),
    path('quizupdates/<int:quiz_id>', QuizDetailUpdate.as_view()),
    path('allquiz', ListAllUserQuiz.as_view()),
    path('question/<int:quiz_id>', QuestionListCreate.as_view()), #creates and lists questions in a quiz based on request type (post and put)
    path('option/<int:question_id>', OptionListCreate.as_view()),
    # Quiz/test evaluation history
    path('teacher/quiz/<int:quiz_id>/attempts', teacher_quiz_attempts),
    path('teacher/attempt/<int:attempt_id>', teacher_attempt_detail),
    path('teacher/evaluate/<int:answer_id>', evaluate_answer),
    path('teacher/quiz/<int:quiz_id>/export', export_quiz_attempts_csv),
    # Student endpoints
    path('room/join', room_join),
    path('student/rooms', student_rooms),
    path('room/<uuid:roomid>', room_detail),
    path('room/<uuid:roomid>/quizzes', room_quizzes),
    path('quiz/<int:quiz_id>/details', student_quiz_detail),
    path('quiz/<int:quiz_id>/questions', student_question_list),
    path('quiz/<int:quiz_id>/attempts', submit_quiz_attempt),
]