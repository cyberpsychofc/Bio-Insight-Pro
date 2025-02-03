from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.PDFView.as_view()),
]