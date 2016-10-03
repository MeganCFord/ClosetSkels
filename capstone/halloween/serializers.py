from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *
from django.shortcuts import get_object_or_404
import requests



class UserSerializer(serializers.HyperlinkedModelSerializer): 
  class Meta:
    model = User
    fields = ('id', 'url', 'username')


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("id", "url", "name")


class TagSerializer(serializers.HyperlinkedModelSerializer):
   class Meta: 
    model = Tag
    fields = ("id", "url", "name")


class BooSerializer(serializers.HyperlinkedModelSerializer): 
  class Meta: 
    model = Boo
    fields = ("url", "owner", "costume")


class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  boos = BooSerializer(many=True, read_only=True)
  tags = TagSerializer(many=True) 

  class Meta: 
    model = Costume
    fields = ( 'id', 'url', 'owner', 'name', 'description', 'public', 'supplies', 'tags', 'boos', "image")

  def update(self, instance, validated_data):
    
    instance.name = validated_data.get("name")
    instance.description = validated_data.get("description")
    instance.public = validated_data.get("public")
    instance.image = validated_data.get("image")
    instance.save()
    
    ces_data = validated_data.pop("supplies", None)
    if ces_data: 
      instance.costumeeelements = [];
      for ce_data in ces_data:
        ce_id = getattr(ce_data, "id")
        element_to_add = get_object_or_404(Supply, pk=ce_id)
        setattr(element_to_add, "costume", instance )
        element_to_add.save()

    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      instance.tags = [];
      for tag_data in tags_data:
        tag_to_add = get_object_or_404(Tag, name=tag_data["name"])
        instance.tags.add(tag_to_add)
    instance.save()

    return instance


class SupplySerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)
  element = ElementSerializer()
  class Meta:
    model = Supply
    fields = ("id", "url", "element", "description", "tags", "name")

  def update(self, instance, validated_data):
    # NOTE: not using this right now because the supply itself is returning 404.
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
        tag_name = geattr(tag_data, "name")
        tag_to_add = get_object_or_404(Tag, name=tag_name)
        instance.tags.add(tag_to_add)
    instance.save()

    return instance







