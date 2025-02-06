import os
import torch
import nltk
import numpy as np
from transformers import AutoTokenizer, AutoModel
from nltk.tokenize import sent_tokenize, RegexpTokenizer
from nltk.corpus import stopwords as nltk_stopwords
from sklearn.preprocessing import normalize
from dotenv import load_dotenv
import warnings
warnings.filterwarnings('ignore')

load_dotenv()

nltk_data_path = os.path.join(os.getenv('APPDATA', ''), 'nltk_data')

def ensure_nltk_resource(resource_name):
    resource_path = os.path.join(nltk_data_path, resource_name)
    if os.path.exists(resource_path):
        print(f"Skipping download : {resource_name}")
    else:
        print(f"Downloading {resource_name}...")
        nltk.download(resource_name, download_dir=nltk_data_path)

ensure_nltk_resource('corpora/stopwords')
ensure_nltk_resource('tokenizers/punkt')
ensure_nltk_resource('tokenizers/punkt_tab')

stop_words = set(nltk_stopwords.words('english'))
# Loading BioBERT by DMIS-LABS from Huggingface's transformers package
MODEL = AutoModel.from_pretrained("dmis-lab/biobert-large-cased-v1.1")
TOKENIZER = AutoTokenizer.from_pretrained("dmis-lab/biobert-large-cased-v1.1")
# Check if CUDA is available for GPU processing
device = "cuda:0" if torch.cuda.is_available() else "cpu"
MODEL= MODEL.to(device)


def preprocess(file):
    text = ""

    for page in file.pages:
        text += page.extract_text()

    tokenizer = RegexpTokenizer(r'[a-zA-Z]+')

    doc_sentences = [x for x in sent_tokenize(text)]
    doc_words = [tokenizer.tokenize(y) for y in doc_sentences] # keep only alphanumeric data
    doc_words_flat = [word for sublist in doc_words for word in sublist]
    doc_filtered = [word for word in doc_words_flat if word.lower() not in stop_words] # drop stop words

    doc_final = " ".join(doc_filtered)

    return doc_final

def get_embedding(text):
    encoded_input = TOKENIZER(
        text, 
        padding=True, 
        truncation=True, 
        max_length=512, 
        return_tensors='pt'
    )

    encoded_input = {key : val.to(device) for key, val in encoded_input.items()}

    with torch.no_grad():
        model_output = MODEL(**encoded_input)
    
    last_hidden_state = model_output.last_hidden_state

    attention_mask = encoded_input['attention_mask']

    # Mean-pooling
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
    sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, dim = 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(dim=1),min=1e-9)
    mean_pooled = sum_embeddings / sum_mask

    embedding = mean_pooled.cpu().numpy()
    return embedding

# batch-processing
def generate_embeddings(indexed_chunks, batch_size = 32):
    embeddings = []

    total_chunks = len(indexed_chunks)

    for start_idx in range(0, total_chunks, batch_size):
        batch_chunks = indexed_chunks[start_idx:start_idx + batch_size]
        texts = [chunk['text'].page_content for chunk in batch_chunks]

        encoded_input = TOKENIZER(
            texts,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors='pt'
        ).to(device)

        with torch.no_grad():
            model_output = MODEL(**encoded_input)

        last_hidden_state = model_output.last_hidden_state
        attention_mask = encoded_input['attention_mask']

        # Mean-pooling
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, dim = 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(dim=1),min=1e-9)
        mean_pooled = sum_embeddings / sum_mask

        batch_embeddings = mean_pooled.cpu().numpy()
        embeddings.extend(batch_embeddings)
        print(f"Processed Batch : {start_idx // batch_size + 1} / {np.ceil(total_chunks/batch_size)}")
        
    return embeddings

def find_top_matching_pairs(embeddings1, embeddings2, indexed_chunks1, indexed_chunks2):
    # convert to numpy arrays
    embeddings1_np = np.vstack(embeddings1)
    embeddings2_np = np.vstack(embeddings2)
    # normalising each embedding
    embeddings1_normalized = normalize(embeddings1_np)
    embeddings2_normalized = normalize(embeddings2_np)

    # cosine similarity
    similarity_matrix = np.dot(embeddings1_normalized, embeddings2_normalized.T)

    most_similar_indices = np.argmax(similarity_matrix, axis=1)
    similarity_scores = np.max(similarity_matrix, axis=1)

    matched_pairs = []
    for idx1, (idx, score) in enumerate(zip(most_similar_indices, similarity_scores)):
        if score > 0.98:
            continue
        pair = {
            "left_chunk":indexed_chunks1[idx1]['text'].page_content,
            "right_chunk":indexed_chunks2[idx1]['text'].page_content,
            "similarity_score":score
        }
        matched_pairs.append(pair)
    
    return matched_pairs