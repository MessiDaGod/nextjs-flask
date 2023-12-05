from flask import Flask, request, jsonify
import pandas as pd
from io import StringIO
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.debug = True
# Set up logging
logging.basicConfig(level=logging.DEBUG)
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
logger = logging.getLogger('tdm')
logger.setLevel(logging.INFO)
logger.addHandler(handler)

@app.route('/api/calculate', methods=['POST'])
def calculate():
    logger.info('Received request for /calculate')

    try:
        csv_data = request.data.decode('utf-8')
        data = StringIO(csv_data)
        df = pd.read_csv(data)
        logger.info('CSV data loaded successfully')

        # Normalize monetary columns by replacing $- with 0 and converting to float
        monetary_columns = ['Higher End']
        for col in monetary_columns:
            df[col] = df[col].replace({'\$-': '0', '\$': '', ',': ''}, regex=True).astype(float)

        # Define your weights
        weights = {
            'Source': 1 if df['Source'].str.contains('Personal Experience').any() else 0.8,
            'Experience at Time': 1,
            'Region': 1 if df['Region'].str.contains('San Diego').any() else 0.8,
        }

        # Apply weights and calculate weighted score
        df['Weighted Score'] = df['Higher End'] * weights['Source']
        df['Weighted Score'] = df['Higher End'] * weights['Experience at Time']
        df['Weighted Score'] = df['Higher End'] * weights['Region']

        # Calculate the weighted average salary
        weighted_avg_salary = df['Weighted Score'].mean()
        formatted_salary = "${:,.2f}".format(weighted_avg_salary)

        logger.info('Calculations completed')
        return jsonify({"Raw Data": df['Higher End'], "Weighted Average Salary": formatted_salary})
    except Exception as e:
        logger.error('Error occurred during calculation: %s', e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()