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
        monetary_columns = ['Salary']
        for col in monetary_columns:
            df[col] = df[col].replace({'\$-': '0', '\$': '', ',': ''}, regex=True).astype(float)

        # Define weights
        df['Source Weight'] = df['Source'].apply(lambda x: 1 if 'Personal Experience' in x else 0.8)
        df['Region Weight'] = df['Region'].apply(lambda x: 1 if 'San Diego' in x else 0.8)
        df['Experience Weight'] = df['Experience at Time'].apply(lambda x: 1 if x == -1 else 1)

        # Increased skill level factor (example: 10% increase)
        skill_increase_factor = 1.06

        # Apply weights and calculate weighted score
        df['Weighted Score'] = df.apply(lambda row: row['Salary'] * row['Source Weight'] * row['Region Weight'] * skill_increase_factor if row['Experience at Time'] == -1 else row['Salary'] * row['Source Weight'] * row['Region Weight'] * row['Experience Weight'] * skill_increase_factor, axis=1)


        # Calculate the weighted average salary
        weighted_avg_salary = df['Weighted Score'].mean()
        formatted_salary = "${:,.2f}".format(weighted_avg_salary)

        logger.info('Calculations completed')
        return jsonify({"Weighted Average Salary": formatted_salary})
    except Exception as e:
        logger.error('Error occurred during calculation: %s', e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()