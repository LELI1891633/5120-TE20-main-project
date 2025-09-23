# handler.py
import json, base64, os
from typing import Any, Dict, Optional
from backend.db import get_db_connection
from pymysql.cursors import DictCursor
from sqlalchemy import text


def _ok(body: Dict[str, Any], status=200, headers: Optional[Dict[str,str]]=None):
    h = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,ClientId",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS,PATCH",
    }
    if headers: h.update(headers)
    return {"statusCode": status, "headers": h, "body": json.dumps(body)}


def _json_body(event) -> Dict[str, Any]:
    body = event.get("body")
    if not body:
        return {}
    if event.get("isBase64Encoded"):
        body = base64.b64decode(body).decode("utf-8")
    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return {}

def handler(event, context):
    rc = event.get("requestContext") or {}
    http = rc.get("http") or {}
    # Support both HTTP API (v2) and REST API
    method = http.get("method") or event.get("httpMethod", "")
    path   = event.get("rawPath") or event.get("path") or ""
    qs     = event.get("queryStringParameters") or {}
    hdrs   = event.get("headers") or {}
    data   = _json_body(event)

    # Health
    if method == "GET" and path in ("/health", "/"):
        return _ok({"ok": True, "env": os.getenv("APP_ENV", "dev")})

    # ------- Insights (OfficeEase) -------
    if method == "GET" and path == "/insights/danger-time/common":
        return _ok({"code": 0, "message": "ok", "data": {"hour": None, "confidence": None}})
    if method == "GET" and path == "/insights/danger-time/next":
        return _ok({"code": 0, "message": "ok", "data": {"start_time": None, "end_time": None, "triggers": []}})
    if method == "GET" and path == "/insights/sessions/pattern":
        return _ok({"code": 0, "message": "ok", "query": qs, "data": []})

    # ------- Stretches / content -------
    if method == "GET" and path == "/stretches":
        return _ok({"code": 0, "message": "ok", "query": qs, "data": []})
    if method == "GET" and path.startswith("/stretches/") and path.count("/") == 3:
        _, _, site, area = path.split("/", 3)
        return _ok({"code": 0, "message": "ok", "data": {"site": site, "area": area, "steps": None}})

    # ------- Hydration (US 3.1) -------
    if method == "GET" and path == "/hydration/progress":
        return _ok({"code": 0, "message": "ok", "query": qs, "data": {"total_ml": None, "goal_ml": None}})
    if method == "POST" and path == "/hydration/log":
        return _ok({"code": 0, "message": "logged", "input": data}, status=201)
    if method == "PATCH" and path == "/settings/hydration":
        return _ok({"code": 0, "message": "updated", "input": data})

    # ------- Stress relief (US 4.2) -------
    if method == "POST" and path == "/stress/trigger":
        return _ok({"code": 0, "message": "triggered", "input": data}, status=202)
    if method == "GET" and path == "/stress/suggestions":
        return _ok({"code": 0, "message": "ok", "data": [{"type":"breathe","duration_sec":60}]})
    if method == "POST" and path == "/stress/session":
        return _ok({"code": 0, "message": "saved", "input": data}, status=201)

    # ------- Movement challenges -------
    if method == "GET" and path == "/movement/today":
        return _ok({"code": 0, "message": "ok", "data": {"challenge_id": None, "title": None, "duration_sec": 60}})
    if method == "POST" and path == "/movement/complete":
        return _ok({"code": 0, "message": "completed", "input": data})

    # ------- Eye health (US 2.1) -------
    if method == "GET" and path == "/eye/risk":
        return _ok({"code": 0, "message": "ok", "data": {"score": None, "band": None, "next_break_eta_sec": None}})
    if method == "POST" and path == "/eye/break/start":
        return _ok({"code": 0, "message": "started", "input": data}, status=201)
    if method == "POST" and path == "/eye/break/complete":
        return _ok({"code": 0, "message": "completed", "input": data})

    # ------- Vitamin D (US 2.2) -------
    if method == "GET" and path == "/vitd/window":
        return _ok({"code": 0, "message": "ok", "data": {"window_start": None, "window_end": None}})
    if method == "POST" and path == "/vitd/complete":
        return _ok({"code": 0, "message": "logged", "input": data}, status=201)

    # ------- Generic sessions -------
    if method == "GET" and path == "/sessions":
        return _ok({"code": 0, "message": "ok", "query": qs, "data": []})
    if method == "GET" and path.startswith("/sessions/") and path.count("/") == 2:
        sid = path.rsplit("/", 1)[-1]
        return _ok({"code": 0, "message": "ok", "data": {"id": sid}})
    if method == "POST" and path == "/sessions/stretch":
        return _ok({"code": 0, "message": "created", "input": data}, status=201)
    if method == "POST" and path == "/sessions/break":
        return _ok({"code": 0, "message": "created", "input": data}, status=201)
    if method == "DELETE" and path.startswith("/sessions/") and path.count("/") == 2:
        sid = path.rsplit("/", 1)[-1]
        return _ok({"code": 0, "message": "deleted", "data": {"id": sid}})

    # CORS preflight
    if method == "OPTIONS":
        return _ok({"ok": True})

    if method == "GET" and path == "/db/ping":
            try:
                conn = get_db_connection()
                with conn.cursor(DictCursor) as cur:
                    cur.execute("SELECT 1 AS ping")
                    row = cur.fetchone()  # {'ping': 1}
                return _ok({"code": 0, "message": "ok", "ping": row["ping"]})
            except Exception as e:
                return _ok({"code": 500, "message": f"db error: {e}"}, status=500)
    if method == "OPTIONS":
        return _ok({"ok": True})
    
    return _ok({"code": 404, "message": f"No route for {method} {path}"}, status=404)
