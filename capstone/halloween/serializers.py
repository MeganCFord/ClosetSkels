from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import Tag, Costume, Boo, Element, CostumeElement

# Mini serializers to make REST framework HTML work properly.

class TagMiniSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Tag
    fields = ("url", "name")

class CostumeMiniSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model=Costume
    fields=("url", "name", "description")

class CostumeElementMiniSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model=CostumeElement
    fields = ("id", "url", "costume", "element", "description", "tags")


class UserSerializer(serializers.HyperlinkedModelSerializer):
  #TODO: make this read only, I don't want to be able to add a username without going through django auth.
  costumes = CostumeMiniSerializer(many=True)

  class Meta:
    model = User
    fields = ('id', 'url', 'username', 'costumes')

class TagSerializer(serializers.HyperlinkedModelSerializer):
  #I'm ok with these tags returning only costume links I think. 
  costumes=CostumeMiniSerializer(many=True)
  costume_elements=CostumeElementMiniSerializer(many=True)
  
  class Meta: 
    model = Tag
    fields = ("id", "url", "name", "costumes", "costume_elements")

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  # OK so when I get the costume back do I want the full tags, or do I want just the URLs? ideally I'd like just the tag names basically.
  tags = TagSerializer(many=True)
  owner = UserSerializer()

  class Meta: 
    model = Costume
    fields = ("id", 'url', 'owner', 'costume_elements', 'name', 'description', 'datecreated', 'public', "tags")

class BooSerializer(serializers.HyperlinkedModelSerializer):

  class Meta: 
    model = Boo
    fields = ("id", "costume", "user", "date")

class ElementSerializer(serializers.HyperlinkedModelSerializer):
  
  class Meta: 
    model = Element
    fields = ("id", "name")

class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)

  class Meta:
    model = CostumeElement
    fields = ("id", "url", "costume", "element", "description", "tags")


