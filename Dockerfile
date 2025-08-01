# 1. Use Python base image
FROM python:3.11

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy all project files
COPY . .

# 5. Collect static files
RUN python manage.py collectstatic --noinput

# 6. Expose port 8000
EXPOSE 8000

# 7. Run the app with gunicorn
CMD ["gunicorn", "malonda.wsgi:application", "--bind", "0.0.0.0:8000"]

