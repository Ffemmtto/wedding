from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from .models import Guest, Wish
from .forms import GuestForm, WishForm

def index(request):
    if request.method == 'POST':
        # Обработка форм через AJAX
        if 'rsvp_submit' in request.POST:
            form = GuestForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True, 'message': 'Спасибо! Ваш ответ принят.'})
            return JsonResponse({'success': False, 'message': 'Ошибка заполнения'})
            
        elif 'wish_submit' in request.POST:
            form = WishForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True, 'message': 'Ваше пожелание опубликовано!'})
            return JsonResponse({'success': False, 'message': 'Ошибка заполнения'})

    wishes = Wish.objects.all().order_by('-created_at')
    return render(request, 'invite/index.html', {'wishes': wishes})

class CustomLoginView(LoginView):
    template_name = 'invite/login.html'

@login_required(login_url='login')
def dashboard(request):
    guests = Guest.objects.all().order_by('-created_at')
    wishes = Wish.objects.all().order_by('-created_at')
    
    context = {
        'guests': guests,
        'wishes': wishes,
        'total_yes': guests.filter(status='yes').count(),
        'total_spouse': guests.filter(status='with_spouse').count() * 2, # считаем за двоих
        'total_no': guests.filter(status='no').count(),
    }
    context['total_attending'] = context['total_yes'] + context['total_spouse']
    return render(request, 'invite/custom_admin.html', context)

@login_required(login_url='login')
def delete_guest(request, pk):
    guest = get_object_or_404(Guest, pk=pk)
    if request.method == 'POST': # Удаляем только через POST-запрос для безопасности
        guest.delete()
    return redirect('dashboard')

@login_required(login_url='login')
def edit_guest(request, pk):
    guest = get_object_or_404(Guest, pk=pk)
    if request.method == 'POST':
        form = GuestForm(request.POST, instance=guest)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = GuestForm(instance=guest)
    
    return render(request, 'invite/edit_guest.html', {'form': form, 'guest': guest})

@login_required(login_url='login')
def delete_wish(request, pk):
    wish = get_object_or_404(Wish, pk=pk)
    if request.method == 'POST':
        wish.delete()
    return redirect('dashboard')