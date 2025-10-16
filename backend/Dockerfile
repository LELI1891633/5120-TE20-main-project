
# ==========================================
# OfficeEz Backend AWS Lambda Container
# ==========================================

FROM public.ecr.aws/lambda/python:3.11

# 1. Set working directory to Lambda's expected path
WORKDIR /var/task

# 2. Copy dependency list
COPY requirements.txt .

# 3. Install system-level dependencies required for LightGBM and scientific libs
RUN yum install -y \
    gcc \
    gcc-c++ \
    cmake3 \
    ninja-build \
    libgomp \
    git \
    && ln -s /usr/bin/cmake3 /usr/bin/cmake \
    && python -m pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of the backend code (including handler.py)
COPY . .

# 5. Define the Lambda entrypoint
CMD ["handler.handler"]
