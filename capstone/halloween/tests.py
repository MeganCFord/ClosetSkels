from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from halloween.models import Tag
from django.contrib.auth.models import User


class TagTests(APITestCase):
    def test_create_tag(self):
        """
        Ensure we can create a new tag object.
        """
        url = reverse('tag-list')
        data = {'name': 'test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 1)
        self.assertEqual(Tag.objects.get().name, 'test')

class UserTests(APITestCase):
    def test_create_user(self):
        """
        Ensure we can create a new user object.
        """
        url = reverse('user-list')
        data = {'username': 'test', 'password': 'test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test')
        self.assertEqual(response.data, {'url': 'http://testserver/users/1/', 'id': 1, 'username': 'test'})

    # def test_get_user(self):


