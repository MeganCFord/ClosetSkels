from rest_framework import routers
from django.conf.urls import url, include
from halloween import views

router = routers.DefaultRouter()

router.register(r'users', views.UserList)
router.register(r'tags', views.TagList)
router.register(r'costumes', views.CostumeList)
router.register(r'boos', views.BooList)
router.register(r'elements', views.ElementList)
router.register(r'costumeelements', views.CostumeElementList)

urlpatterns = [
  url(r'^', include(router.urls)),
]
