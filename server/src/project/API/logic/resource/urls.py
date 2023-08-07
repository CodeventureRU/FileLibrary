from API.logic.resource.views import LCResourceView, RUDResourceView, ResourceFileView, ResourceGroupView, \
    UserResourcesView, AddingToFavoriteView, FavoriteResourcesView, DownloadFileView, GroupResourcesView, IDontKnowHowToNameThisView
from django.urls import path

urlpatterns = [
    path('resources/', LCResourceView.as_view()),
    path('resources/groups/<slug:id>/', IDontKnowHowToNameThisView.as_view()),
    path('resources/group/<slug:id>/', GroupResourcesView.as_view()),
    path('resources/user/<str:username>/', UserResourcesView.as_view()),
    path('resources/favorite/<slug:id>/', AddingToFavoriteView.as_view()),
    path('resources/favorites/', FavoriteResourcesView.as_view()),
    path('resources/download/<slug:id>/<str:extension>/', DownloadFileView.as_view()),
    path('resources/<slug:id>/', RUDResourceView.as_view()),
    path('resources/<slug:id>/file/', ResourceFileView.as_view()),
    path('resources/<slug:resource_id>/group/<slug:group_id>/', ResourceGroupView.as_view()),
]
