import json
import random
import os

class QuizEngine:
    """Handles the data loading, scoring logic, and high-score persistence."""
    
    def __init__(self, data_file="questions.json", highscore_file="highscore.txt"):
        self.data_file = data_file
        self.highscore_file = highscore_file
        self.questions = self.load_questions()

    def load_questions(self):
        """Loads questions from JSON file with error handling."""
        try:
            with open(self.data_file, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Error: {self.data_file} not found.")
            return {}
        except json.JSONDecodeError:
            print(f"Error: Failed to decode {self.data_file}.")
            return {}

    def get_high_score(self):
        if os.path.exists(self.highscore_file):
            with open(self.highscore_file, 'r') as f:
                try:
                    return int(f.read())
                except ValueError:
                    return 0
        return 0

    def save_high_score(self, new_score):
        current_high = self.get_high_score()
        if new_score > current_high:
            with open(self.highscore_file, 'w') as f:
                f.write(str(new_score))
            return True
        return False

    def get_rank(self, percentage):
        if percentage == 100: return "🥇 Quiz Master", "A"
        if percentage >= 80:  return "🥈 Expert", "B"
        if percentage >= 60:  return "🥉 Learner", "C"
        return "📚 Keep Practicing", "D"