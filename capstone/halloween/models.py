from django.db import models
from django.utils import timezone

# Create your models here.



class Tag(models.Model):
    name = models.CharField(max_length=55)

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)

class Costume(models.Model):
    name = models.CharField(max_length=55)
    description = models.CharField(max_length=1000, blank=True)
    datecreated = models.DateTimeField(default=timezone.now)
    public = models.BooleanField(default=False)
    owner = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        related_name ="costumes",
        null=True
    )

    def __str__(self):
        return "{}: {}".format(self.id, self.name)
    def __unicode__(self):
        return "{}: {}".format(self.id, self.name)

class Boo(models.Model):
  date = models.DateField(auto_now=True)

  def __str__(self):
        return "{}: {}".format(self.id, self.datebood)
  def __unicode__(self):
        return "{}: {}".format(self.id, self.datebood)

class Element(models.Model):
  name = models.CharField(max_length=55)

  def __str__(self):
        return "{}: {}".format(self.id, self.name)
  def __unicode__(self):
        return "{}: {}".format(self.id, self.name)

class CostumeElement(models.Model):
  description = models.CharField(max_length=1000, blank=True)

  def __str__(self):
        return "{}: {}".format(self.id, self.description)
  def __unicode__(self):
        return "{}: {}".format(self.id, self.description)
