from django.shortcuts import render
from rest_framework.views import Response,APIView
from django.db import transaction
from .models import Orders,Cart,OrderDetails,CartDetails,Address
from products.models import Products
from datetime import datetime
from django.db.models import F
# Create your views here.



class AddItems(APIView):
    def post(self,request):
        try:
            with transaction.atomic():
                if request.data.get('intProductId'):
                    int_product_id=request.data.get('intProductId')
                    int_user_id=request.user.id
                    ins_product=Products.objects.filter(id=int_product_id).first()
                    dbl_amount = ins_product.dbl_offer_price
                    ins_order = Cart.objects.filter(fk_user_id=int_user_id,int_status=1).last()
                    if ins_order:
                        ins_cart_details = CartDetails.objects.filter(fk_cart_id = ins_order.id,fk_product_id=int_product_id).first()
                        if ins_cart_details:
                            ins_cart_details.int_qty=ins_cart_details.int_qty+1
                            ins_cart_details.dbl_total_amt=ins_cart_details.dbl_total_amt+dbl_amount
                            ins_cart_details.save()
                        
                        else:
                            ins_cart_details=CartDetails.objects.create(
                            fk_cart_id=ins_order.id,
                            fk_product_id=int_product_id,
                            int_qty=1,
                            dbl_ppu=dbl_amount,
                            dbl_total_amt=dbl_amount,
                            )
                            ins_cart_details.save()
                        ins_order.dat_updated=datetime.now()
                        ins_order.dbl_total_amt=ins_order.dbl_total_amt+dbl_amount
                        ins_order.save()
                    else:
                        ins_order=Cart.objects.create(
                            fk_user_id=int_user_id,
                            int_status=1,
                            dat_created=datetime.now(),
                            )

                        ins_order.dbl_total_amt=dbl_amount
                        ins_order.save()
                        ins_cart_details=CartDetails.objects.create(
                            fk_cart_id=ins_order.id,
                            fk_product_id=int_product_id,
                            int_qty=1,
                            dbl_ppu=dbl_amount,
                            dbl_total_amt=dbl_amount,
                        )
                        ins_cart_details.save()

            return Response({'status':1,'message':'success'})

            
        except Exception as e:
            return Response({'status':0,'message':str(e)})

    def put(self,request):
        try:
            with transaction.atomic():
                if request.data.get('intId'):
                    int_id=request.data.get('intId')
                    int_qty=request.data.get('intQty',0)
                    print(request.data.get('intQty'),'dfdsd')
                    if not int_qty or int_qty<=0:
                        ins_cart_details = CartDetails.objects.filter(id = int_id).first()
                        if ins_cart_details:
                            ins_cart_details.delete()
                    elif int_qty>0:
                        ins_cart_details = CartDetails.objects.filter(id = int_id).first()
                        if ins_cart_details:
                            ins_cart_details.int_qty=int_qty
                            ins_cart_details.dbl_total_amt=ins_cart_details.dbl_ppu*int(int_qty)
                            ins_cart_details.save()

                    return Response({'status':1,'message':'success'})

            
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class GetCartItems(APIView):
    def post(self,request):
        try:

            int_user_id=request.user.id
            ins_order = Cart.objects.filter(fk_user_id=int_user_id,int_status=1).last()
            if ins_order:
                lst_cart_details = list(CartDetails.objects.filter(fk_cart_id = ins_order.id).values('id','dbl_ppu','dbl_total_amt','int_qty','fk_product__jsn_images','fk_product_id'))

            else:
                lst_cart_details=[]
                    
            return Response({'status':1,'lst_data':lst_cart_details})

            
        except Exception as e:
            return Response({'status':0,'message':str(e)})

