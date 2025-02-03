from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import FileUpload
from rest_framework.views import APIView
from .serializers import FileUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

class PDFView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'files' not in request.FILES:
            return Response({'error': 'No files uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_files = []
        for file in request.FILES.getlist('files'):
            try:
                file_upload = FileUpload.objects.create(file=file)
                uploaded_files.append(FileUploadSerializer(file_upload).data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(uploaded_files, status=status.HTTP_201_CREATED)

