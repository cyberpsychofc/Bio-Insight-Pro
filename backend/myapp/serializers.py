from rest_framework import serializers
from .models import FileUpload

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ['id', 'file', 'uploaded_at']  # Adjust based on your model fields

    def to_representation(self, instance):
        """ Customize response data """
        representation = super().to_representation(instance)
        representation['name'] = instance.file.name
        representation['url'] = instance.file.url
        representation['size'] = instance.file.size
        return representation
