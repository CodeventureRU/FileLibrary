from API.logic.resource.views import LCResourceView, RUDResourceView, ResourceFileView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
    path('resources/<int:id>/', RUDResourceView.as_view()),
    path('resources/<int:id>/file/', ResourceFileView.as_view()),
]
