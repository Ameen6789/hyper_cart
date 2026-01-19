from django.urls import path
from .views import ListCategory,AddProduct,ListProduct,SearchProduct
urlpatterns = [
    path('list_category',ListCategory.as_view(),name='list_category'),
    path('add_product',AddProduct.as_view(),name='add_product'),
    path('list_product',ListProduct.as_view(),name='list_product'),
    path('search_product',SearchProduct.as_view(),name='search_product')

]
