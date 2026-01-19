from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class UserDetails(AbstractUser):
    user_type=models.CharField(max_length=50)
    vchr_otp=models.CharField(max_length=10,blank=True, null=True)

    def __str__(self):
        return self.user_type
    class Meta:
        db_table='user_details'
