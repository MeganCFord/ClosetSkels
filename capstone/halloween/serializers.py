from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("id", "name")

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Costume
    fields = ("id", 'url', 'owner', 'name', 'description', 'datecreated', 'public', 'costume_elements', 'tags')


class UserSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  
  class Meta:
    model = User
    fields = ('id', 'url', 'username', 'costumes')


class BooSerializer(serializers.HyperlinkedModelSerializer):
  costume=CostumeSerializer()
  user = UserSerializer()
  
  class Meta: 
    model = Boo
    fields = ("id", "url", "date", "user", "costume")


class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  costume = CostumeSerializer()
  class Meta:
    model = CostumeElement
    fields = ("id", "url", "costume", "element", "description", 'tags')


class TagSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  costumeelements = CostumeElementSerializer(many=True)
  class Meta: 
    model = Tag
    fields = ("id", "url", "name", "costumes", "costumeelements")
