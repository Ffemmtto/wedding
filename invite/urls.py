from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns =[
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    
    # Новые пути для редактирования и удаления
    path('guest/<int:pk>/edit/', views.edit_guest, name='edit_guest'),
    path('guest/<int:pk>/delete/', views.delete_guest, name='delete_guest'),
    path('wish/<int:pk>/delete/', views.delete_wish, name='delete_wish'),
]