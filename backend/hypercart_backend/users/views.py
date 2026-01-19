from django.shortcuts import render
from rest_framework.views import APIView,Response
from products.models import Category,Products
from django.contrib.auth.models import User
from .models import UserDetails
import os
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from django.db import transaction
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from rest_framework import status
# from django.contrib.
from django.contrib.auth import authenticate,login,logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import random
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
# Create your views here.

class LoginApi(APIView):
    def post(self,request):
        try:
            with transaction.atomic():
                strName=request.data.get('strName')
                first_name=''
                last_name=''
                if strName:
                    name_parts = strName.strip().split()
                    first_name = name_parts[0]
                    last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

                username=request.data.get('email')
                useremail=request.data.get('email')
                userpass=request.data.get('password')
                user_type='CUSTOMER'
                
                if UserDetails.objects.filter(username=useremail).exists():
                    return Response(
                        {'status': 0, 'message': 'Username already exists'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user = UserDetails.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                username=useremail,
                email=useremail,
                password=userpass,
                user_type='CUSTOMER'
            )

                return Response(
                    {'status': 1, 'message': 'User created successfully'},
                    status=status.HTTP_201_CREATED
    )
        except Exception as e:
            return Response({'status':0,'message':str(e)})

    def put(self,request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'status': 0, 'message': 'Email and password required'})
        
        user = authenticate(username=email,password=password)
        login

        if not user:
            return Response({'status': 0, 'message': 'Invalid credentials'})
        login(request, user)
        refresh=RefreshToken.for_user(user)
        return Response({
        'status': 1,
        'message': 'Login successful',
        'data': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_type': user.user_type,
            'user_id': user.id,
            'name': f"{user.first_name} {user.last_name}"
        }
    })

class LogOutApI(APIView):
    def post(self,request):
        try:
            username=request.data.get('username')
            logout(request)
            return Response({'status':1,'message':'success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class ChangePassword(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            import pdb;pdb.set_trace()
            user_id=request.data.get('userid')
            current_password=request.data.get('password')
            new_password=request.data.get('newPassword')
            ins_user=UserDetails.objects.filter(id=user_id).first()
            if ins_user:
                if not request.user.check_password(current_password):
                    return Response({'status': 0, 'message': 'Current password is incorrect'})
                user=request.user
                user.set_password(new_password)
                user.save()
            return Response({'status':1,'message':'success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})
    
class ForgotPassword(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            user_email=request.data.get('strEmail')

            ins_user=UserDetails.objects.filter(email=user_email).first()
            if ins_user:
                int_otp=random.randint(111111,999999)
                ins_user.vchr_otp=str(int_otp)
                ins_user.save()
            #     subject = "Password Reset OTP"
            #     message = f"""
            # Hello {ins_user.email},

            # We received a request to reset your password.

            # Your OTP is: {ins_user.vchr_otp}

            # This OTP is valid for 2 minutes.
            # Do not share it with anyone.

            # If you did not request this, please ignore this email.

            # Thanks,
            # Support Team
            # """

            #     send_mail(
            #         subject,
            #         message,
            #         settings.DEFAULT_FROM_EMAIL,
            #         [ins_user.email],
            #         fail_silently=False,
            #     )

                subject = "Password Reset OTP"

                context = {
                    "email": ins_user.email,
                    "otp": ins_user.vchr_otp,
                    "logo_url": "https://yourdomain.com/static/images/logo.png"
                }

                html_content = render_to_string("emails/reset_password.html", context)

                email = EmailMultiAlternatives(
                    subject,
                    "",  # plain text fallback
                    settings.DEFAULT_FROM_EMAIL,
                    [ins_user.email],
                )

                email.attach_alternative(html_content, "text/html")
                email.send()


                return Response({'status':1,'message':'success'})
            else:
                return Response({'status': 2, 'message': 'Email Not Found'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})


    def put(self,request):
        try:
            user_email=request.data.get('strEmail')
            str_otp=request.data.get('strOtp','')

            ins_user=UserDetails.objects.filter(email=user_email,vchr_otp=str(request.data.get('strOtp'))).first()
            if ins_user:

                return Response({'status':1,'message':'success'})
            else:
                return Response({'status': 2, 'message': 'Invalid Otp'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})


    def patch(self,request):
        try:
            user_email=request.data.get('strEmail')
            new_password=request.data.get('newPassword')

            ins_user=UserDetails.objects.filter(email=user_email).first()
            if ins_user:
                ins_user.set_password(new_password)
                ins_user.save()
                return Response({'status':1,'message':'success'})
            else:
                return Response({'status': 2, 'message': 'Email Not Found'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

    # dct_data['password']=this.strCurrentPassword
    # dct_data['newPassword']=this.strNewPassword
    # dct_data['strEmail']=this.strEmail
