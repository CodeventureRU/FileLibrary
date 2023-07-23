from API.logic.user.views import UserRegisterView, UserLoginView, AccountActivateView, TokenVerify
from django.urls import path


urlpatterns = [
    path('users/registration/', UserRegisterView.as_view()),
    path('users/login/', UserLoginView.as_view()),
    path('users/verification/', TokenVerify.as_view()),
    path('activation/<uidb64>/<token>/', AccountActivateView.as_view(), name='activation'),
]
