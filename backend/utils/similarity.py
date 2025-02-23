import torch
import nltk
import numpy as np
from io import BytesIO
from transformers import AutoTokenizer, AutoModel
from nltk.tokenize import sent_tokenize, RegexpTokenizer
from nltk.corpus import stopwords as nltk_stopwords
from sklearn.preprocessing import normalize
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import warnings
warnings.filterwarnings('ignore')

load_dotenv()

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

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

def get_TSNE(embeddings1, embeddings2):
    combined_embeddings = np.vstack((embeddings1, embeddings2)) 
    labels1 = ['Doc 1'] * embeddings1.shape[0]
    labels2 = ['Doc 2'] * embeddings2.shape[0]
    labels = labels1 + labels2 
    color_map = { 'Doc 1': '#5EFEFE',
                'Doc 2': '#E82F71' 
                }
    
    tsne = TSNE(n_components=3, random_state=42, perplexity=17, n_iter=1000, init='random')
    embeddings_3d = tsne.fit_transform(combined_embeddings)
    fig = plt.figure(figsize=(10, 10), dpi=300)
    fig.patch.set_facecolor('black')
    ax = fig.add_subplot(111, projection='3d') 
    ax.grid(color='red', linestyle='dashed', linewidth=0.5)
    for label in color_map.keys(): 
        idx = [i for i, l in enumerate(labels) if l == label] 
        ax.scatter( embeddings_3d[idx, 0], 
                embeddings_3d[idx, 1], 
                embeddings_3d[idx, 2], 
                c=color_map[label], 
                label=label, 
                alpha=0.6, 
                s=50, 
                edgecolors='w' )

    ax.set_title('t-SNE Visualization', fontsize=16)
    ax.set_xlabel('Semantic Space 1', fontsize=14)
    ax.set_ylabel('Semantic Space 2', fontsize=12)
    ax.set_zlabel('Semantic Space 3', fontsize=10)

    ax.legend(loc='best')
    ax.grid(True)
    ax.set_facecolor('black')

    ax.xaxis.label.set_color('white') 
    ax.yaxis.label.set_color('white')  
    ax.zaxis.label.set_color('white') 
    ax.title.set_color('white')  

    ax.tick_params(axis='x', colors='white')
    ax.tick_params(axis='y', colors='white')
    ax.tick_params(axis='z', colors='white')

    plt.tight_layout()
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)

    return buf.getvalue() 