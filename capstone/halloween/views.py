from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from django.views.decorators.csrf import csrf_exempt
from halloween.permissions import IsOwnerOrReadOnly
from django.http import JsonResponse, HttpResponse
import json

# Aliased due to weird overlapping import somewhere. 
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate, login, logout

# Aliased due to weird overlapping import somewhere. 
from halloween.models import Tag as DjangoTag, Costume as DjangoCostume, Boo as DjangoBoo, Element as DjangoElement, Supply as DjangoSupply

from halloween.serializers import *
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
    # TODO: what am I actually sending here? an ID? I think I would prefer to send an id vs a username.
    username = self.request.query_params.get('username', None)
    if username is not None:
        queryset = queryset.filter(username=username)
    return queryset


class Tag(viewsets.ModelViewSet):
  queryset = DjangoTag.objects.all()
  serializer_class = TagSerializer

  # TODO: add a queryset here that allows me to just get the tags for a costume or supply.


class Costume(viewsets.ModelViewSet):
  queryset = DjangoCostume.objects.all()
  serializer_class = CostumeSerializer
 
  permission_classes = (IsOwnerOrReadOnly,)

  def get_queryset(self):
    '''
    Optionally restricts the returned queryset to: 
    1. the costumes owned by a given user ('username')
    2. costumes that are public ('public')
    3. a specific costume by id ('costumeid'),
    by filtering against query perameters in the URL.
    '''
    queryset = DjangoCostume.objects.all()
    # TODO: what am I actually sending here? is it an id? not a username?
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
          queryset = queryset.filter(id=costumeid)
    return queryset

  def create(self, request): 
    '''
    Handles creation of tags and supplies during costume creation: 
    adds costume instance to existing tags and supplies. 
    '''
    existing_owner = DjangoUser.objects.get(id=request.data["owner"])
    new_costume = DjangoCostume(owner = existing_owner, name=request.data["name"], description=request.data["description"], public=request.data["public"], image=request.data["image"])

    new_costume.save()

    for tag_id in request.data["tags"]:
      tag_to_add = DjangoTag.objects.get(id=tag_id)
      new_costume.tags.add(tag_to_add)

    for ce_data in request.data["supplies"]:
      # This doesn't seem to work. I don't want to use 'add' because it's not a many relationship. 
      ce_to_add = DjangoSupply.objects.get(id=ce_data["id"])
      setattr(ce_to_add, 'costume', new_costume)
      new_costume.supplies.add(ce_to_add)

    # Requires usage of this serialization pattern because JsonResponse isn't able to serialize an instance.
    data = serializers.serialize("json", (new_costume,))
    return HttpResponse(data, status=status.HTTP_201_CREATED)


class Boo(viewsets.ModelViewSet):
  queryset = DjangoBoo.objects.all()
  serializer_class = BooSerializer

  permission_classes = (IsOwnerOrReadOnly,)

  def get_queryset(self): 
    '''
    Optionally restricts returned queryset to boos owned by a given user, 
    by filtering against a 'userid' query perameter in the URL. 
    The restricted queryset returns the costume object related to the boo.
    '''
    queryset = DjangoBoo.objects.all()
    username = self.request.query_params.get("username", None)
    if username is not None:
      queryset = []
      for e in DjangoBoo.objects.filter(owner__username=username).select_related('costume'):
        print(e)
        queryset.add(e.costume)
    return queryset


class Element(viewsets.ModelViewSet):
  queryset = DjangoElement.objects.all()
  serializer_class = ElementSerializer


class Supply(viewsets.ModelViewSet):
  queryset = DjangoSupply.objects.all()
  serializer_class = SupplySerializer

  def get_queryset(self):
    """
    Optionally restricts the returned queryset to a given user,
    by filtering against a `username` query parameter in the URL.
    """
    queryset = DjangoSupply.objects.all()
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
    '''
    Handles some sub-creation stuff during creation of an supply: 
    if the request includes a costume instance, add it to the supply (in case I'm adding an element to an existing costume during costume edit), 
    adds the supply instance to the list of supplies on tag. 
    '''
    existing_element = DjangoElement.objects.get(id=request.data["element"])
    new_supply = DjangoSupply(element = existing_element, name=request.data["name"], description=request.data["description"])

    new_supply.save()

    try: 
      # TODO: fix this, it's not working.
      setattr(new_supply, "costume", request.data["costume"])
    except: 
      print("hey I couldn't add a costume to this supply")
      pass

    for tag_id in request.data["tags"]:
      # TODO: I think I actually need to add the supply instance to the element...
      tag_to_add = DjangoTag.objects.get(id=tag_id)
      new_supply.tags.add(tag_to_add)
    
    data = serializers.serialize("json", (new_supply,))
    return HttpResponse(data, status=status.HTTP_201_CREATED)

# ###########
# LOGIN STUFF 
# ###########

@csrf_exempt
def login_user(request):
    '''
    Handles the creation of a new user for authentication
    Method arguments:
    request = The full HTTP request object sent from login form
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
  Method arguments:
  request = the full HTTP request object sent from register form
  '''
  # Load the JSON string of the request body into a dict
  req_body = json.loads(request.body.decode())

  UserName = req_body['username']
  Password = req_body['password']

  # Use the built-in creation method to create a new user.
  user = DjangoUser.objects.create_user(username=UserName,
                                  password=Password)
  user.save()
  # Return a success object. TODO: simplify this?
  return JsonResponse({"success": True})

