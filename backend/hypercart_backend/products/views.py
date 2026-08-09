from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView,Response
from products.models import Category,Products
import os
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from django.db import transaction
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.cache import cache
import os

class ListCategory(APIView):
    def get(self,request):
        try:
            int_category_id=request.GET.get('intCategoryId')
            if int_category_id:
                ins_category=Category.objects.filter(int_status=1,id=int_category_id).values('id','vchr_name').first()
                if ins_category:
                    return Response({'status':1,'ins_category':ins_category})
                else:
                    return Response({'status':0,'message':'Not Found'},status=status.HTTP_404_NOT_FOUND)

            else:
                lst_category=cache.get_or_set("lst_category",list(Category.objects.filter(int_status=1).values('id','vchr_name')),timeout=300)

                return Response({'status':1,'lstData':lst_category},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'status':0,'message':str(e)})
        
    def post(self,request):
        try:
            vchr_category=request.data.get("strCategory")
            Category.objects.create(vchr_name=vchr_category,dat_created=datetime.now(),int_status=1)
            return Response({'status':1,'message':'success'},status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'status':0,'message':str(e)})  


    def put(self,request):
        try:
            vchr_category=request.data.get("strCategory")
            int_category_id=request.data.get('intCategoryId')
            if int_category_id:
                ins_category=Category.objects.filter(id=int(int_category_id)).first()
                if ins_category:
                    ins_category.vchr_name=vchr_category
                    ins_category.dat_updated=datetime.now()
                    ins_category.save()
            else:
                return Response({'status':0,'message':'Not Found'},status=status.HTTP_404_NOT_FOUND)
            return Response({'status':1,'message':'success'},status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'status':0,'message':str(e)})    


class AddProduct(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        
        try:
            with transaction.atomic():
                if Products.objects.filter(vchr_name=request.data.get('strProduct',''),int_status=1).exists():
                    return Response({'status':0,'message':'Product Already Exists!'})
                product=request.data.get('strProduct','')
                product_desc=request.data.get('strProductDescription','')
                category_id=request.data.get('selectedCategoryId',None)
                stock_qty=request.data.get('intStock',0)
                product_price=request.data.get('intProductPrice',0)
                offer_price=request.data.get('intOfferPrice',0)
                ins_product=Products.objects.create(
                    vchr_name = product,
                    vchr_description=product_desc,
                    int_stock_qty = stock_qty,
                    dbl_selling_price = product_price,
                    dbl_offer_price = offer_price,
                    # jsn_images=
                    fk_category_id=category_id,
                    dat_created=datetime.now(),
                    int_status=1
                )
                lst_images=[]
                for key in ['image1', 'image2', 'image3', 'image4']:
                    file = request.FILES.get(key)
                    if file:
                        # Save temporarily in model field or directly upload
                        ins_product_image = file
                        ins_product_image.name = f'ProductImages/{file.name}'

                        # If you're NOT using model ImageField, upload manually via model
                        saved_file = default_storage.save(ins_product_image.name, ins_product_image)
                        file_url = default_storage.url(saved_file)

                        lst_images.append(file_url)
                if lst_images:
                    ins_product.jsn_images=lst_images
                ins_product.save()
                cache.delete("lst_products")

                return Response({'status':1,'message':'Success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})
    def put(self,request):
        try:
            if request.data.get('intProductId'):
                ins_product=cache.get_or_set(
                    f'lst_products:{request.data.get('intProductId')}',
                    Products.objects.filter(int_status=1,id=request.data.get('intProductId')).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty').first(),
                    timeout=300)
                return Response({'status':1,'data':ins_product})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

    def patch(self,request):
        
        try:
            with transaction.atomic():
                if request.data.get('intProductId'):
                    if Products.objects.filter(vchr_name=request.data.get('strProduct',''),int_status=1).exclude(id=int(request.data.get('intProductId'))).exists():
                        return Response({'status':0,'message':'Product Already Exists!'})
                    product=request.data.get('strProduct','')
                    product_desc=request.data.get('strProductDescription','')
                    category_id=request.data.get('selectedCategoryId',None)
                    stock_qty=request.data.get('intStock',0)
                    product_price=request.data.get('intProductPrice',0)
                    offer_price=request.data.get('intOfferPrice',0)
                    ins_product=Products.objects.filter(id=int(request.data.get('intProductId'))).first()
                    ins_product.vchr_name=product
                    ins_product.vchr_description=product_desc
                    ins_product.int_stock_qty=stock_qty
                    ins_product.dbl_selling_price=product_price
                    ins_product.dbl_offer_price=offer_price
                    ins_product.fk_category_id=category_id
                    ins_product.dat_updated=datetime.now()

                    lst_images=[]
                    for key in ['image1', 'image2', 'image3', 'image4']:
                        value = request.data.get(key)

                        if value:
                            # ✅ New upload
                            if isinstance(value, UploadedFile):
                                file = request.FILES.get(key)

                                filename = f'ProductImages/{file.name}'
                                saved_path = default_storage.save(filename, file)

                                file_url = default_storage.url(saved_path)

                            # ✅ Existing URL
                            else:
                                file_url = value

                            if file_url:
                                lst_images.append(file_url)
                    if lst_images:
                        ins_product.jsn_images=lst_images
                    ins_product.save()

                    cache.delete('lst_products')
                    cache.delete(f'lst_products:{request.data.get('intProductId')}')
                    return Response({'status':1,'message':'Success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class ListProduct(APIView):
    def get(self,request):
        try:
            lst_products=cache.get("lst_products")
            if not lst_products:
                lst_products=list(Products.objects.filter(int_status=1).values('id','vchr_name','fk_category__vchr_name','dbl_selling_price','jsn_images'))
                cache.set("lst_products",lst_products,timeout=600)
            return Response({'status':1,'lstData':lst_products})
        except Exception as e:
            return Response({'status':0,'message':str(e)})
    def post(self,request):
        try:
            if request.data.get('intProductId'):
                ins_product=Products.objects.filter(id=request.data.get('intProductId')).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty').first()
                lst_products=list(Products.objects.filter(int_status=1).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty'))
                return Response({'status':1,'data':ins_product,'lstData':lst_products})
            else:
                if request.data.get('IntCategoryId'):
                    lst_products=list(Products.objects.filter(int_status=1,fk_category_id=int(request.data.get('IntCategoryId'))).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty'))
                else:
                    lst_products=list(Products.objects.filter(int_status=1).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty'))
                return Response({'status':1,'lstData':lst_products})


        except Exception as e:
            return Response({'status':0,'message':str(e)})


class SearchProduct(APIView):
    def post(self,request):
        try:
            lst_product=[]
            if request.data.get('searchTerm'):
                cache_key =f"search_prodducts:{request.data.get('searchTerm')}"
                lst_product=cache.get_or_set(cache_key, Products.objects.filter(vchr_name__icontains=request.data.get('searchTerm')).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty'),timeout=300)
            return Response({'status':1,'lst_data':lst_product})
        except Exception as e:
            return Response({'status':0,'message':str(e)})