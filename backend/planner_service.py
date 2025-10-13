import uuid
from datetime import datetime, timedelta
from typing import List, Dict
from planner_models import PlannerRequest, PlannerResponse, BreakTime, WellbeingReminder
import logging

logger = logging.getLogger(__name__)

class PlannerService:
    def __init__(self):
        self.wellbeing_prompts = {
            "hydration": {
                "time": "10:00",
                "prompt": "Stay hydrated! Drink a glass of water",
                "icon": "💧"
            },
            "stretch": {
                "time": "11:30", 
                "prompt": "Take a quick stretch break",
                "icon": "🧘‍♀️"
            },
            "outdoor": {
                "time": "15:00",
                "prompt": "Get some fresh air and sunlight", 
                "icon": "🌞"
            }
        }
    
    def generate_planner(self, request: PlannerRequest) -> PlannerResponse:
        """Generate a daily planner based on the request"""
        try:
            # Get current date
            today = datetime.now()
            date_string = today.strftime("%A, %B %d, %Y")
            
            # Generate break times
            breaks = self._generate_break_times(request.work_start, request.break_duration)
            
            # Generate wellbeing reminders
            wellbeing = self._generate_wellbeing_reminders(request.wellbeing_prompts)
            
            # Create planner response
            planner = PlannerResponse(
                date=date_string,
                work_hours=f"{request.work_start} - {request.work_end}",
                tasks=request.tasks,
                breaks=breaks,
                wellbeing=wellbeing,
                planner_id=str(uuid.uuid4())
            )
            
            logger.info(f"Generated planner with ID: {planner.planner_id}")
            return planner
            
        except Exception as e:
            logger.error(f"Error generating planner: {str(e)}")
            raise
    
    def _generate_break_times(self, work_start: str, break_duration: int) -> List[BreakTime]:
        """Generate break times based on work start time"""
        try:
            # Parse work start time
            start_hour, start_minute = map(int, work_start.split(':'))
            
            # Calculate break times
            morning_break_hour = start_hour + 1
            morning_break_minute = start_minute + 30
            if morning_break_minute >= 60:
                morning_break_hour += 1
                morning_break_minute -= 60
            
            afternoon_break_hour = start_hour + 5
            afternoon_break_minute = start_minute
            if afternoon_break_minute >= 60:
                afternoon_break_hour += 1
                afternoon_break_minute -= 60
            
            breaks = [
                BreakTime(
                    time=f"{morning_break_hour:02d}:{morning_break_minute:02d}",
                    duration=break_duration,
                    type="Morning Break"
                ),
                BreakTime(
                    time=f"{afternoon_break_hour:02d}:{afternoon_break_minute:02d}",
                    duration=break_duration,
                    type="Afternoon Break"
                )
            ]
            
            return breaks
            
        except Exception as e:
            logger.error(f"Error generating break times: {str(e)}")
            # Return default breaks
            return [
                BreakTime(time="10:30", duration=break_duration, type="Morning Break"),
                BreakTime(time="14:00", duration=break_duration, type="Afternoon Break")
            ]
    
    def _generate_wellbeing_reminders(self, wellbeing_prompts) -> List[WellbeingReminder]:
        """Generate wellbeing reminders based on enabled prompts"""
        reminders = []
        
        for prompt_type, enabled in wellbeing_prompts.dict().items():
            if enabled and prompt_type in self.wellbeing_prompts:
                prompt_data = self.wellbeing_prompts[prompt_type]
                reminders.append(WellbeingReminder(
                    time=prompt_data["time"],
                    prompt=prompt_data["prompt"],
                    icon=prompt_data["icon"],
                    enabled=True
                ))
        
        return reminders
    
    def get_available_templates(self) -> List[Dict]:
        """Get available planner templates"""
        return [
            {
                "id": "professional",
                "name": "Professional",
                "description": "Clean and structured for office work",
                "color": "from-blue-500 to-indigo-600"
            },
            {
                "id": "creative", 
                "name": "Creative",
                "description": "Colorful and inspiring for creative work",
                "color": "from-purple-500 to-pink-600"
            },
            {
                "id": "minimal",
                "name": "Minimal", 
                "description": "Simple and focused design",
                "color": "from-gray-500 to-slate-600"
            },
            {
                "id": "wellness",
                "name": "Wellness Focus",
                "description": "Emphasizes health and wellbeing", 
                "color": "from-green-500 to-emerald-600"
            }
        ]
