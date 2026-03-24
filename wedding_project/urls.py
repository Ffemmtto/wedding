from django.contrib import admin
from django.urls import path, include

urlpatterns =[
    path('django-admin/', admin.site.urls), # Стандартная админка скрыта по другому URL
    path('', include('invite.urls')),
]