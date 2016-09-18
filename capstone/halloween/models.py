from django.db import models
from django.utils import timezone



class Costume(models.Model):
    name = models.CharField(max_length=55)
    description = models.CharField(max_length=1000, blank=True)
    # This will always be now.
    datecreated = models.DateTimeField(default=timezone.now)
    public = models.BooleanField(default=False)
    # Allowing owner to be null in case a users wants to delete their private version of a published costume- then the public version will still be available if they've published it. 
    owner = models.ForeignKey('auth.User',on_delete=models.SET_NULL, related_name ="costumes", null=True)
    # tags are on CostumeTag.
    # costume elements are on costumeElement.

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)


class Boo(models.Model):
  owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name="boos")
  costume = models.ForeignKey('costume', on_delete=models.CASCADE, related_name="boos")

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
  description = models.CharField(max_length=1000, blank=True)
  element = models.ForeignKey('element', on_delete=models.CASCADE, related_name="costume_elements")
  costume = models.ForeignKey('costume', on_delete=models.CASCADE, related_name="costume_elements")

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
