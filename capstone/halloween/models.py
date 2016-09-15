from django.db import models
from django.utils import timezone

# Create your models here.



class Tag(models.Model):
    name = models.CharField(max_length=55)
    costumes = models.ManyToManyField('costume', related_name="tags")
    costume_elements = models.ManyToManyField('costumeelement', related_name="tags")

    def __str__(self):
        return "{}".format(self.name)
    def __unicode__(self):
        return "{}".format(self.name)


class Costume(models.Model):
  # Permissions here.
    name = models.CharField(max_length=55)
    description = models.CharField(max_length=1000, blank=True)
    datecreated = models.DateTimeField(default=timezone.now)
    public = models.BooleanField(default=False)
    # Allowing owner to be null in case a users wants to delete their private version of a published costume- then the public version will still be available if it exists. 
    owner = models.ForeignKey('auth.User',on_delete=models.SET_NULL, related_name ="costumes", null=True)

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)


class Boo(models.Model):
  # permissions here.
  date = models.DateField(auto_now=True)
  user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name="boos")
  costume=models.ForeignKey('costume', on_delete=models.CASCADE, related_name="boos")

  def __str__(self):
        return "{}: {}".format(self.user, self.date)
  def __unicode__(self):
        return "{}: {}".format(self.user, self.date)


class Element(models.Model):
  name = models.CharField(max_length=55)

  def __str__(self):
        return "{}: {}".format(self.id, self.name)
  def __unicode__(self):
        return "{}: {}".format(self.id, self.name)


class CostumeElement(models.Model):
  description = models.CharField(max_length=1000, blank=True)
  element = models.ForeignKey('element', on_delete=models.CASCADE, related_name="costume_elements")
  costume = models.ForeignKey('costume', on_delete=models.CASCADE, related_name="costume_elements")

  def __str__(self):
        return "{}: {}".format(self.id, self.description)
  def __unicode__(self):
        return "{}: {}".format(self.id, self.description)
