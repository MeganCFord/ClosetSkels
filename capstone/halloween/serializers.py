from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *
# from django.shortcuts import get_object_or_404
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
    During creation of a supply,
    adds instances of chosen tags to supply's tag list. 
    '''
    element = request["element"]
    element_instance = Element.objects.get(name=element["name"])
    new_supply = Supply(element = element_instance, name=request["name"], description=request["description"])

    new_supply.save()

    tags_data = request.pop("tags", None)
    if tags_data:
      for tag in tags_data:
        tag_to_add = Tag.objects.get(name=tag["name"])
        new_supply.tags.add(tag_to_add)
      new_supply.save()
    
    # data = serializers.serialize("json", (new_supply,))
    # return HttpResponse(data, status=status.HTTP_201_CREATED)
    return new_supply

  def update(self, instance, validated_data):
    '''
    During updating of a supply:
    1. Assign the costume instance (supplies are never created with costume field filled in),
    2. Update the tags serialization list, 
    3. Update the element instance.
    '''
    instance.name = validated_data.get("name")
    instance.description = validated_data.get("description")
    instance.save()
    
    element_data = validated_data.pop('element', None)
    if element_data:
      element_to_add = Element.objects.get(pk=element_data["id"])
      setattr(instance, "element", element_to_add)
      instance.save()


    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      instance.tags = [];
      for tag_data in tags_data:
        tag_name = geattr(tag_data, "name")
        tag_to_add = get_object_or_404(Tag, name=tag_name)
        instance.tags.add(tag_to_add)
      instance.save()

    costume_data = validated_data.pop("costume", None)
    if costume_data:
      costume_to_add = Costume.objects.get(pk=costume_data["id"])
      setattr(instance, "costume", costume_to_add)
      instance.save()

    return instance


class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  boos = BooSerializer(many=True, read_only=True)
  tags = TagSerializer(many=True) 
  # TODO: add supply serialization into this. 

  class Meta: 
    model = Costume
    fields = ( 'id', 'url', 'owner', 'name', 'description', 'public', 'supplies', 'tags', 'boos', "image")


  def create(self, request): 
    '''
    Handles creation of tags and supplies during costume creation 
    by adding newly created costume instance to existing tags and supplies. 
    '''
    owner = User.objects.get(username=request["owner"]["username"])
    new_costume = Costume.objects.create(owner=owner, name=request.data["name"], description=request.data["description"], public=request.data["public"], image=request.data["image"])

    new_costume.save()

    tags_data = request.data.pop("tags", None)
    if tags_data:
      for tag in tags_data:
        tag_to_add=Tag.objects.get(id=tag["id"])
        new_costume.tags.add(tag_to_add)

    new_costume.save()

    # TEMP SOLUTION: handling supplies in front end.
    # supply_data = request.data.pop("supplies", None)
    # for supply in request.data["supplies"]:
    #   supply_to_add = DjangoSupply.objects.get(id=supply["id"])
    #   # TODO: what if it already is assigned to a costume? like via saving to closet.
    #   setattr(supply_to_add, 'costume', new_costume)

    # # Originally used this serialization pattern because JsonResponse doesn't seem to be able to serialize an instance.
    # data = serializers.serialize("json", (new_costume,))
    # return HttpResponse(data, status=status.HTTP_201_CREATED)  
    return new_supply

  def update(self, instance, validated_data):
    
    instance.name = validated_data.get("name")
    instance.owner = validated_data.get("owner")
    instance.description = validated_data.get("description")
    instance.public = validated_data.get("public")
    instance.image = validated_data.get("image")
    instance.save()
    
    # TEMP SOLUTION: handling supplies on front end. 
    # ces_data = validated_data.pop("supplies", None)
    # if ces_data: 
    #   for ce_data in ces_data:
    #     ce_id = getattr(ce_data, "id")
    #     element_to_add = Supply.objects.get(id = ce_id)
    #     setattr(element_to_add, "costume", instance)
    #     element_to_add.save()

    tags_data = validated_data.pop("tags", None)
    if tags_data: 
      instance.tags = [];
      for tag_data in tags_data:
        tag_to_add = Tags.objects.get(pk=tag_data["id"])
        instance.tags.add(tag_to_add)
    instance.save()

    return instance









