# handler.py
from mangum import Mangum
from app import app

# Expose a single Lambda handler
handler = Mangum(app)