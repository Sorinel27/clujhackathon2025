import requests
import os
from flask import Flask, request, jsonify, render_template

FLOCKX_API_KEY = os.getenv("flockx_api_key")
SMARTSHELF_AI_ID = "4b1fbb8e-ed44-4a88-9f63-b54107847a3c"

app = Flask(__name__)


@app.route('/agent', methods=['GET', 'POST'])
def agent_page():
    if request.method == 'POST':
        response = requests.get(
            "https://api.flockx.io/api/v1/agents/4b1fbb8e-ed44-4a88-9f63-b54107847a3c/prompt",
            headers={
                "Authorization": f'Token {FLOCKX_API_KEY}'
            },
            json={
                'prompt': request.form.get('prompt'),
            }
        )

        print(response)
        return render_template('index.html', response=f'{response.text}')
    else:
        return render_template('index.html', response='')


if __name__ == '__main__':
    app.run(debug=True)
