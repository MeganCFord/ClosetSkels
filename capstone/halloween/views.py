from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse

# was pulling from another User in another file so aliased it to prevent program confusion.
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate, login, logout

import json

from halloween.models import Tag as DjangoTag, Costume as DjangoCostume, Boo as DjangoBoo, Element as DjangoElement, CostumeElement as DjangoCostumeElement
from halloween.serializers import *
from halloween.permissions import IsOwnerOrReadOnly
from django.core import serializers

class User(viewsets.ModelViewSet):
  serializer_class = UserSerializer
  queryset = DjangoUser.objects.all()

  def get_queryset(self):
    """
    Optionally restricts the returned queryset to a given user,
    by filtering against a `username` query parameter in the URL.
    """
    queryset = DjangoUser.objects.all()
    username = self.request.query_params.get('username', None)
    if username is not None:
        queryset = queryset.filter(username=username)
    return queryset


class Tag(viewsets.ModelViewSet):
  queryset = DjangoTag.objects.all()
  serializer_class = TagSerializer


class Costume(viewsets.ModelViewSet):
  queryset = DjangoCostume.objects.all()
  serializer_class = CostumeSerializer
 
  permission_classes = (IsOwnerOrReadOnly,)

  def create(self, request): 
    existing_owner = DjangoUser.objects.get(id=request.data["owner"])
    new_costume = DjangoCostume(owner = existing_owner, name=request.data["name"], description=request.data["description"], public=request.data["public"])

    new_costume.save()

    for tag_id in request.data["tags"]:
      tag_to_add = DjangoTag.objects.get(id=tag_id)
      new_costume.tags.add(tag_to_add)

    for ce_id in request.data["costumeelements"]:
      ce_to_add = DjangoCostumeElement.objects.get(id=ce_id)
      ce_to_add["costume"] = new_costume["pk"]
      new_costume.costumeelements.add(ce_to_add)
    
    data = serializers.serialize("json", (new_costume,))
    return HttpResponse(data, status=status.HTTP_201_CREATED)




  def get_queryset(self):
    queryset = DjangoCostume.objects.all()
    username = self.request.query_params.get("username", None)
    if username is not None:
      queryset = queryset.filter(owner=username)
    else:
      public = self.request.query_params.get("public", None)
      if public is not None:
        queryset = queryset.filter(public=True)
      else: 
        costumeid = self.request.query_params.get("costumeid", None)
        if costumeid is not None:
          queryset = queryset.filter(id = costumeid)
    return queryset

class Boo(viewsets.ModelViewSet):
  queryset = DjangoBoo.objects.all()
  serializer_class = BooSerializer

  permission_classes = (IsOwnerOrReadOnly,)

  # You can get a user's boos by their ID (a number).
  def get_queryset(self): 
    queryset = DjangoBoo.objects.all()
    userid = self.request.query_params.get("userid", None)
    if userid is not None:
      queryset = queryset.filter(owner=userid)
    return queryset

class Element(viewsets.ModelViewSet):
  queryset = DjangoElement.objects.all()
  serializer_class = ElementSerializer

class CostumeElement(viewsets.ModelViewSet):
  queryset = DjangoCostumeElement.objects.all()
  serializer_class = CostumeElementSerializer

  def get_queryset(self):
    """
    Optionally restricts the returned queryset to a given user,
    by filtering against a `username` query parameter in the URL.
    """
    queryset = DjangoCostumeElement.objects.all()
    costume = self.request.query_params.get('costume', None)
    if costume is not None:
        queryset = queryset.filter(costume__id=costume)
    else: 
        key = self.request.query_params.get("key", None)
        if key is not None:
          queryset=queryset.filter(pk = key)
        else:
          queryset = queryset.filter(costume=None)
    return queryset

  def create(self, request): 
    existing_element = DjangoElement.objects.get(id=request.data["element"])
    new_costume_element = DjangoCostumeElement(element = existing_element, name=request.data["name"], description=request.data["description"])

    new_costume_element.save()

    for tag_id in request.data["tags"]:
      tag_to_add = DjangoTag.objects.get(id=tag_id)
      new_costume_element.tags.add(tag_to_add)
    
    data = serializers.serialize("json", (new_costume_element,))
    return HttpResponse(data, status=status.HTTP_201_CREATED)

  



@csrf_exempt
def login_user(request):
    '''Handles the creation of a new user for authentication
    Method arguments:
      request -- The full HTTP request object
    '''

    # Load the JSON string of the request body into a dict
    req_body = json.loads(request.body.decode())

    # Use the built-in authenticate method to verify
    authenticated_user = authenticate(
            username=req_body['username'],
            password=req_body['password']
            )

    # If authentication was successful, log the user in
    success = True
    if authenticated_user is not None: 
        login(request=request, user=authenticated_user)
    else:
        success = False
    data = {"success":success}
    return JsonResponse(data)


@csrf_exempt
def create_user(request):
  '''
  Receives request object from register form. Parses object by value (username, password, first_name, last_name), creates new user, saves to database

  Values:
      request = request object sent from register form
  '''
  req_body = json.loads(request.body.decode())

  UserName = req_body['username']
  Password = req_body['password']
  FirstName = req_body['first_name']
  LastName = req_body['last_name']

  user = DjangoUser.objects.create_user(username=UserName,
                                  password=Password,
                                  first_name=FirstName,
                                  last_name=LastName)
  user.save()
  return JsonResponse({"success": True})

