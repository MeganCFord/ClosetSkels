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


class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = CostumeElement
    fields = ("url", "costume", "element", "description", "tags", "name")
    extra_kwargs = {'costume': {'required': 'False'}}


class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  # tags = TagSerializer(many=True)
  # costumeelements=CostumeElementSerializer(many=True)
  boos=BooSerializer(many=True, read_only=True)
  class Meta: 
    model = Costume
    fields = ('url', 'owner', 'name', 'description', 'public', 'costumeelements', 'tags', 'boos')

  # def create(self, data):
  #   costume_elements_data = data.pop("costume_elements")
  #   # user_url=User.objects.get(username=data["owner"])
  #   # print(user_url)
  #   new_costume = Costume.objects.create(name = data["name"], description = data["description"], tags = data["tags"], costume_elements = [], boos = [])
  #   new_costume.save()
    
    # for costume_element_data in costume_elements_data:
    #   # This is an explicit join table between costume and element. 
    #     ce = CostumeElement.objects.create({"costume":new_costume["url"], "description":costume_element_data["description"], "element":costume_element_data["element"]})
    # return costume

  # def update(self, instance, data):
  #   # Update the costume instance
  #   instance.name = data['name']
  #   instance.description = data["description"]
  #   instance.public = data["public"]
  #   instance.tags = data["tags"]
  #   instance.save()

  #   # delete any instance tags that aren't in data tags
  #   for ce_instance_data in instance["costume_elements"]:
  #     if ce_instance_data not in data["costume_elements"]:
  #       CostumeInstance.objects.delete(ce_instance_data["id"]) 
    
  #   # Create or update costume element instances that are in the request
  #   for costume_element_data in data["costume_elements"]:
  #     ce= CostumeElement.objects.get(costume_element_data["id"], None)
  #     print(ce)
  #     if ce is None:
  #       new_ce = CostumeElement(costumes.add(instance), **costume_element_data)
  #       new_ce.save()
  #     else:
  #       ce["description"] = data["description"]
  #       ce["element"] = data["element"]
  #       ce.save()

  #   return instance

class UserSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  
  class Meta:
    model = User
    fields = ('id', 'url', 'username', 'costumes')






