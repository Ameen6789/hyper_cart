from django.urls import path
from .views import LoginApi,LogOutApI,ChangePassword,ForgotPassword
urlpatterns = [
    # path('list_category',ListCategory.as_view(),name='list_category'),

    path('login_api/',LoginApi.as_view(),name='login_api'),
    path('logout_api',LogOutApI.as_view(),name='logout_api'),
    path('change_password',ChangePassword.as_view(),name='change_password'),
    path('forgot_password',ForgotPassword.as_view(),name='forgot_password')


    
]
