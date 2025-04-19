from django.urls import path
from . import views

urlpatterns = [
    path('similarity/predict', views.FindSimilarity.as_view()),
    path('similarity/fetch', views.Retreival.as_view()),
    path('similarity/tsne-plot', views.TSNE.as_view()),
    path('ner/<int:index>/create-graph',views.NERView.as_view()),
]