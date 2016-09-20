from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# was pulling from another User in another file so aliased it to prevent program confusion.
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate, login, logout

import json

from halloween.models import Tag as DjangoTag, Costume as DjangoCostume, Boo as DjangoBoo, Element as DjangoElement, CostumeElement as DjangoCostumeElement
from halloween.serializers import *
from halloween.permissions import IsOwnerOrReadOnly

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

  
  def get_queryset(self):
    queryset = DjangoCostume.objects.all()
    username = self.request.query_params.get("username", None)
    if username is not None:
      queryset = queryset.filter(owner=username)
    else:
      public = self.request.query_params.get("public", None)
      if public is not None:
        queryset = queryset.filter(public=True)
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
        queryset = queryset.filter(costume=costume)
    else: 
        queryset = queryset.filter(costume=None)
    return queryset



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

