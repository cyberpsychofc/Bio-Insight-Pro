import os
from django.conf import settings
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_pinecone import PineconeEmbeddings
from pinecone import Pinecone
import asyncio

os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
os.environ["PINECONE_API_KEY"]=os.getenv("PINECONE_API_KEY")
os.environ["PINECONE_INDEX_NAME"]=os.getenv("PINECONE_INDEX_NAME")

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = os.environ.get("PINECONE_INDEX_NAME")

if index_name not in [i.name for i in pc.list_indexes().index_list["indexes"]]:
    pc.create_index(name=index_name, dimension=1024, metric="cosine")

index = pc.Index(index_name)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 1024,
    chunk_overlap=100,
    separators=["\n\n","\n", " ", ""]
    )

PROMPT = ChatPromptTemplate.from_template("""
You are an expert medical professional. You will be given two most semantically similar 
portions from two different documents, your job is to find out what implicity is similar in medical context between the
two portions of the documents. For each insight you about either Drugs and
Diagnosis discussed in the documents, you will be rewarded. Answer logically and
conversationally without giving any unnecessary non-medical context in 200 words.
{context}
Question: {input}
""")

def load_embedding_model():
    loop = asyncio.new_event_loop() 
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(_load_embeddings()) 

async def _load_embeddings():
    embeddings = PineconeEmbeddings(
    model='multilingual-e5-large',
    pinecone_api_key=os.environ.get('PINECONE_API_KEY'))

    return embeddings

def get_documents(text):
    chunks = text_splitter.split_documents(text_splitter.create_documents([text]))

    indexed_chunks = [{"index":i+1, "text":chunk} for i, chunk in enumerate(chunks)]

    return indexed_chunks

# Pass the paths of all the files to be taken into account of context by the LLM
def store_embeddings(*args):
    embeddings = load_embedding_model()
    vector_store = PineconeVectorStore(embedding=embeddings)

    for file in args:
        loader = PyPDFLoader(
            os.path.join(settings.STATICFILES_DIRS[0], 'uploads', file))
        pages = loader.load()  # Load document pages

        docsforembedding = text_splitter.split_documents(pages)  # Split all pages at once

        # Store embeddings in Pinecone
        vector_store.from_documents(
            documents=docsforembedding,
            embedding=embeddings,
            index_name=index_name
        )

    return vector_store

def retrieval_chain(llm, db):
    retriever = db.as_retriever()
    stuff_documents_chain = create_stuff_documents_chain(
        llm, PROMPT)
    retrieval_chain = create_retrieval_chain(retriever, stuff_documents_chain)

    return retrieval_chain

def load_original_documents(index, query):
    embeddings = load_embedding_model()
    result = index.query(vector=embeddings.embed_query(query),
                        top_k=1,
                        include_values=False)['matches'][0]['id']

    return index.fetch(
        ids=[result]
        )['vectors'][result]['metadata']['text']