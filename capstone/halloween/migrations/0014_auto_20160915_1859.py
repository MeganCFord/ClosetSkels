# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-15 18:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('halloween', '0013_auto_20160915_1703'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='costumes',
        ),
        migrations.AddField(
            model_name='tag',
            name='costumes',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='halloween.Costume'),
        ),
    ]
