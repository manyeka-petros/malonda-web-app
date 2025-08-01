# 1. Use Python base image
FROM python:3.11-slim

# 2. Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set working directory
WORKDIR /app

# 4. Install system dependencies (for Pillow, psycopg2, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && apt-get clean

# 5. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy project files
COPY . .

# 7. Collect static files
RUN python manage.py collectstatic --noinput

# 8. Expose port 8000
EXPOSE 8000

# 9. Run the app with gunicorn
CMD ["gunicorn", "malonda.wsgi:application", "--bind", "0.0.0.0:8000"]
