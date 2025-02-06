import os
from django.conf import settings
from .models import FileUpload
from rest_framework.views import APIView
from .serializers import FileUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from pinecone import Pinecone

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

class CleanupSessionView(APIView):
    def post(self, request):
        # Clear previous session's records from Pinecone
        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        index = pc.Index(os.environ.get("PINECONE_INDEX_NAME"))
        stats = index.describe_index_stats()
        # Check if any namespaces exist
        if "namespaces" in stats and stats["namespaces"]:
            index.delete(delete_all=True)

        # Clear up files from the file directory
        dir_path = os.path.join(settings.STATICFILES_DIRS[0], 'uploads')

        if os.path.exists(dir_path):
            for filename in os.listdir(dir_path):
                file_path = os.path.join(dir_path, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"Deleted: {file_path}") # remove in prod
                else:
                    print(f"Skipped (not a file): {file_path}")

        return Response(
            {"messsage":"Session cleared successfully"},
            status=status.HTTP_200_OK
        )