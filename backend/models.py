# models.py
# SQLAlchemy ORM models aligned with AWS RDS schema


import joblib
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text, DECIMAL, SmallInteger


# ---------- Base ----------
class Base(DeclarativeBase):
    """Declarative base class for all models."""
    pass


#   IT2 TABLES 

# it2_stretch_challenge

class StretchChallenge(Base):
    __tablename__ = "it2_stretch_challenge"

    site_name: Mapped[str] = mapped_column(String(100), primary_key=True)
    area_name: Mapped[str] = mapped_column(String(100), primary_key=True)
    steps: Mapped[str] = mapped_column(Text)
    site_number: Mapped[int] = mapped_column(Integer)
    site_link: Mapped[str] = mapped_column(String(500))



# it2_stress_relief_suggestions
class StressSuggestion(Base):
    __tablename__ = "it2_stress_relief_suggestions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    site_name: Mapped[str] = mapped_column(String(255))
    suggestion_name: Mapped[str] = mapped_column(String(255))
    steps: Mapped[str] = mapped_column(Text)
    site_number: Mapped[int] = mapped_column(Integer)
    site_link: Mapped[str] = mapped_column(String(500))



# it2_physical_guidelines

class PhysicalGuideline(Base):
    __tablename__ = "it2_physical_guidelines"

    age_group: Mapped[str] = mapped_column(String(32), primary_key=True)
    survey_year: Mapped[int] = mapped_column(SmallInteger, primary_key=True)
    percent_met_guidelines: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_150min_or_more: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_five_or_more_days_active: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_strength_toning_two_days: Mapped[float] = mapped_column(DECIMAL(5, 2))


# it2_workday_activity

class WorkdayActivity(Base):
    __tablename__ = "it2_workday_activity"

    age_group: Mapped[str] = mapped_column(String(32), primary_key=True)
    survey_year: Mapped[int] = mapped_column(SmallInteger, primary_key=True)
    percent_mostly_sitting: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_mostly_standing: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_mostly_walking: Mapped[float] = mapped_column(DECIMAL(5, 2))
    percent_physically_demanding: Mapped[float] = mapped_column(DECIMAL(5, 2))



#  IT3 TABLES 

# it3_connection_score_table

class ConnectionScore(Base):
    __tablename__ = "it3_connection_score_table"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text)
    Daily: Mapped[int] = mapped_column(Integer)
    Weekly: Mapped[int] = mapped_column(Integer)
    Monthly: Mapped[int] = mapped_column(Integer)
    Rarely: Mapped[int] = mapped_column(Integer)
    Never: Mapped[int] = mapped_column(Integer)
    Strongly_agree: Mapped[int] = mapped_column(Integer)
    Agree: Mapped[int] = mapped_column(Integer)
    Neutral: Mapped[int] = mapped_column(Integer)
    Disagree: Mapped[int] = mapped_column(Integer)
    Yes: Mapped[int] = mapped_column(Integer)
    No: Mapped[int] = mapped_column(Integer)
    Unsure: Mapped[int] = mapped_column(Integer)
    Sometimes: Mapped[int] = mapped_column(Integer)
    Often: Mapped[int] = mapped_column(Integer)
    Always: Mapped[int] = mapped_column(Integer)
    official_benchmark: Mapped[str] = mapped_column(String(255))
    mapping_logic: Mapped[str] = mapped_column(String(255))
    source: Mapped[str] = mapped_column(String(255))
    source_link: Mapped[str] = mapped_column(String(700))



# it3_loneliness_trend

class LonelinessTrend(Base):
    __tablename__ = "it3_loneliness_trend"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    year: Mapped[int] = mapped_column(Integer)
    loneliness_percent: Mapped[float] = mapped_column(DECIMAL(6, 3))



# it3_score_calculation_table

class ScoreCalculation(Base):
    __tablename__ = "it3_score_calculation_table"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    total_score_range: Mapped[str] = mapped_column(String(50))
    connection_band: Mapped[str] = mapped_column(String(100))



# it3_social_connection_insights

class SocialConnectionInsight(Base):
    __tablename__ = "it3_social_connection_insights"

    Source_Table: Mapped[str] = mapped_column(String(10), primary_key=True)
    Metric: Mapped[str] = mapped_column(String(50), primary_key=True)
    Sex: Mapped[str] = mapped_column(String(10), primary_key=True)
    Age_group: Mapped[str] = mapped_column(String(10), primary_key=True)
    Year: Mapped[int] = mapped_column(Integer, primary_key=True)
    Value: Mapped[float] = mapped_column(DECIMAL(5, 2))



# it3_volunteering_trend

class VolunteeringTrend(Base):
    __tablename__ = "it3_volunteering_trend"

    year: Mapped[int] = mapped_column(Integer, primary_key=True)
    voluntary_work_through_an_organisation: Mapped[float] = mapped_column(DECIMAL(5, 2))
    informal_volunteering: Mapped[float] = mapped_column(DECIMAL(5, 2))

