from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from halloween.permissions import IsOwnerOrReadOnly

from django.contrib.auth.models import User

from halloween.models import Tag, Costume, Boo, Element, CostumeElement
from halloween.serializers import UserSerializer, TagSerializer, CostumeSerializer, BooSerializer, ElementSerializer, CostumeElementSerializer, TagMiniSerializer, CostumeMiniSerializer, CostumeElementMiniSerializer

# Create your views here.

class User(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer


class Tag(viewsets.ModelViewSet):
  queryset = Tag.objects.all()
  serializer_class = TagSerializer

  def get_serializer_class(self):
    if self.action =="list":
      return TagMiniSerializer
    elif self.action == "create" or self.action == "update":
      return TagSerializer
    else:
      return TagSerializer

class Costume(viewsets.ModelViewSet):
  queryset = Costume.objects.all()
  serializer_class = CostumeSerializer

  def get_serializer_class(self):
    if self.action =="list":
      return CostumeMiniSerializer
    elif self.action == "create" or self.action == "update":
      return CostumeSerializer
    else:
      return CostumeSerializer  


class Boo(viewsets.ModelViewSet):
  queryset = Boo.objects.all()
  serializer_class = BooSerializer

class Element(viewsets.ModelViewSet):
  queryset = Element.objects.all()
  serializer_class = ElementSerializer

class CostumeElement(viewsets.ModelViewSet):
  queryset = CostumeElement.objects.all()
  serializer_class = CostumeElementSerializer

  def get_serializer_class(self):
    if self.action =="list":
      return CostumeElementMiniSerializer
    elif self.action == "create" or self.action == "update":
      return CostumeElementSerializer
    else:
      return CostumeElementSerializer 
