from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .models import UserProfile, Settings

def home(request):
    settings = Settings.get_settings()
    return render(request, 'core/home.html', {'settings': settings})

def about(request):
    settings = Settings.get_settings()
    return render(request, 'core/about.html', {'settings': settings})

def contact(request):
    settings = Settings.get_settings()
    return render(request, 'core/contact.html', {'settings': settings})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'authentication/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'authentication/register.html', {'form': form})
