from API.logic.resource.views import LCResourceView, RUDResourceView, ResourceFileView, ResourceGroupView, \
    UserResourcesView, AddingToFavoriteView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
    path('resources/user/<str:username>/', UserResourcesView.as_view()),
    path('resources/favorite/<slug:id>/', AddingToFavoriteView.as_view()),
    path('resources/<slug:id>/', RUDResourceView.as_view()),
    path('resources/<slug:id>/file/', ResourceFileView.as_view()),
    path('resources/<slug:resource_id>/group/<slug:group_id>/', ResourceGroupView.as_view()),
]
