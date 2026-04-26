import os
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv('APP_USERNAME')
PASSWORD = os.getenv('APP_PASSWORD')
URL = os.getenv('URL')