import os
import json
import urllib.request
import urllib.error
import asyncio
from dotenv import load_dotenv

# Ensure environment variables are loaded from the backend/.env file relative to this file
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(dotenv_path=dotenv_path)


async def generate_idea_review(title: str, description: str) -> str:
    """
    Generates a structured AI review for the startup idea using the Groq API.
    Raises ValueError if GROQ_API_KEY is missing or unconfigured.
    """
    # Load environment variables dynamically to pick up any changes
    dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    load_dotenv(dotenv_path=dotenv_path)
    
    groq_api_key = os.getenv("GROQ_API_KEY")

    # Verify that the API key is present and is not the default placeholder
    if not groq_api_key or groq_api_key.strip() == "" or groq_api_key == "your_groq_api_key_here":
        raise ValueError(
            "GROQ_API_KEY is missing or un configured. "
            "Please configure a valid GROQ_API_KEY in your environment/dotenv file."
        )

    # Groq OpenAI-compatible chat completion URL
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
        "model": "llama-3.1-8b-instant",
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
