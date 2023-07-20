from API.logic.user.views import UserRegisterView, UserLoginView, AccountActivateView
from django.urls import path


urlpatterns = [
    path('users/registration/', UserRegisterView.as_view()),
    path('users/login/', UserLoginView.as_view()),
    path('activate/<uidb64>/<token>/', AccountActivateView.as_view(), name='activate'),
]
