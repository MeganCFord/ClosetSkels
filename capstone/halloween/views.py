from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from django.contrib.auth.models import User

from halloween.models import Tag, Costume, Boo, Element, CostumeElement
from halloween.serializers import UserSerializer, TagSerializer, CostumeSerializer, BooSerializer, ElementSerializer, CostumeElementSerializer

# Create your views here.

class UserList(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TagList(viewsets.ModelViewSet):
  queryset = Tag.objects.all()
  serializer_class = TagSerializer

class CostumeList(viewsets.ModelViewSet):
  queryset = Costume.objects.all()
  serializer_class = CostumeSerializer

class BooList(viewsets.ModelViewSet):
  queryset = Boo.objects.all()
  serializer_class = BooSerializer

class ElementList(viewsets.ModelViewSet):
  queryset = Element.objects.all()
  serializer_class = ElementSerializer

class CostumeElementList(viewsets.ModelViewSet):
  queryset = CostumeElement.objects.all()
  serializer_class = CostumeElementSerializer
