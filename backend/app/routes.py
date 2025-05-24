import requests
import os
from flask import Blueprint, jsonify, request

FLOCKX_API_KEY = os.getenv("flockx_api_key")


main = Blueprint("main", __name__)

@main.route('/agent-prompt', methods=['POST'])
def agent_page():
    if request.method == 'POST':
        data = request.get_json()
        message = data.get('message')

        try:
            r = requests.post(
                "https://api.flockx.io/api/v1/agents/4b1fbb8e-ed44-4a88-9f63-b54107847a3c/prompt",
                headers={
                    "Authorization": f'Token {FLOCKX_API_KEY}'
                },
                json={
                    'prompt': message,
                }
            )

            # Raise an error for non-200 responses
            r.raise_for_status()

            # Try to parse the response as JSON
            json_data = r.json()
            response = json_data.get("message", "No message returned.")
            return jsonify({"message": response}), 200

        except requests.exceptions.HTTPError as e:
            return jsonify({"error": f"HTTP Error: {str(e)}", "details": r.text}), 500
        except requests.exceptions.RequestException as e:
            return jsonify({"error": f"Network Error: {str(e)}"}), 500
        except ValueError:
            return jsonify({"error": "Response is not valid JSON", "raw": r.text}), 500