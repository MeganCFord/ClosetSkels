from rest_framework import routers
from django.conf.urls import url, include
from halloween import views as views

router = routers.DefaultRouter()

router.register(r'users', views.User)
router.register(r'tags', views.Tag)
router.register(r'costumes', views.Costume)
router.register(r'boos', views.Boo)
router.register(r'elements', views.Element)
router.register(r'supplies', views.Supply)

urlpatterns = [
  url(r'^', include(router.urls)),
  url(r'^login$', views.login_user, name='login'),
  url(r'^register$', views.create_user, name='create_user'),
]
