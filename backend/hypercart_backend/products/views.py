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

class ListCategory(APIView):
    def get(self,request):
        try:
            lst_category=list(Category.objects.filter(int_status=1).values('id','vchr_name'))
            return Response({'status':1,'lstData':lst_category})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class AddProduct(APIView):
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
                file_upload_dir=os.path.join(settings.MEDIA_ROOT,'ProductImages')
                os.makedirs(file_upload_dir,exist_ok=True)
                if request.data.get('image1'):
                    uploaded_file = request.FILES.get('image1')
                    fs=FileSystemStorage(
                        location=file_upload_dir,
                        base_url=settings.MEDIA_URL + 'ProductImages/'
                    )
                    filename=fs.save(uploaded_file.name,uploaded_file)
                    file_url=fs.url(filename)
                    if file_url:
                        lst_images.append(file_url)

                if request.data.get('image2'):
                    uploaded_file=request.FILES.get('image2')
                    fs=FileSystemStorage(
                        location=file_upload_dir,
                        base_url=settings.MEDIA_URL + 'ProductImages/'
                    )
                    filename=fs.save(uploaded_file.name,uploaded_file)
                    file_url2=fs.url(filename)
                    if file_url2:
                        lst_images.append(file_url2)

                if request.data.get('image3'):
                    uploaded_file=request.FILES.get('image3')
                    fs=FileSystemStorage(
                        location=file_upload_dir,
                        base_url=settings.MEDIA_URL + 'ProductImages/'
                    )
                    filename=fs.save(uploaded_file.name,uploaded_file)
                    file_url3=fs.url(filename)
                    if file_url3:
                        lst_images.append(file_url3)
                if request.data.get('image4'):
                    uploaded_file=request.FILES.get('image4')
                    fs=FileSystemStorage(
                        location=file_upload_dir,
                        base_url=settings.MEDIA_URL + 'ProductImages/'
                    )
                    file_name=fs.save(uploaded_file.name,uploaded_file)
                    file_url4=fs.url(file_name)
                    if file_url4:
                        lst_images.append(file_url4)
                if lst_images:
                    ins_product.jsn_images=lst_images
                ins_product.save()

                return Response({'status':1,'message':'Success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})
    def put(self,request):
        try:
            if request.data.get('intProductId'):
                ins_product=Products.objects.filter(int_status=1,id=request.data.get('intProductId')).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty').first()
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
                    file_upload_dir=os.path.join(settings.MEDIA_ROOT,'ProductImages')
                    os.makedirs(file_upload_dir,exist_ok=True)
                    if request.data.get('image1'):
                        if isinstance(request.data.get('image1'), UploadedFile):
                            uploaded_file = request.FILES.get('image1')
                            fs=FileSystemStorage(
                                location=file_upload_dir,
                                base_url=settings.MEDIA_URL + 'ProductImages/'
                            )
                            filename=fs.save(uploaded_file.name,uploaded_file)
                            file_url=fs.url(filename)
                        else:
                           file_url=request.data.get('image1')

                        if file_url:
                            lst_images.append(file_url)

                    if request.data.get('image2'):
                        if isinstance(request.data.get('image2'), UploadedFile):
                            uploaded_file=request.FILES.get('image2')
                            fs=FileSystemStorage(
                                location=file_upload_dir,
                                base_url=settings.MEDIA_URL + 'ProductImages/'
                            )
                            filename=fs.save(uploaded_file.name,uploaded_file)
                            file_url2=fs.url(filename)
                        else:
                            file_url2=request.data.get('image2')
                        if file_url2:
                            lst_images.append(file_url2)

                    if request.data.get('image3'):
                        if isinstance(request.data.get('image3'),UploadedFile):
                            uploaded_file=request.FILES.get('image3')
                            fs=FileSystemStorage(
                                location=file_upload_dir,
                                base_url=settings.MEDIA_URL + 'ProductImages/'
                            )
                            filename=fs.save(uploaded_file.name,uploaded_file)
                            file_url3=fs.url(filename)
                        else:
                            file_url3=request.data.get('image3')

                        if file_url3:
                            lst_images.append(file_url3)
                    if request.data.get('image4'):
                        if isinstance(request.data.get('image4'),UploadedFile):
                            uploaded_file=request.FILES.get('image4')
                            fs=FileSystemStorage(
                                location=file_upload_dir,
                                base_url=settings.MEDIA_URL + 'ProductImages/'
                            )
                            file_name=fs.save(uploaded_file.name,uploaded_file)
                            file_url4=fs.url(file_name)
                        else:
                            file_url4=request.data.get('image4')

                        if file_url4:
                            lst_images.append(file_url4)
                    if lst_images:
                        ins_product.jsn_images=lst_images
                    ins_product.save()

                    return Response({'status':1,'message':'Success'})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class ListProduct(APIView):
    def get(self,request):
        try:
            lst_products=list(Products.objects.filter(int_status=1).values('id','vchr_name','fk_category__vchr_name','dbl_selling_price','jsn_images'))
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
            if request.data.get('searchTerm'):
                lst_product=Products.objects.filter(vchr_name__icontains=request.data.get('searchTerm')).values('id','vchr_name','vchr_description','fk_category_id','fk_category__vchr_name','dbl_selling_price','dbl_offer_price','jsn_images','int_stock_qty')

                return Response({'status':1,'lst_data':lst_product})
        except Exception as e:
            return Response({'status':0,'message':str(e)})