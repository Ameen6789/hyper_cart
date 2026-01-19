from django.db import models
# Create your models here.

class Category(models.Model):
    vchr_name=models.CharField(max_length=100)
    dat_created=models.DateTimeField(null=True,blank=True)
    dat_updated=models.DateTimeField(null=True,blank=True)
    int_status=models.IntegerField(default=1)
    def __str__(self):
            return self.vchr_name
    class Meta:
        db_table = 'category'

class Products(models.Model):
    vchr_name = models.CharField(max_length=200)
    vchr_description=models.TextField(null=True,blank=True)
    int_stock_qty = models.IntegerField(null=True,blank=True)
    dbl_selling_price = models.FloatField(null=True,blank=True)
    dbl_offer_price = models.FloatField(null=True,blank=True)
    jsn_images=models.JSONField(null=True,blank=True)
    fk_category=models.ForeignKey(Category,models.DO_NOTHING,null=True,blank=True)
    dat_created=models.DateTimeField(null=True,blank=True)
    dat_updated=models.DateTimeField(null=True,blank=True)
    int_status=models.IntegerField(default=1)

    def __str__(self):
        return self.vchr_name
    class Meta:
        db_table="products"