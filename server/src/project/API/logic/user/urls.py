from API.logic.user.views import UserRegisterView, UserLoginView, AccountActivateView, UserVerificationView, LogoutView,\
    ResendEmailMessageView, ResetPasswordView, SendResetPasswordMessageView, UpdateUserEmailView, UpdateUserDataView, \
    ConfirmUserEmailView
from django.urls import path

urlpatterns = [
    path('users/registration/', UserRegisterView.as_view()),
    path('users/resend-account-activation/', ResendEmailMessageView.as_view()),
    path('users/send-reset-password/', SendResetPasswordMessageView.as_view()),
    path('users/update-user-data/', UpdateUserDataView.as_view()),
    path('users/update-user-email/', UpdateUserEmailView.as_view()),
    path('users/login/', UserLoginView.as_view()),
    path('users/verification/', UserVerificationView.as_view()),
    path('users/logout/', LogoutView.as_view()),
    path('activation/<uidb64>/<token>/', AccountActivateView.as_view(), name='activation'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),
    path('email-confirmation/<uidb64>/<email64>/<token>/', ConfirmUserEmailView.as_view(), name='confirm-email'),
]
