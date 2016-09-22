from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *
from django.shortcuts import get_object_or_404


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("id", "url", "name")

class TagSerializer(serializers.HyperlinkedModelSerializer):
   class Meta: 
    model = Tag
    fields = ("id", "url", "name", "costumes", "costumeelements")

class BooSerializer(serializers.HyperlinkedModelSerializer):
  
  class Meta: 
    model = Boo
    fields = ("url", "owner", "costume")

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  boos=BooSerializer(many=True, read_only=True)
  tags = TagSerializer(many=True)

  class Meta: 
    model = Costume
    fields = ( 'id', 'url', 'owner', 'name', 'description', 'public', 'costumeelements', 'tags', 'boos')

  def update(self, instance, validated_data):
    
    instance.name = validated_data.get("name")
    instance.description = validated_data.get("description")
    instance.public = validated_data.get("public")
    
    ces_data = validated_data.pop("costumeelements", None)
    if ces_data: 
      instance.costumeeelements = [];
      for ce_data in ces_data:
        element_to_add = get_object_or_404(CostumeElement, name=ce_data["name"])
        instance.costumeelements.add(element_to_add)
    instance.save()

    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      for tag_data in tags_data:
        instance.tags = [];
        tag_to_add = get_object_or_404(Tag, name=tag_data["name"])
        instance.tags.add(tag_to_add)
    instance.save()

    return instance

class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)
  element = ElementSerializer()
  class Meta:
    model = CostumeElement
    fields = ("id", "url", "element", "description", "tags", "name")
    # extra_kwargs = {'costume': {'required': 'False'}}

  def update(self, instance, validated_data):
    
    instance.name = validated_data.get("name")
    instance.description = validated_data.get("description")
    
    element_data = validated_data.pop('element', None)
    if element_data:
        element = get_object_or_404(Element, name=element_data["name"])
        validated_data['element'] = element
    instance.element = validated_data["element"]

    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      instance.tags = [];
      for tag_data in tags_data:
        tag_to_add = get_object_or_404(Tag, name=tag_data["name"])
        instance.tags.add(tag_to_add)
    instance.save()

    return instance


class UserSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  
  class Meta:
    model = User
    fields = ('id', 'url', 'username', 'costumes')






