from API.logic.user.views import UserRegisterView, UserLoginView, AccountActivateView, UserVerificationView, LogoutView,\
    ResendEmailMessageView, ResetPasswordView, SendResetPasswordMessageView
from django.urls import path

urlpatterns = [
    path('users/registration/', UserRegisterView.as_view()),
    path('users/resend-account-activation/', ResendEmailMessageView.as_view()),
    path('users/send-reset-password/', SendResetPasswordMessageView.as_view()),
    path('users/login/', UserLoginView.as_view()),
    path('users/verification/', UserVerificationView.as_view()),
    path('users/logout/', LogoutView.as_view()),
    path('activation/<uidb64>/<token>/', AccountActivateView.as_view(), name='activation'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='activation'),
]
