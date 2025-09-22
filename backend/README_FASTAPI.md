# Eye Health FastAPI Backend

This is the new FastAPI-based backend for the Eye Health Analysis system, replacing the local model system with a cloud-ready, database-backed solution.

##  Quick Start

### 1. Database Setup

First, you need a MySQL database. You can use:
- Local MySQL server
- Cloud MySQL (AWS RDS, Google Cloud SQL, etc.)
- MySQL Docker container

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp env_template.txt .env
   ```

2. Edit `.env` file with your database credentials:
   ```
   DB_URL=mysql+pymysql://username:password@localhost:3306/eye_health_db
   ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Initialize Database

```bash
python init_database.py
```

This will:
- Create the `user_health` table
- Insert sample data
- Verify the setup

### 5. Start the Server

```bash
python start_fastapi.py
```

The API will be available at:
- **API Base**: http://127.0.0.1:3001
- **Documentation**: http://127.0.0.1:3001/docs
- **Health Check**: http://127.0.0.1:3001/health

## API Endpoints

### Eye Health Analysis
- **POST** `/api/eye-health/analyze`
- **Input**: `{age, gender, screen_time_hours, physical_activity_hours}`
- **Output**: `{risk_level, risk_level_name, confidence, recommendations}`

### User Data Management
- **POST** `/api/eye-health/save-user-data`
- **Input**: Same as analyze endpoint
- **Output**: Success message

### Database Management
- **GET** `/health/db` - Database health check
- **GET** `/tables` - List all tables
- **GET** `/peek?table=user_health` - View table data

## 🔧 Configuration

### Database Schema

The `user_health` table structure:
```sql
CREATE TABLE user_health (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    screen_time_hours DECIMAL(4,2) NOT NULL,
    physical_activity_hours DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Model Information

- **Model Type**: LightGBM Multi-class Classifier
- **Classes**: 0=Low Risk, 1=Medium Risk, 2=High Risk
- **Features**: age, gender (encoded), screen_time_hours, physical_activity_hours
- **Accuracy**: 99.7%

## 🐛 Troubleshooting

### Common Issues

1. **"Models not loaded" error**
   - Check if `eye_multiclass_model.pkl` and `le_gender.pkl` exist
   - Verify file permissions

2. **Database connection failed**
   - Check MySQL server is running
   - Verify credentials in `.env` file
   - Test connection with `python test_db_connection.py`

3. **Port already in use**
   - Change port in `start_fastapi.py`
   - Kill existing processes on port 3001

### Testing Database Connection

```bash
python test_db_connection.py
```

## 🔄 Migration from Old System

The new system is designed to be a drop-in replacement:

1. **Same API endpoint**: `/api/eye-health/analyze`
2. **Compatible response format**: Maintains existing frontend compatibility
3. **Enhanced features**: Database storage, better error handling, API documentation

## 📈 Performance

- **Response time**: < 100ms for predictions
- **Concurrent users**: Supports multiple simultaneous requests
- **Scalability**: Ready for cloud deployment (AWS Lambda, Docker, etc.)

## 🔒 Security

- CORS enabled for frontend domains
- Input validation with Pydantic models
- SQL injection protection with parameterized queries
- Environment variables for sensitive data

## 🚀 Deployment Options

### Local Development
```bash
python start_fastapi.py
```

### Production (Uvicorn)
```bash
uvicorn fastapi_app:app --host 0.0.0.0 --port 3001
```

### Docker
```dockerfile
FROM python:3.11
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "3001"]
```

### AWS Lambda
Use the provided `lambda_function.py` as a starting point for serverless deployment.
