# backend/models.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean

class Base(DeclarativeBase):
    pass

# ---- tips table ----
class StressTip(Base):
    __tablename__ = "it2_stress_relief_suggestions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # If your column is named something else (e.g., "suggestion" or "tip_text"),
    # use mapped_column("suggestion", String(255), nullable=False)
    text: Mapped[str] = mapped_column(String(255), nullable=False)

    # delete these if your table doesn't have them
    category: Mapped[str] = mapped_column(String(50), default="stress")
    active: Mapped[bool] = mapped_column(Boolean, default=True)

# ---- activity steps table ----
class BreakStep(Base):
    __tablename__ = "it2_stretch_challenge"  # change if your steps table has a different name

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Adjust names if your columns differ (e.g., "instruction" instead of "cue")
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    cue: Mapped[str] = mapped_column(String(512), nullable=False)

    # If your DB stores minutes instead of seconds, map the real column name:
    # duration_sec: Mapped[int] = mapped_column("duration", Integer, nullable=False)
    duration_sec: Mapped[int] = mapped_column(Integer, nullable=False)

    sequence: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
