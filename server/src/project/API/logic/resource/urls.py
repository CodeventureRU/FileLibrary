from API.logic.resource.views import LCResourceView, RUDResourceView, ResourceFileView, ResourceGroupView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
    path('resources/<slug:id>/', RUDResourceView.as_view()),
    path('resources/<slug:id>/file/', ResourceFileView.as_view()),
    path('resources/<slug:resource_id>/group/<slug:group_id>/', ResourceGroupView.as_view()),
]
