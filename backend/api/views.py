from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
# import jwt
from django.db import IntegrityError, transaction
from .serializers import *
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
        