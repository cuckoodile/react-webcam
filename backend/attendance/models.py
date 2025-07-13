from django.db import models

# Create your models here.

class Attendance(models.Model):
    img = models.ImageField(upload_to='attendance_images/')
    created_at = models.DateTimeField(auto_now_add=True)