from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    fullname= models.CharField(max_length=255, default="")
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)

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

class QuizTaken(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    grades = models.FloatField()
    takenAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):  
        return f"{self.user.username} - {self.quiz.title}"
    
class Verification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)
    isUsed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.code}"