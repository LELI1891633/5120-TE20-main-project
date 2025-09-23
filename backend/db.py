# backend/db.py
import os, json
import boto3
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ---- Settings / Globals ----
_AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
_session_factory = None
_connection = None  # for raw pymysql reuse across Lambda invocations


# ---------- Secrets Manager (preferred) ----------
def _get_secret_dict(arn: str) -> dict:
    sm = boto3.client("secretsmanager", region_name=_AWS_REGION)
    s = sm.get_secret_value(SecretId=arn)
    return json.loads(s.get("SecretString") or "{}")


def _make_sqlalchemy_engine_from_secret():
    arn = os.getenv("DB_SECRET_ARN")
    dbname = os.getenv("DB_NAME")
    if not arn or not dbname:
        raise RuntimeError("DB_SECRET_ARN and DB_NAME must be set (or use DB_URL)")
    sec = _get_secret_dict(arn)
    user = sec["username"]
    pwd  = sec["password"]
    host = sec["host"]
    port = sec.get("port", 3306)
    url  = f"mysql+pymysql://{user}:{pwd}@{host}:{port}/{dbname}"
    return create_engine(url, pool_pre_ping=True)


def _make_pymysql_conn_from_secret():
    arn = os.getenv("DB_SECRET_ARN")
    dbname = os.getenv("DB_NAME")
    if not arn or not dbname:
        raise RuntimeError("DB_SECRET_ARN and DB_NAME must be set (or use DB_URL)")
    sec = _get_secret_dict(arn)
    return pymysql.connect(
        host=sec["host"],
        user=sec["username"],
        password=sec["password"],
        database=dbname,
        port=int(sec.get("port", 3306)),
        cursorclass=pymysql.cursors.DictCursor,
    )


# ---------- DB_URL fallback (useful for local dev) ----------
def _make_sqlalchemy_engine_from_url():
    db_url = os.getenv("DB_URL")  # mysql+pymysql://user:pass@host:port/dbname
    if not db_url:
        raise RuntimeError("DB_URL not set")
    return create_engine(db_url, pool_pre_ping=True)


def _make_pymysql_conn_from_url():
    db_url = os.getenv("DB_URL")
    if not db_url:
        raise RuntimeError("DB_URL not set")
    from sqlalchemy.engine.url import make_url
    url = make_url(db_url)
    return pymysql.connect(
        host=url.host,
        user=url.username,
        password=url.password,
        database=url.database,
        port=url.port or 3306,
        cursorclass=pymysql.cursors.DictCursor,
    )


# ---------- Public helpers ----------
def get_session_factory():
    """
    Returns a SQLAlchemy session factory. Uses Secret if available, otherwise DB_URL.
    """
    global _session_factory
    if _session_factory is not None:
        return _session_factory

    try:
        engine = _make_sqlalchemy_engine_from_secret()
    except Exception:
        # fallback to DB_URL for local/dev
        engine = _make_sqlalchemy_engine_from_url()

    _session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    return _session_factory


def get_db_connection():
    """
    Returns a raw PyMySQL connection (dict rows). Reuses global for Lambda warm invokes.
    """
    global _connection
    if _connection is not None and _connection.open:
        return _connection

    try:
        _connection = _make_pymysql_conn_from_secret()
    except Exception:
        _connection = _make_pymysql_conn_from_url()

    return _connection

def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy Session.
    """
    factory = get_session_factory()
    db = factory()
    try:
        yield db
    finally:
        db.close()
