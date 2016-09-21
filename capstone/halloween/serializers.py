from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("url", "name")

class TagSerializer(serializers.HyperlinkedModelSerializer):
   class Meta: 
    model = Tag
    fields = ("url", "name", "costumes", "costumeelements")

class BooSerializer(serializers.HyperlinkedModelSerializer):
  
  class Meta: 
    model = Boo
    fields = ("url", "owner", "costume")

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  boos=BooSerializer(many=True, read_only=True)
  tags = TagSerializer(many=True, read_only=True)

  class Meta: 
    model = Costume
    fields = ( 'id', 'url', 'owner', 'name', 'description', 'public', 'costumeelements', 'tags', 'boos')

class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True, read_only=True)
  element = ElementSerializer(read_only=True)
  class Meta:
    model = CostumeElement
    fields = ("url", "costume", "element", "description", "tags", "name")
    extra_kwargs = {'costume': {'required': 'False'}}


class UserSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  
  class Meta:
    model = User
    fields = ('id', 'url', 'username', 'costumes')






