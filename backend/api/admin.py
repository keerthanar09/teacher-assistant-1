from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Room)
admin.site.register(Quiz)
admin.site.register(QuizTaken)
admin.site.register(Verification)
admin.site.register(RoomAllotments)
admin.site.register(Questions)
admin.site.register(StudentAnswers)
admin.site.register(Options)
admin.site.register(DescriptiveEvaluation)
admin.site.register(QuizQuestions)