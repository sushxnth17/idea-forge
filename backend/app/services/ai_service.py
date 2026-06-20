import os
import json
import urllib.request
import urllib.error
import asyncio
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

# Retrieve GROQ_API_KEY environment variable
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


async def generate_idea_review(title: str, description: str) -> str:
    """
    Generates a structured AI review for the startup idea using the Groq API.
    Raises ValueError if GROQ_API_KEY is missing or unconfigured.
    """
    # Verify that the API key is present and is not the default placeholder
    if not GROQ_API_KEY or GROQ_API_KEY.strip() == "" or GROQ_API_KEY == "your_groq_api_key_here":
        raise ValueError(
            "GROQ_API_KEY is missing or un configured. "
            "Please configure a valid GROQ_API_KEY in your environment/dotenv file."
        )

    # Groq OpenAI-compatible chat completion URL
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    # Prompt requesting specific sections
    prompt = f"""You are an expert startup advisor and product manager.
Analyze the following startup idea and provide a structured review.
Title: {title}
Description: {description}

Your review MUST strictly use the following headers (with exact spelling) and format. Provide bullet points under each section:

Strengths:
* [Strength item 1]
* [Strength item 2]

Weaknesses:
* [Weakness item 1]
* [Weakness item 2]

Target Audience:
* [Target item 1]
* [Target item 2]

MVP Suggestions:
* [MVP suggestion item 1]
* [MVP suggestion item 2]

Monetization Ideas:
* [Monetization item 1]
* [Monetization item 2]

Keep the response concise, realistic, and highly actionable. Do not add any preamble, intro, or outro text."""

    data = {
        "model": "llama3-8b-8192",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7
    }

    # Execute the blocking HTTP request inside a separate thread to keep it async-safe
    def call_api():
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        # Use urlopen with timeout to avoid hanging requests
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]

    try:
        content = await asyncio.to_thread(call_api)
        return content
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            parsed_error = json.loads(error_body)
            error_message = parsed_error.get("error", {}).get("message", error_body)
        except Exception:
            error_message = error_body
        raise RuntimeError(f"Groq API error (HTTP {e.code}): {error_message}")
    except Exception as e:
        raise RuntimeError(f"Failed to generate review from Groq: {e}")
