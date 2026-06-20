import os
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

# Retrieve GROQ_API_KEY environment variable (placeholder)
# DO NOT hardcode any API keys.
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MOCK_REVIEW = """Strengths:
* Strong market potential

Weaknesses:
* Requires network effects

Target Audience:
* Startup founders

MVP Suggestions:
* User profiles
* Matching algorithm"""


async def generate_idea_review(title: str, description: str) -> str:
    """
    Generates an AI-powered review for the startup idea.
    Currently returns mock review data.
    """
    # =========================================================================
    # Future AI provider integration point
    #
    # When integrating the Groq API provider:
    # 1. Install groq SDK (pip install groq)
    # 2. Import the Groq client:
    #    from groq import AsyncGroq
    # 3. Initialize client:
    #    client = AsyncGroq(api_key=GROQ_API_KEY)
    # 4. Request completion:
    #    chat_completion = await client.chat.completions.create(
    #        messages=[
    #            {
    #                "role": "user",
    #                "content": f"Review this idea.\nTitle: {title}\nDescription: {description}",
    #            }
    #        ],
    #        model="llama3-8b-8192",
    #    )
    #    return chat_completion.choices[0].message.content
    # =========================================================================
    
    # DO NOT call Groq yet. Use environment variable loading only.
    # Return mock review data as required.
    return MOCK_REVIEW
