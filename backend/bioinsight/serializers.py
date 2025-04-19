from rest_framework import serializers

class DNAInputSerializer(serializers.Serializer):
    sequence1 = serializers.CharField(required=True)
    sequence2 = serializers.CharField(required=True)