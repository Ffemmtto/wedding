from django import forms
from .models import Guest, Wish

class GuestForm(forms.ModelForm):
    class Meta:
        model = Guest
        fields =['first_name', 'last_name', 'status']

class WishForm(forms.ModelForm):
    class Meta:
        model = Wish
        fields = ['name', 'text']