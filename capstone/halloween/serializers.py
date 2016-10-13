from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *
import requests



class UserSerializer(serializers.HyperlinkedModelSerializer): 
  class Meta:
    model = User
    fields = ('id', 'url', 'username')


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("id", "name")


class TagSerializer(serializers.HyperlinkedModelSerializer):
   class Meta: 
    model = Tag
    fields = ("id", "url", "name")


class BooSerializer(serializers.HyperlinkedModelSerializer): 
  class Meta: 
    model = Boo
    fields = ("costume", "owner", "url")


class SupplySerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)
  element = ElementSerializer()
  class Meta:
    model = Supply
    fields = ("id", "name", "url", "costume", "description", "element", "tags")

  def create(self, request): 
    '''
    Handles assignment of tags during supply creation 
    by adding newly created supply instance to existing tags.
    Supplies are always created with a 'null' costume field.
    '''
    element = request["element"]
    element_instance = Element.objects.get(name=element["name"])
    new_supply = Supply(element=element_instance, name=request["name"], description=request["description"])

    new_supply.save()

    tags_data = request.pop("tags", None)
    if tags_data:
      for tag in tags_data:
        tag_to_add = Tag.objects.get(name=tag["name"])
        new_supply.tags.add(tag_to_add)
      new_supply.save()
    
    return new_supply

  def update(self, instance, validated_data):
    '''
    During updating of a supply:
    1. Assign the costume via url (supplies are always created with 'None' costume field),
    2. Update the tags list, 
    3. Update the element field.
    '''
    instance.name = validated_data.get("name")
    instance.description = validated_data.get("description")
    instance.costume = validated_data.get("costume")
    instance.save()
    
    element_data = validated_data.pop('element', None)
    if element_data:
      element_to_add = Element.objects.get(name=element_data["name"])
      setattr(instance, "element", element_to_add)
      instance.save()


    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      # Reset the tags list to 0.
      instance.tags = [];
      for tag_data in tags_data:
        # Add each tag back based on update.
        tag_to_add = Tag.objects.get(name=tag_data["name"])
        instance.tags.add(tag_to_add)
      instance.save()

    instance.save()

    return instance


class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  boos = BooSerializer(many=True, read_only=True)
  tags = TagSerializer(many=True) 

  class Meta: 
    model = Costume
    fields = ( 'id', 'url', 'owner', 'name', 'description', 'public', 'supplies', 'tags', 'boos', "image")


  def create(self, request): 
    '''
    Handles assignment of tags during costume creation 
    by adding newly created costume instance to existing tags.
    Supplies are handled separately. 
    '''
    new_costume = Costume(
      name=request["name"], 
      owner=request["owner"], 
      description=request["description"], 
      public=request["public"], 
      image=request["image"])
    new_costume.save()

    tags_data = request.pop("tags", None)
    if tags_data:
      for tag in tags_data:
        tag_to_add=Tag.objects.get(name=tag["name"])
        new_costume.tags.add(tag_to_add)
    
    new_costume.save()
 
    return new_costume

  def update(self, instance, validated_data):
    '''
    During updating of a costume,
    Update all text/boolean fields, 
    Update the tags list.
    Supplies are handled separately.
    '''  
    instance.name = validated_data.get("name")
    instance.owner = validated_data.get("owner")
    instance.description = validated_data.get("description")
    instance.public = validated_data.get("public")
    instance.image = validated_data.get("image")
    instance.save()


    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      # Reset tags to 0.
      instance.tags = [];
      for tag_data in tags_data:
        # Add each tag back based on update.
        tag_to_add = Tags.objects.get(pk=tag_data["id"])
        instance.tags.add(tag_to_add)
    instance.save()

    return instance









