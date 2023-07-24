from API.logic.resource.views import LCResourceView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
]
