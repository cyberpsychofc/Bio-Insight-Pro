from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.PDFView.as_view()),
    path('session/clear', views.CleanupSessionView.as_view()),
]