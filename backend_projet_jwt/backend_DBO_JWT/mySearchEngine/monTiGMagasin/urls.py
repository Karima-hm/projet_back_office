from django.urls import path
from monTiGMagasin import views
from django.views.generic import TemplateView

urlpatterns = [
    path('infoproducts/', views.InfoProductList.as_view()),
    path('infoproduct/<int:tig_id>/', views.InfoProductDetail.as_view()),
    path('login/', views.login_view, name='login'),
    # path('infoproducts/', TemplateView.as_view(template_name='infoproducts.html'), name='infoproducts'),    
]
