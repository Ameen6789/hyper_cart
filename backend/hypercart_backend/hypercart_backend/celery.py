import os
from celery import Celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE","hypercart_backend.settings")
app=Celery("hypercart_backend")
app.config_from_object("django.conf:settings",namespace="CELERY")
app.autodiscover_tasks()