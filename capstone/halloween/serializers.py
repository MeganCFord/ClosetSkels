from rest_framework import serializers
from django.contrib.auth.models import User
from halloween.models import *


class ElementSerializer(serializers.HyperlinkedModelSerializer):
  class Meta: 
    model = Element
    fields = ("id", "name")

class TagSerializer(serializers.HyperlinkedModelSerializer):
   class Meta: 
    model = Tag
    fields = ("id", "name")

class CostumeElementSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)
  class Meta:
    model = CostumeElement
    fields = ("id", "url", "costume", "element", "description", 'tags')

    # def create(self, data):
    #   if data["tags"]:
    #     tags_data = data.pop('tags')
    #     for tag_data in tags_data:
    #       tag = Tag.objects.get(tag_data["id"])

class CostumeSerializer(serializers.HyperlinkedModelSerializer):
  tags = TagSerializer(many=True)
  costume_elements=CostumeElementSerializer(many=True)
  class Meta: 
    model = Costume
    fields = ("id", 'url', 'owner', 'name', 'description', 'datecreated', 'public', 'costume_elements', 'tags')

    # ALL THIS IS FOR IF I DECIDE I WANT TO CREATE ALL THE STUFF AT ONCE which I am not going to do right now.
  # def create(self, data):
  #   tags_data = data.pop('tags')
  #   costume_elements_data = data.pop("costume_elements")
  #   for tag_data in tags_data:
  #         #if the tag already exists, just add it to the costume. if it doesn't exist, create it.
  #       Tag.objects.create(costumes.add(costume), **tag_data)
  #   for costume_element_data in costume_elements_data:
  #         #if the costume element already exists, just add it to the costume. if it doesn't exist, create it.
  #       ce_tags_data = costume_element_data.pop("tags")
  #       for ce_tag_data in ce_tags_data:
  #         #if the tag already exists, just add it to the costume. if it doesn't exist, create it.
  #         Tag.objects.create(costume_element.add(costume_element_data), **tag_data)
  #       CostumeElement.objects.create(costumes.add(costume), **costume_element_data)
  #   costume = Costume.objects.create(**data)
  #   return costume

  # def update(self, instance, data):
  #   # Update the costume instance
  #   if data["name"]:
  #     instance.name = data['name']
  #   if data["description"]:
  #     instance.description = data["description"]
  #   if data["public"]:
  #     instance.public = data["public"]
  #   instance.save()

    # Create or update tag and costume element instances that are in the request
    # if data["tags"]:
    #   for tag in data["tags"]:
    #     # delete any instance tags that aren't in data tags
    #     # create any instance tags that are in data tags
    #     # EXAMPLE: page = Page(id=item['page_id'], text=item['text'], book=instance)
    #     page.save()

    # return instance

class UserSerializer(serializers.HyperlinkedModelSerializer):
  costumes = CostumeSerializer(many=True)
  
  class Meta:
    model = User
    fields = ('username', 'costumes')


class BooSerializer(serializers.HyperlinkedModelSerializer):
  costume=CostumeSerializer()
  user = UserSerializer()
  
  class Meta: 
    model = Boo
    fields = ("user", "costume")




