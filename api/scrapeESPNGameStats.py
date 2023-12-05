from flask import Flask, jsonify
import logging
from bs4 import BeautifulSoup
import json
import os

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/scrapeESPNGameStats', methods=['GET'])
def scrape_player_stats():
    try:
        # Path to the HTML file - adjust as needed
        file_path = '/path/to/your/html/file.html'
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"HTML file not found at {file_path}")

        # Read and parse the HTML file
        with open(file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
        soup = BeautifulSoup(html_content, 'html.parser')

        # Find the player stats table and extract data
        table = soup.find('table')
        data = []
        headers = [header.get_text().strip() for header in table.find_all('th')]
        for row in table.find_all('tr')[1:]:
            cells = row.find_all('td')
            row_data = {headers[i]: cells[i].get_text().strip() for i in range(len(cells))}
            data.append(row_data)

        # Return the data as JSON
        return jsonify(data)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
