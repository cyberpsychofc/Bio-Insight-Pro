from django.db import models
import os

class FileUpload(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def filename(self):
        return os.path.basename(self.file.name)
    
    def __str__(self):
        return self.filename()