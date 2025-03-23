from django.urls import path
from .views import DNAAlignmentView

urlpatterns = [
    path('align', DNAAlignmentView.as_view(), name='dna-alignment'),
]