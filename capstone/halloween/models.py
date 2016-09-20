from django.db import models
from django.utils import timezone



class Costume(models.Model):
    name = models.CharField(max_length=55)
    description = models.CharField(max_length=1000, blank=True)
    # This will always be now.
    public = models.BooleanField(default=False)
    owner = models.ForeignKey('auth.User',on_delete=models.CASCADE, related_name ="costumes")
    # costume elements are on costumeElement.
    # tags are on tag.

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)


class Boo(models.Model):
  owner = models.ForeignKey('auth.User', null=True, blank=True, on_delete=models.CASCADE, related_name="boos")
  costume = models.ForeignKey('costume', null=True, blank=True, on_delete=models.CASCADE, related_name="boos")

  def __str__(self):
        return "{}".format(self.id)
  def __unicode__(self):
        return "{}".format(self.id)


class Element(models.Model):
  name=models.CharField(max_length=55)

  def __str__(self):
        return "{}".format(self.name)
  def __unicode__(self):
        return "{}".format(self.name)

class CostumeElement(models.Model):
  name = models.CharField(max_length=55)
  description = models.CharField(max_length=1000, blank=True, null=True)
  element = models.ForeignKey('element', on_delete=models.CASCADE, related_name="costumeelements")
  costume = models.ForeignKey('costume', blank=True, null=True, on_delete=models.CASCADE, related_name="costumeelements")
  #tags are on tag.

  def __str__(self):
        return "{}".format(self.description)
  def __unicode__(self):
        return "{}".format(self.description)


class Tag(models.Model):
    name=models.CharField(max_length=55)
    costumes=models.ManyToManyField(Costume, blank=True, related_name="tags")
    costumeelements=models.ManyToManyField(CostumeElement, blank=True, related_name="tags")

    def __str__(self):
        return "{}".format(self.name)
    def __unicode__(self):
        return "{}".format(self.name)
