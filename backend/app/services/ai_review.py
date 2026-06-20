MOCK_REVIEW = """Strengths:
* Strong market potential

Weaknesses:
* Requires network effects

Target Audience:
* Startup founders

MVP Suggestions:
* User profiles
* Matching algorithm"""


class AIReviewService:
    @staticmethod
    async def generate_review(idea_title: str, idea_description: str) -> str:
        """
        Generates an AI review for a given idea.
        Currently returns a mock review.
        Future implementation can integrate an AI provider (e.g. Gemini, OpenAI, Groq).
        """
        # =========================================================================
        # FUTURE AI PROVIDER INTEGRATION GOES HERE:
        #
        # 1. Initialize the client (e.g., openai.AsyncOpenAI() or google.genai.Client())
        #    using API keys from environment variables (e.g., os.getenv("GEMINI_API_KEY")).
        #
        # 2. Construct a prompt template, for example:
        #    prompt = f"Analyze this startup idea.\nTitle: {idea_title}\nDescription: {idea_description}"
        #
        # 3. Call the AI model API:
        #    response = await client.chat.completions.create(
        #        model="gpt-4o",
        #        messages=[{"role": "user", "content": prompt}]
        #    )
        #    review_text = response.choices[0].message.content
        #
        # 4. Return the generated review_text.
        # =========================================================================
        
        # Return mock AI review as required for now
        return MOCK_REVIEW
