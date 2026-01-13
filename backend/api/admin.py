from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Role)
admin.site.register(User)
admin.site.register(Room)
admin.site.register(Quiz)
admin.site.register(QuizTaken)
admin.site.register(Verification)