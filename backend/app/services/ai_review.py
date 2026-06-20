class AIReviewService:
    @staticmethod
    async def generate_review(idea_title: str, idea_description: str) -> str:
        """
        Generates an AI review for a given idea.
        Currently returns a placeholder review.
        Future implementation can integrate an AI provider (e.g. OpenAI/Gemini).
        """
        # Infrastructure placeholder
        return f"AI Review Placeholder: Feedback for Idea '{idea_title}' based on description: '{idea_description[:100]}...'"
