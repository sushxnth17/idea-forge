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


async def generate_remix_suggestions(title: str, description: str) -> list[dict[str, str]]:
    """
    Generates exactly 5 structured remix suggestions for a startup idea using the Groq API.
    Each suggestion contains a title and an implementation-oriented description.
    Raises ValueError if GROQ_API_KEY is missing/unconfigured.
    Raises RuntimeError if the API call fails or the response structure/count is invalid.
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

    prompt = f"""You are an expert startup advisor, system architect, and product manager.
Generate exactly 5 distinct, realistic, and implementation-oriented remix suggestions for the following startup idea:
Title: {title}
Description: {description}

Each suggestion must represent a unique twist, pivot, or technical adaptation of the original idea (e.g., targeting a specific niche, applying a different business model, integrating a novel technology, or narrowing/expanding the feature scope).
Make the suggestions realistic (technically feasible and commercially viable), distinct from one another, and highly implementation-oriented (provide specific concrete features, technical components, stack/API integrations, or architectural approaches that explain HOW it would be built).

Return the suggestions as a JSON object containing a "suggestions" list of objects, structured exactly like this:
{{
  "suggestions": [
    {{
      "title": "Remix Title 1",
      "description": "Remix Description 1"
    }},
    ...
  ]
}}

Ensure you return ONLY the JSON object. Do not include any preamble, intro, or outro text."""

    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"},
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
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]

    try:
        content = await asyncio.to_thread(call_api)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            parsed_error = json.loads(error_body)
            error_message = parsed_error.get("error", {}).get("message", error_body)
        except Exception:
            error_message = error_body
        raise RuntimeError(f"Groq API error (HTTP {e.code}): {error_message}")
    except Exception as e:
        raise RuntimeError(f"Failed to generate suggestions from Groq: {e}")

    # Parse and validate the response
    try:
        cleaned_content = content.strip()
        # Handle cases where markdown code block markers are returned even with json_object format
        if cleaned_content.startswith("```json"):
            cleaned_content = cleaned_content[7:]
        elif cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]
        cleaned_content = cleaned_content.strip()

        parsed_data = json.loads(cleaned_content)
        if not isinstance(parsed_data, dict) or "suggestions" not in parsed_data:
            raise RuntimeError("API response does not contain a 'suggestions' object key")
        
        suggestions = parsed_data["suggestions"]
        if not isinstance(suggestions, list):
            raise RuntimeError("'suggestions' key in response is not a list")

        if len(suggestions) != 5:
            raise RuntimeError(f"API generated {len(suggestions)} suggestions, expected exactly 5")

        validated_suggestions = []
        for idx, item in enumerate(suggestions):
            if not isinstance(item, dict) or "title" not in item or "description" not in item:
                raise RuntimeError(f"Suggestion at index {idx} has invalid structure (missing title/description)")
            
            title_val = item["title"]
            desc_val = item["description"]
            if not isinstance(title_val, str) or not isinstance(desc_val, str):
                raise RuntimeError(f"Suggestion at index {idx} has non-string values for title/description")
            
            validated_suggestions.append({
                "title": title_val.strip(),
                "description": desc_val.strip()
            })

        return validated_suggestions

    except Exception as parse_err:
        raise RuntimeError(f"Failed to parse structured remix suggestions: {parse_err}")

