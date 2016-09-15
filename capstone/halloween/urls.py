from rest_framework import routers
from django.conf.urls import url, include
from rest_framework import routers
from halloween import views


router = routers.DefaultRouter()
# router.register(r'albums', views.AlbumList)

urlpatterns = [
  url(r'^', include(router.urls)),
]
