from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import Tag, Costume, Boo, Element, CostumeElement



class TagSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Tag
    fields = ("id", "name")

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)

  class Meta: 
    model = Costume
    fields = ("id", 'owner', 'name', 'description', 'datecreated', 'public', "tags")


class BooSerializer(serializers.HyperlinkedModelSerializer):
  costume = CostumeSerializer()

  class Meta: 
    model = Boo
    fields = ("id", "costume", "date")

class ElementSerializer(serializers.HyperlinkedModelSerializer):
  
  class Meta: 
    model = Element
    fields = ("id", "name")

class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  costume = CostumeSerializer()
  element = ElementSerializer()
  tags = TagSerializer(many=True)

  class Meta:
    model = CostumeElement
    fields = ("id", "costume", "element", "description", "tags")


