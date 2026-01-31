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
]