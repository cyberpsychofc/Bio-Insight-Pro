import torch
import nltk
import numpy as np
import transformers
from transformers import AutoTokenizer, AutoModel
from nltk.tokenize import sent_tokenize, RegexpTokenizer
from nltk.corpus import stopwords as nltk_stopwords
from pypdf import PdfReader
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import warnings
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
warnings.filterwarnings('ignore')

stop_words = set(nltk_stopwords.words('english'))
# Loading BioBERT by DMIS-LABS from Huggingface's transformers package
MODEL = AutoModel.from_pretrained("dmis-lab/biobert-large-cased-v1.1")
TOKENIZER = AutoTokenizer.from_pretrained("dmis-lab/biobert-large-cased-v1.1")
# Check if CUDA is available for GPU processing
device = "cuda:0" if torch.cuda.is_available() else "cpu"
MODEL= MODEL.to(device)

def readPDF(file):
    doc = ""

    for page in file.pages:
        doc += page.extract_text()
    
    return doc

def preprocesstext(text):
    tokenizer = RegexpTokenizer(r'[a-zA-Z0-9]+')

    doc_sentences = [x for x in sent_tokenize(text)]
    doc_words = [tokenizer.tokenize(y) for y in doc_sentences] # keep only alphanumeric data
    doc_words_flat = [word for sublist in doc_words for word in sublist]
    doc_filtered = [word for word in doc_words_flat if word.lower() not in stop_words] # drop stop words

    doc_final = " ".join(doc_filtered)

    return doc_final

def generate_embeddings(biotext):
    inputs   = TOKENIZER(biotext, return_tensors="pt", padding=True, truncation=True).to(device)
    inputs = {k: v.to(device) for k, v in inputs.items()} # generate k-v pairs
    with torch.no_grad(): 
        outputs = MODEL(**inputs) 
    embeddings = outputs.last_hidden_state
    return embeddings