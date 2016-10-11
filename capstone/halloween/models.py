from django.db import models
from django.utils import timezone


class Costume(models.Model):
    owner=models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name ="costumes")
    name=models.CharField(max_length=55)
    description=models.CharField(max_length=1000, blank=True)
    public=models.BooleanField(default=False)
    image=models.CharField(max_length=1000, blank=True, null=True)
    # supplies are on Supply.
    # tags are on tag.

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)


class Boo(models.Model):
    # Explicit many/many relationship.
    owner=models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name="boos")
    costume=models.ForeignKey('costume', on_delete=models.CASCADE, related_name="boos")

    def __str__(self):
          return "{}".format(self.id)
    def __unicode__(self):
          return "{}".format(self.id)


class Element(models.Model):
    name=models.CharField(max_length=55)

    def __str__(self):
          return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
          return "{}: {}".format(self.id, self.name)


class Supply(models.Model):
    # Explicit many/many costume/element relationship, with extra info.
    name=models.CharField(max_length=55)
    description=models.CharField(max_length=1000, blank=True, null=True)
    costume=models.ForeignKey('costume', null=True, blank=True, on_delete=models.CASCADE, related_name="supplies")
    element=models.ForeignKey('element', blank=True, null=True, on_delete=models.CASCADE, related_name="supplies")
    # Tags are on tag.

    def __str__(self):
          return "{}".format(self.name)
    def __unicode__(self):
          return "{}".format(self.name)


class Tag(models.Model):
  name=models.CharField(max_length=55)
  costumes=models.ManyToManyField(Costume, blank=True, related_name="tags")
  supplies=models.ManyToManyField(Supply, blank=True, related_name="tags")

  def __str__(self):
      return "{}: {}".format(self.id, self.name)
  def __unicode__(self):
      return "{}: {}".format(self.id, self.name)
