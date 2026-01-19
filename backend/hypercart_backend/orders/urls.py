from django.urls import path
from .views import AddItems,GetCartItems,AddAddress,AddOrder,GetOrders
# from views import 
urlpatterns = [
    # path('list_category',name='list_category')
    path("add_items",AddItems.as_view(),name="add_items"),
    path("get_cart_items",GetCartItems.as_view(),name="get_cart_items"),
    path("add_address",AddAddress.as_view(),name="add_address"),
    path("add_order",AddOrder.as_view(),name="add_order"),
    path("get_orders",GetOrders.as_view(),name="get_orders")


]
