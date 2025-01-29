FROM python:3.8-alpine

WORKDIR /backend 
RUN apk update && apk add --no-cache gcc musl-dev
COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /backend 
EXPOSE 8000
RUN python3 manage.py migrate

CMD ["gunicorn", "--config", "gunicorn_config.py", "backend.wsgi:application"]