from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    ROLES = [('TEACHER', 'Teacher'),('STUDENT', 'Student')]
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    name= models.CharField(max_length=255, default="")
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=ROLES, default='STUDENT')

    def __str__(self):
        return self.username

class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE)
    classcode = models.CharField(max_length=20, unique=True)    

    def __str__(self):
        return self.name

class RoomAllotments(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    roomid = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} PART OF {self.roomid.name}"
    

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField()
    title = models.CharField(max_length=200)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    createdBy = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title
    
class Questions(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice'),
        ('DESC', 'Descriptive'),
    ]
    id = models.AutoField(primary_key=True)
    question = models.TextField()
    questionType = models.CharField(max_length=10, choices=QUESTION_TYPES)

    def __str__(self):
        return f"{self.id} - Question {self.question}"
    
class Options(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    option = models.CharField(max_length=255)
    isCorrect = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.question} - option: {self.option}"

class QuizTaken(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    grades = models.FloatField()
    takenAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):  
        return f"{self.user.username} - {self.quiz.title}"
    


class QuizQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    order = models.IntegerField(unique=True)
    marks = models.FloatField()
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.quiz.title} - Question {self.order}"


class StudentAnswers(models.Model):
    id = models.AutoField(primary_key=True)
    quizTaken = models.ForeignKey(QuizTaken, on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE)
    selectedOption = models.ForeignKey(Options, on_delete=models.SET_NULL, null=True, blank=True)
    descAnswer = models.TextField(null=True, blank=True)
    marksObtained = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.quizTaken.user.username} - {self.question.id}"
    
class DescriptiveEvaluation(models.Model):
    answer = models.OneToOneField(StudentAnswers, on_delete=models.CASCADE)
    evaluatedBy = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.TextField(null=True, blank=True)
    evaluatedAt = models.DateTimeField(auto_now_add=True)

    
class Verification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)
    isUsed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.code}"