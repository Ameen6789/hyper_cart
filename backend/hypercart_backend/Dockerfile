FROM python:3.12.3-slim

RUN useradd -m appuser
WORKDIR /app

COPY req_for_docker.txt .

RUN pip install -r req_for_docker.txt

COPY  --chown=appuser:appuser . .

RUN mkdir -p /app/media && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["python","manage.py","runserver","0.0.0.0:8000"]