from API.logic.resource.views import LCResourceView, RUDResourceView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
    path('resources/<int:id>/', RUDResourceView.as_view()),
]