class AddAddress(APIView):
    def get(self,request):
        try:
            with transaction.atomic():
                lst_address=list(Address.objects.filter(fk_user_id=request.user.id).values('id','fk_user_id','vchr_name','bint_phone','int_pincode','vchr_address','vchr_state','vchr_district'))
                return Response({'status':1,'lst_data':lst_address})

        except Exception as e:
            return Response({'status':0,'message':str(e)}) 
    def post(self,request):
        try:
            with transaction.atomic():
                str_name=request.data.get('strName')
                int_mobile=request.data.get('intMobile')
                int_pincode=request.data.get('intPincode')
                str_address=request.data.get('strAddress')
                str_city=request.data.get('strCity')
                str_state=request.data.get('strState')
                Address.objects.create(
                    fk_user_id=request.user.id,
                    vchr_name=str_name,
                    bint_phone=int_mobile,
                    int_pincode=int_pincode,
                    vchr_address=str_address,
                    vchr_state=str_state,
                    vchr_district=str_city
                )
                return Response({'status':1,'message':'Success'})

        except Exception as e:
            return Response({'status':0,'message':str(e)})




class AddOrder(APIView):
    def post(self,request):
        try:
            with transaction.atomic():
                lst_data=request.data.get('lstItemData')
                int_address_id=request.data.get('intAddressId')
                dbl_total_amount=request.data.get('dblTotalAmount')
                if lst_data and len(lst_data)>0:
                    overall_total_amount=0
                    
                    ins_order=Orders.objects.create(
                        dat_order=datetime.now(),
                        fk_user_id=request.user.id,
                        fk_address_id=int_address_id,
                        int_fop=1
                    )
                    for data in lst_data:
                        OrderDetails.objects.create(
                                fk_order_id=ins_order.id,
                                fk_product_id=data['fk_product_id'],
                                int_qty=data['int_qty'],
                                dbl_ppu=data['dbl_ppu'],
                                dbl_total_amt=data['dbl_total_amt']
                        )
                        overall_total_amount+=data['dbl_total_amt']

                        ins_product=Products.objects.filter(
                            id=data['fk_product_id']
                        ).first()
                        if ins_product and ins_product.int_stock_qty<data['int_qty']:
                            raise ValueError(f'Insufficinet Qty for {ins_product.vchr_name}')
                        else:
                            ins_product.int_stock_qty=ins_product.int_stock_qty-data['int_qty']
                            ins_product.save()


                        # .update(
                        #     int_stock_qty=F('int_stock_qty') - data['int_qty']
                        # )
                    ins_order.dbl_total_amt=dbl_total_amount
                    ins_order.save()
                    Cart.objects.filter(fk_user_id=request.user.id,int_status=1).update(int_status=-1)
                    return Response({'status':1,'message':'Success'})
                else:
                    return Response({'status':0,'message':'No Items to Order'})



        except Exception as e:
            return Response({'status':0,'message':str(e)})
        
class GetOrders(APIView):
    def get(self,request):
        try:
            lst_data=list(Orders.objects.filter(fk_user_id=request.user.id).order_by('-id').values('id','fk_address__vchr_name','fk_address__vchr_address','fk_address__bint_phone','dat_order','dbl_total_amt'))
            for data in lst_data:
                ins_order_details=list(OrderDetails.objects.filter(fk_order_id=data['id']).values('int_qty','fk_product__vchr_name'))
                data['int_items']=0
                data['products']=''
                for order in ins_order_details:
                    data['int_items']+=1
                    if data['products']:
                        data['products']=data['products']+ ', ' +order['fk_product__vchr_name'] +' x '+str(order['int_qty'])
                    else:
                        data['products']=order['fk_product__vchr_name'] +' x '+str(order['int_qty'])
                    
            return Response({'status':1,'lst_data':lst_data})
        except Exception as e:
            return Response({'status':0,'message':str(e)})

    def post(self,request):
        try:
            lst_data=list(Orders.objects.all().order_by('-id').values('id','fk_address__vchr_name','fk_address__vchr_address','fk_address__bint_phone','dat_order','dbl_total_amt'))
            for data in lst_data:
                ins_order_details=list(OrderDetails.objects.filter(fk_order_id=data['id']).values('int_qty','fk_product__vchr_name'))
                data['int_items']=0
                data['products']=''
                for order in ins_order_details:
                    data['int_items']+=1
                    if data['products']:
                        data['products']=data['products']+ ', ' +order['fk_product__vchr_name'] +' x '+str(order['int_qty'])
                    else:
                        data['products']=order['fk_product__vchr_name'] +' x '+str(order['int_qty'])
                    
            return Response({'status':1,'lst_data':lst_data})
        except Exception as e:
            return Response({'status':0,'message':str(e)})