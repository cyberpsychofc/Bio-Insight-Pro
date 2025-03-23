import os
import time
import numpy as np
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from langchain_openai import ChatOpenAI
from pypdf import PdfReader
from pinecone import Pinecone
from neo4j import GraphDatabase

from utils.ner import perform_ner
from utils.similarity import (
    preprocess,
    generate_embeddings,
    find_top_matching_pairs,
    get_TSNE
)
from utils.retriever import (
    get_documents,
    store_embeddings,
    retrieval_chain,
    load_original_documents
)

os.environ["NEO4J_URI"] = os.environ.get("NEO4J_URI")
os.environ["NEO4J_USERNAME"] = os.environ.get("NEO4J_USERNAME")
os.environ["NEO4J_PASSWORD"] = os.environ.get("NEO4J_PASSWORD")

llm = ChatOpenAI(
    model="gpt-4o-mini") # Loading LLM agent
# Vector DB
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index(os.environ.get("PINECONE_INDEX_NAME"))

PORTIONS = """
What is similar between the following portions of medical text?
Portions 1 : {} and Portions 2 : {}.
"""
PATH = os.path.join(settings.STATICFILES_DIRS[0], 'uploads')
embeddings = []
indexed_chunks = []
neo4jdriver = GraphDatabase.driver(
    os.environ["NEO4J_URI"], 
    auth=(os.environ["NEO4J_USERNAME"], os.environ["NEO4J_PASSWORD"]))

class Session:
    most_similar = None
    vector_store = None
    embeddings = [] # matching pairs
    tsne = None
    flag = True

def create_database(driver, db_name):
    with driver.session(database="system") as session:
        session.run(f"CREATE DATABASE {db_name}")

class FindSimilarity(APIView):
    def post(self, request):
        files = [entry.name for entry in os.scandir(PATH) if entry.is_file()]
        if len(files) == 0:
            Session.flag = False
        if(Session.flag):
            for file in files:
                single_indexed_chunks = get_documents(preprocess(PdfReader(PATH + '/' + file)))
                indexed_chunks.append(single_indexed_chunks)

                embeddings.append(
                    generate_embeddings(single_indexed_chunks,
                                batch_size=32
                            )
                        )
            Session.embeddings = [np.array(embeddings[0]),np.array(embeddings[1])]
            # current implementation for first 2 files only
            matching_pairs = find_top_matching_pairs(embeddings[0],embeddings[1],indexed_chunks[0],indexed_chunks[1])
            most_similar = list(map(lambda x : x, sorted(matching_pairs, key=lambda d:d['similarity_score'])))[-1]

            Session.most_similar = most_similar

            # Store files in the vectorDB index if files are present
            Session.vector_store = store_embeddings(*files)

            return Response({
                "message":"BioBERT inference successful"
            },
                status=status.HTTP_200_OK
            )
        
        return Response({
            "message":"Inference failure"
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
class Retreival(APIView):
    def get(self, request):
        # Wait for Embeddings to get stored on Pinecone
        time.sleep(10)
        
        firstportion = load_original_documents(index, Session.most_similar['left_chunk'])
        secondportion = load_original_documents(index, Session.most_similar['left_chunk'])
        # Add to the LLM's chain of thought
        chain_of_thought = retrieval_chain(
            llm, 
            Session.vector_store
        )
        
        response = chain_of_thought.invoke({
            'input': PORTIONS.format(firstportion, secondportion)
            })

        return Response({
            "ModelResponse": response['answer'],
            "similarity_score":Session.most_similar['similarity_score']
        },
        status=status.HTTP_200_OK)
    
class TSNE(APIView):
    def get(self, request):
        visual = get_TSNE(Session.embeddings[0], Session.embeddings[1])
        response = HttpResponse(visual, content_type='image/png')
        response['Content-Disposition'] = 'inline; filename="inference_output.png"'

        return response
    
class NERView(APIView):
    def post(self, request, index):
        files = [entry.name for entry in os.scandir(PATH) if entry.is_file()]
        if index < 1 or index > len(files):
            return Response({"error": "invalid index"}, status=status.HTTP_400_BAD_REQUEST)
        # creates database
        create_database(neo4jdriver, files[index-1][:(len(files[index-1]))-4])
        
        processed_corpus = preprocess(PdfReader(PATH + '/' + files[index-1]))
        # create graph-db
        perform_ner(files[index-1][:(len(files[0]))-4], processed_corpus)
        
        return Response({"message":"success"},status=status.HTTP_201_CREATED)