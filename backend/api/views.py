from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from django.db import IntegrityError, transaction
from .serializers import *
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timezone, timedelta
import jwt
from django.conf import settings
# Create your views here.


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        if not serializer.is_valid():
            return Response({'error':'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                serializer.save()
            return Response({"message":"Registration successful"}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({
                'error':'A user with this username or email already exists.'
                        }, status=status.HTTP_409_CONFLICT)
        

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User does not exist')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        payload = {
            'id' : user.id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
            'iat':datetime.now(timezone.utc)

        }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        response.set_cookie(
            key='jwt', 
            value=token, 
            httponly=True,
            secure=not settings.DEBUG,      # True in production, False in dev
            samesite='None' if not settings.DEBUG else 'Lax'  # 'None' in production, 'Lax' in dev
        )        
        response.data = {
            'jwt':token
        }
        return response
    

class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")
        
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)

        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie(
            'jwt',
            samesite='None' if not settings.DEBUG else 'Lax',
            secure=not settings.DEBUG
        )
        response.data={
            'message':'success'
        }
        return response
    
def checkAuth(request):
    token = request.COOKIES.get('jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated")
    
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated")
    return payload

class CreateRoom(APIView):
    def post(self, request):

        payload = checkAuth(request)
        name = request.data['name']
        capacity = request.data['capacity']
        classcode = request.data['classcode']
        createdBy = User.objects.filter(id = payload['id']).first()
        create_room = Room.objects.create(name=name, capacity=capacity, createdBy=createdBy, classcode=classcode)
        
        create_room.save()
        allot_room = RoomAllotments.objects.create(user=createdBy, roomid=create_room)
        return Response({'message': 'Room has been created successfully'}, status=status.HTTP_201_CREATED)
        
class ListRooms(APIView):
    def get(self, request):

        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        rooms = Room.objects.filter(createdBy=createdBy)
        # print(rooms)
        rooms_data = [
            {
                'id':room.id,
                'name':room.name,
                'capacity':room.capacity,
                'classcode':room.classcode
            }
            for room in rooms
        ]

        return Response(rooms_data)
    
class UpdateRooms(APIView):
    def put(self, request, roomid):

        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        room = Room.objects.filter(id=roomid, createdBy=createdBy).first()

        if not room:
            return Response({'error':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        name = request.data.get('name', room.name)
        capacity = request.data.get('capacity', room.capacity)

        room.name = name
        room.capacity = capacity
        room.save()

        return Response({'message': 'Room data updated'}, status=status.HTTP_200_OK)
    

class DeleteRoom(APIView):
    def delete(self, request, roomid):

        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        room = Room.objects.filter(id=roomid, createdBy=createdBy).first()

        if not room:
            return Response({'error':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        room.delete()
        return Response({'message':'Room deleted successfully'}, status=status.HTTP_200_OK)


# CRUD for Quiz Metadata only
class QuizCreateList(APIView): 
    def get(self, request, roomid):
        # List all quizzes in the given room. Only quiz table is accessed.

        payload = checkAuth(request)
        createdBy = User.objects.filter(id = payload['id']).first()
        room = Room.objects.filter(id=roomid, createdBy=createdBy).first()
        quizzes = Quiz.objects.filter(createdBy=createdBy, room= roomid).order_by('-subject')
        quiz_data = [
            {
                'id':quiz.id,
                'description': quiz.description,
                'title': quiz.title,
                'subject': quiz.subject,
                'createdAt':quiz.createdAt

           }
           for quiz in quizzes
        ]
        return Response(quiz_data)

    def post(self, request, roomid):
        # Create a new quiz. Updates the Quiz table only.
        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        description = request.data['description']
        title = request.data['title']
        room = Room.objects.filter(id=roomid, createdBy=createdBy).first()
        subject = request.data['subject']

        quiz_create = Quiz.objects.create(description=description, title=title, room=room, subject=subject, createdBy=createdBy)
        quiz_create.save()
        return Response({'message':'An empty quiz has been created successfully!'}, status=status.HTTP_201_CREATED)
    

class QuizDetailUpdate(APIView):
    def put(self, request, quiz_id):
        
        payload = checkAuth(request)
        createdBy = User.objects.filter(id = payload['id']).first()
        quiz = Quiz.objects.filter(id=quiz_id, createdBy=createdBy).first()

        if not quiz:
            return Response({'error': 'Quiz was not found'}, status=status.HTTP_404_NOT_FOUND)
        
        description = request.data.get('description', quiz.description)
        title = request.data.get('title', quiz.title)
        subject = request.data.get('subject', quiz.subject)
        quiz.description = description
        quiz.title = title
        quiz.subject = subject
        quiz.save()

        return Response({'message': 'Quiz was updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, quiz_id):
        
        payload = checkAuth(request)
        createdBy = User.objects.filter(id = payload['id']).first()
        quiz = Quiz.objects.filter(id=quiz_id, createdBy=createdBy).first()
        if not quiz:
            return Response({'error': 'Quiz was not found'}, status=status.HTTP_404_NOT_FOUND)
        
        quiz.delete()
        return Response({'message': 'Quiz was deleted successfully'}, status=status.HTTP_200_OK)


class ListAllUserQuiz(APIView):
    def get(self, request):
        payload = checkAuth(request)
        createdBy = User.objects.filter(id = payload['id']).first()
        quizzes = Quiz.objects.filter(createdBy=createdBy).order_by('-subject')
        quiz_data = [
            {
                'id':quiz.id,
                'description': quiz.description,
                'title': quiz.title,
                'subject': quiz.subject,
                'createdAt':quiz.createdAt

           }
           for quiz in quizzes
        ]
        return Response(quiz_data)


# CRUD for Quiz Questions

class QuestionListCreate(APIView):

    def post(self, request, quiz_id):
        # Add questions to a quiz. Updates Questions and QuizQuestions Tables.
        # Questions tables contains all questions created by the teacher, and 
        # QuizQuestions contains the questions corresponding to the given quiz.

        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        quiz = Quiz.objects.filter(createdBy=createdBy, id=quiz_id).first()

        question = request.data['question']
        questionType = request.data['questionType']
        order = request.data['order']
        marks = request.data['marks']
        create_question = Questions.objects.create(question=question, questionType=questionType)
        create_question.save()
        create_quiz_question = QuizQuestions.objects.create(quiz=quiz, question = create_question, order=order, marks=marks)
        create_quiz_question.save()

        return Response({'message':'Created Question Successfully'}, status=status.HTTP_201_CREATED)


    def get(self, request, quiz_id):
        #List questions in a given quiz
        payload = checkAuth(request)
        createdBy = User.objects.filter(id=payload['id']).first()
        quiz = Quiz.objects.filter(createdBy=createdBy, id=quiz_id).first()
        questions = QuizQuestions.objects.filter(quiz=quiz).order_by('-order')
        question_data = [
            {
                'order': question.order,
                'question' : question.question.question,
                'questionType' : question.question.questionType,
                'marks' : question.marks,
            }
            for question in questions
            if question.isActive
        ]

        return Response(question_data)
    

class QuestionDetail(APIView):
    def put(self, request, qq_id):
        # Question Update. Updates the QuizQuestion table, 
        # and updates the ques
        #YET TO FIGURE OUT WHAT TO DO WITH THIS FUNCTION
        pass

    def delete(self, request, question_id):
        # Deletes the question from both databases(?) or only one(?) need to figure 
        # out how to use that isActive variable *face palm*
        pass


# CRUD for question Options

class OptionListCreate(APIView):
    def get(self, request, question_id):

        payload = checkAuth(request)
        question = Questions.objects.filter(id = question_id).first()
        options = Options.objects.filter(question=question)
        option_list = [
            {
                'option': option.option
            }
            for option in options
        ]
        return Response(option_list)


    def post(self, request, question_id):

        payload = checkAuth(request)
        question = Questions.objects.filter(id = question_id).first()
        if question.questionType in ['MCQ', 'Multiple Choice']:
            option = request.data['option']
            isCorrect = request.data['isCorrect']
            option = Options.objects.create(question=question, option=option, isCorrect=isCorrect)
            option.save()

        return Response({'message':'Option created for this question'}, status=status.HTTP_201_CREATED)


class OptionDetail(APIView):
    def put(self, request, option_id):
        pass

    def delete(self, request, option_id):
        pass
