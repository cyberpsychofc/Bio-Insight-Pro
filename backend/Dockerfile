FROM python:3.8-alpine

WORKDIR /backend 

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:${PATH}"

COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /backend 
EXPOSE 8000
RUN python3 manage.py migrate

CMD ["gunicorn", "--config", "gunicorn_config.py", "backend.wsgi:application"]