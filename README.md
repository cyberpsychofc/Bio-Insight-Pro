# Bio Insight Pro  

## 📌 Project Overview  
Bio Insight Pro is an AI-powered tool designed to assist doctors and researchers by analyzing large volumes of medical and research documents. It leverages NLP and deep learning to classify clinical texts by cancer type, extract key insights, and perform DNA sequence analysis.  

## 🚀 Features  
- **Clinical Document Classification:** Categorizes documents based on cancer type.  
- **Knowledge Discovery:** Provides insights from medical texts, including DNA sequence analysis.  
- **Information Extraction:** Identifies key details like diagnoses and prescribed medications.  
- **Anomaly Detection:** Flags unusual patterns in medical data.  
- **User-Friendly Interface:** Web-based UI for seamless interaction.  

## 🏷️ Tech Stack  
- **Backend:** Python, Django REST Framework  
- **NLP Models:** BERT, REBEL and more
- **Frontend:** React  
- **Deployment:** Docker, Nginx  
- **Libraries:** Transformers, Biopython, Pandas, NumPy, Matplotlib  

## 📂 Project Structure  
```
/Bio-Insight-Pro
👉 backend/             # Django REST Framework API  
👉 frontend/            # React-based UI  
👉 docker-compose.yml   # Deployment setup  
👉 README.md            # Project documentation  
```

## 📝 Installation & Setup  
### 🔹 Prerequisites  
- Python (>= 3.8)  
- Node.js (>= 14)  
- Docker  

### 🔹 Steps to Run Locally  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/Bio-Insight-Pro.git
   cd Bio-Insight-Pro
   ```
2. Set up the backend:  
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   ```
   #### Development Server
   ```bash
   python manage.py runserver
   ```
   #### Production Server
   ```bash
   gunicorn --config gunicorn_config.py backend.wsgi:application
   ```
3. Set up the frontend:  
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. (Optional) Run with Docker:  
   ```bash
   docker-compose up --build
   ```

## Usage  
1. Upload a clinical document via the web interface.  
2. The AI model analyzes the document and classifies it.  
3. Insights such as diagnosis and prescribed drugs are extracted.  
4. View and download results in an easy-to-read format.  

## 🛠️ Contributors  
- **Om Aryan**  
- **Piyush Dhamecha**  
- **Mehansh Masih**  
- **Adarsh Gandhi**  
- **Harsh Saoji**  

## ⭐ Acknowledgments  
Special thanks to Dr. Supriya Gupta Bani for guidance and support.