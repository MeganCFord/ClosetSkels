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


class Element(viewsets.ModelViewSet):
  queryset = DjangoElement.objects.all()
  serializer_class = ElementSerializer


class Tag(viewsets.ModelViewSet):
  queryset = DjangoTag.objects.all()
  serializer_class = TagSerializer

  # TODO: add a queryset here that allows me to just get the tags for a costume or supply.


class Boo(viewsets.ModelViewSet):
  queryset = DjangoBoo.objects.all()
  serializer_class = BooSerializer

  permission_classes = (IsOwnerOrReadOnly,)

  def get_queryset(self): 
    '''
    Optionally restricts returned queryset to boos owned by a given user, 
    by filtering against a 'userid' query perameter in the URL. 
    '''
    queryset = DjangoBoo.objects.all()
    userid = self.request.query_params.get("userid", None)
    if userid is not None:
      queryset = queryset.filter(owner=userid)
    return queryset


class Supply(viewsets.ModelViewSet):
  queryset = DjangoSupply.objects.all()
  serializer_class = SupplySerializer

  def get_queryset(self):
    """
    Optionally restricts the returned queryset to a given costume,
    by filtering against a `costumeid` query parameter in the URL.
    """
    
    queryset = DjangoSupply.objects.all()

    costumeid = self.request.query_params.get('costumeid', None)
    if costumeid is not None:
      queryset = queryset.filter(costume__id=costumeid)

    userid = self.request.query_params.get('userid', None)
    if userid is not None:
      queryset = queryset.filter(owner__id=userid)
    
    return queryset


class Costume(viewsets.ModelViewSet):
  queryset = DjangoCostume.objects.all()
  serializer_class = CostumeSerializer
 
  permission_classes = (IsOwnerOrReadOnly,)

  def get_queryset(self):
    '''
    Optionally restricts the returned queryset to: 
    1. the costumes owned by a given user ('userid')
    2. costumes that are public ('public')
    3. a specific costume by id ('costumeid'),
    by filtering against query perameters in the URL.
    '''
    queryset = DjangoCostume.objects.all()
    userid = self.request.query_params.get("userid", None)
    if userid is not None:
      queryset = queryset.filter(owner__id=userid)

    public = self.request.query_params.get("public", None)
    if public is not None:
      queryset = queryset.filter(public=True)

    costumeid = self.request.query_params.get("costumeid", None)
    if costumeid is not None:
      queryset = queryset.filter(id=costumeid)

    return queryset


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
  request = the full HTTP request object sent from register form.
  '''
  # Load the JSON string of the request body into a dict. Needs to be decoded bc of atob of password.
  req_body = json.loads(request.body.decode())

  UserName = req_body['username']
  Password = req_body['password']

  # Use the built-in creation method to create a new user.
  user = DjangoUser.objects.create_user(username=UserName,
                                  password=Password)
  user.save()
  # Return a success object. TODO: simplify this?
  return JsonResponse({"success": True})

