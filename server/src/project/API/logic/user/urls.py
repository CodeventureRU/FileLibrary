from API.logic.user.views import RegistrationView, LoginView, AccountActivationView, VerificationView, LogoutView,\
    ResendingEmailMessageView, ResetPasswordView, SendingResetPasswordMessageView, UpdatingEmailView, UpdatingDataView, \
    EmailConfirmationView, AccountDeletionView
from django.urls import path

urlpatterns = [
    path('users/registration/', RegistrationView.as_view()),
    path('users/resend-account-activation/', ResendingEmailMessageView.as_view()),
    path('users/send-reset-password/', SendingResetPasswordMessageView.as_view()),
    path('users/update-user-data/', UpdatingDataView.as_view()),
    path('users/update-user-email/', UpdatingEmailView.as_view()),
    path('users/login/', LoginView.as_view()),
    path('users/verification/', VerificationView.as_view()),
    path('users/account-deletion/', AccountDeletionView.as_view()),
    path('users/logout/', LogoutView.as_view()),
    path('activation/<uidb64>/<token>/', AccountActivationView.as_view(), name='activation'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),
    path('email-confirmation/<uidb64>/<email64>/<token>/', EmailConfirmationView.as_view(), name='confirm-email'),
]
