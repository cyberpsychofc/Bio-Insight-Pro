import os
import re
# from langchain_groq import ChatGroq
from concurrent.futures import ProcessPoolExecutor
from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI


entites_to_be_extracted = ['CANCER','DRUG','DISEASE','GENE','PROTIEN','BIO-MARKER',
                           'ANATOMICAL_LOCATION','ENZYME','HALLMARK','TREATMENT']

os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY")

llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0) # LLM used to perform NER

llm_transformer = LLMGraphTransformer(
    llm=llm,
    allowed_nodes=entites_to_be_extracted,
    additional_instructions="Extract entities in the context of Oncology"
    )

os.environ["NEO4J_URI"] = os.environ.get("NEO4J_URI")
os.environ["NEO4J_USERNAME"] = os.environ.get("NEO4J_USERNAME")
os.environ["NEO4J_PASSWORD"] = os.environ.get("NEO4J_PASSWORD")


def perform_ner(neo4jdb, text):
    graphdb = Neo4jGraph(
        url=os.environ["NEO4J_URI"], 
        username=os.environ["NEO4J_USERNAME"], 
        password=os.environ["NEO4J_PASSWORD"],
        database=neo4jdb
    )
    
    docs = [Document(page_content=text)]
    graph_docs = llm_transformer.convert_to_graph_documents(docs)
    graphdb.add_graph_documents(graph_docs)
    graphdb.close()