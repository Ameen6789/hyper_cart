from django.db import models
from users.models import UserDetails
# Create your models here.
from products.models import Products
class Cart(models.Model):
    dat_created=models.DateTimeField(blank=True,null=True)
    dat_updated=models.DateTimeField(blank=True,null=True)
    fk_user=models.ForeignKey(UserDetails,models.DO_NOTHING,blank=True,null=True)
    dbl_total_amt=models.FloatField(blank=True,null=True)
    int_status=models.IntegerField(blank=True,null=True)
    class Meta:
        db_table='cart'

class CartDetails(models.Model):
    fk_cart=models.ForeignKey(Cart,models.DO_NOTHING,blank=True,null=True)
    fk_product=models.ForeignKey(Products,models.DO_NOTHING,blank=True,null=True)
    int_qty=models.IntegerField(blank=True,null=True)
    dbl_ppu=models.FloatField(blank=True,null=True)
    dbl_total_amt=models.FloatField(blank=True,null=True)

    class Meta:
        db_table='cart_details'


class Address(models.Model):
    fk_user=models.ForeignKey(UserDetails,models.DO_NOTHING,blank=True,null=True)
    vchr_name=models.CharField(max_length=200,null=True,blank=True)
    bint_phone=models.BigIntegerField(null=True,blank=True)
    int_pincode=models.IntegerField(null=True,blank=True)
    vchr_address=models.TextField(null=True,blank=True)
    vchr_state=models.CharField(max_length=200,null=True,blank=True)
    vchr_district=models.CharField(max_length=200,null=True,blank=True)
    class Meta:
        db_table='address'


class Orders(models.Model):
    dat_order=models.DateTimeField(blank=True,null=True)
    fk_user=models.ForeignKey(UserDetails,models.DO_NOTHING,blank=True,null=True)
    fk_address=models.ForeignKey(Address,models.DO_NOTHING,blank=True,null=True)
    int_fop=models.IntegerField(blank=True,null=True)
    dbl_total_amt=models.FloatField(blank=True,null=True)
    int_status=models.IntegerField(blank=True,null=True)


    class Meta:
        db_table='orders'

class OrderDetails(models.Model):
    fk_order=models.ForeignKey(Orders,models.DO_NOTHING,blank=True,null=True)
    fk_product=models.ForeignKey(Products,models.DO_NOTHING,blank=True,null=True)
    int_qty=models.IntegerField(blank=True,null=True)
    dbl_ppu=models.FloatField(blank=True,null=True)
    dbl_total_amt=models.FloatField(blank=True,null=True)
    class Meta:
        db_table='order_details'

