from flask import Flask, request, jsonify
import pandas as pd
from io import StringIO
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
logger = logging.getLogger('tdm')
logger.setLevel(logging.INFO)
logger.addHandler(handler)

@app.route('/api/calculate', methods=['GET'])
def calculate():
    logger.info('Received request for /calculate')

    try:
        csv_data = request.data.decode('utf-8')
        data = StringIO(csv_data)
        df = pd.read_csv(data)
        logger.info('CSV data loaded successfully')

        # Define your weights
        weights = {
            'Source': 3 if df['Source'].str.contains('Personal Experience').any() else 1,
            'Experience at Time': 2,
            # other columns...
        }

        # Apply weights
        for column in df.columns:
            if column in weights:
                df[column] = df[column] * weights[column]

        # Assuming 'Higher End' is the column to be summed
        df['Weighted Score'] = df['Higher End']

        logger.info('Calculations completed')
        return jsonify(df.to_dict())
    except Exception as e:
        logger.error('Error occurred during calculation: %s', e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
