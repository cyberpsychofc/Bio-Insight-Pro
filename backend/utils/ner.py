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
    model="gpt-4o-mini", # Switch to 4o for better results
    temperature=0.1) # LLM used to perform NER

llm_transformer = LLMGraphTransformer(
    llm=llm,
    allowed_nodes=entites_to_be_extracted,
    additional_instructions="Extract entities in the context of Oncology"
    )

os.environ["NEO4J_URI"] = os.environ.get("NEO4J_URI")
os.environ["NEO4J_USERNAME"] = os.environ.get("NEO4J_USERNAME")
os.environ["NEO4J_PASSWORD"] = os.environ.get("NEO4J_PASSWORD")


def chunk_text(text, chunk_size=4000):  # Adjust chunk size as needed
    sentences = re.split(r'(?<=[.!?])\s+', text)  # Split by sentence boundaries
    chunks, chunk = [], []
    current_length = 0

    for sentence in sentences:
        sentence_length = len(sentence)
        if current_length + sentence_length <= chunk_size:
            chunk.append(sentence)
            current_length += sentence_length
        else:
            chunks.append(" ".join(chunk))
            chunk = [sentence]
            current_length = sentence_length

    if chunk:
        chunks.append(" ".join(chunk))

    return chunks

def process_chunk(args):
    neo4jdb, text_chunk = args  # Unpack arguments
    graphdb = Neo4jGraph(
        url=os.environ["NEO4J_URI"], 
        username=os.environ["NEO4J_USERNAME"], 
        password=os.environ["NEO4J_PASSWORD"],
        database=neo4jdb
    )

    docs = [Document(page_content=text_chunk)]
    graph_docs = llm_transformer.convert_to_graph_documents(docs)
    
    # Store extracted entities in Neo4j
    graphdb.add_graph_documents(graph_docs)

def perform_ner_parallel(neo4jdb, large_text, num_workers=4):
    text_chunks = chunk_text(large_text, chunk_size=4000)  # Split text into chunks

    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        executor.map(process_chunk, [(neo4jdb, chunk) for chunk in text_chunks])