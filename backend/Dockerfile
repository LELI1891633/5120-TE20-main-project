# # Lambda base (includes the runtime interface)
# FROM public.ecr.aws/lambda/python:3.11

# # (optional) libs needed by LightGBM runtime
# RUN yum -y update && yum -y install libgomp tar gzip && yum clean all

# # keep pip tooling current
# RUN python -m pip install --upgrade pip setuptools wheel

# # install deps from wheels only (prevents slow source builds)
# COPY requirements.txt .
# RUN pip install --no-cache-dir --only-binary=:all: -r requirements.txt

# # app code
# COPY . .

# # Lambda entry point (module.function)
# CMD ["handler.handler"]


FROM public.ecr.aws/lambda/python:3.11

# Copy requirements file from backend folder
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code into /var/task/backend
COPY backend ./backend

# Copy handler.py to /var/task
COPY backend/handler.py .

# Lambda entry point
CMD ["handler.handler"]
