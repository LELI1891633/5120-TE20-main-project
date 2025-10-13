from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class WellbeingPrompts(BaseModel):
    hydration: bool = True
    stretch: bool = True
    outdoor: bool = True

class PlannerRequest(BaseModel):
    work_start: str
    work_end: str
    tasks: List[str]
    break_duration: int
    wellbeing_prompts: WellbeingPrompts
    template: Optional[str] = "professional"

class BreakTime(BaseModel):
    time: str
    duration: int
    type: str

class WellbeingReminder(BaseModel):
    time: str
    prompt: str
    icon: str
    enabled: bool

class PlannerResponse(BaseModel):
    date: str
    work_hours: str
    tasks: List[str]
    breaks: List[BreakTime]
    wellbeing: List[WellbeingReminder]
    planner_id: Optional[str] = None

class PlannerTemplate(BaseModel):
    id: str
    name: str
    description: str
    color: str
    layout: Dict


