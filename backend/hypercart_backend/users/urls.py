from django.urls import path
from .views import LoginApi,LogOutApI,ChangePassword,ForgotPassword,UserPermissionCheck,PingView
urlpatterns = [

    path('login_api/',LoginApi.as_view(),name='login_api'),
    path('logout_api',LogOutApI.as_view(),name='logout_api'),
    path('change_password',ChangePassword.as_view(),name='change_password'),
    path('forgot_password',ForgotPassword.as_view(),name='forgot_password'),
    path('user_permission_check',UserPermissionCheck.as_view(),name='user_permission_check'),
    path('ping_check',PingView.as_view(),name='ping_check')



    
]
