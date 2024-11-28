from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import pandas as pd
import pickle
import random
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database connection for cloud database
CLOUD_DATABASE_URL = "postgresql://postgres.xmqpgvqvegpfpfcweivo:Ashutosh%402004%23@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

def get_cloud_db_connection():
    return psycopg2.connect(CLOUD_DATABASE_URL)

# Database connection (Feature 2)
# def get_local_db_connection():
#     return psycopg2.connect(
#         dbname="cme_trades",
#         user="postgres",
#         password="lolo45",
#         host="localhost"
#     )

# Load pre-trained model for Feature 1
with open("./linear_regression_model.pkl", "rb") as f:
    model = pickle.load(f)

# Validate and format timestamps
def validate_and_format_timestamp(timestamp_str):
    try:
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        return timestamp.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise ValueError("Invalid timestamp format")

# Fetch trade data from cloud database
def fetch_trade_data(market_name, start_timestamp, end_timestamp):
    try:
        conn = get_cloud_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT name as stock_name, open, timestamp
            FROM public."Trades"
            WHERE name = %s AND timestamp >= %s AND timestamp <= %s
            ORDER BY timestamp ASC;
        """
        cursor.execute(query, (market_name, start_timestamp, end_timestamp))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

# Feature 1: Get available stock names
@app.route("/stocks", methods=["GET"])
def get_stocks():
    try:
        conn = get_cloud_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT DISTINCT name as stock_name FROM public."Trades";')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        stock_names = [row[0] for row in rows]
        return jsonify({"stocks": stock_names})
    except Exception as e:
        print(f"Error fetching stock names: {e}")
        return jsonify({"error": "Failed to fetch stock names"}), 500

# Feature 1: Predict endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        request_data = request.json
        market_name = request_data.get("market_name")
        start_timestamp = request_data.get("start_timestamp")
        end_timestamp = request_data.get("end_timestamp")

        if not market_name or not start_timestamp or not end_timestamp:
            return jsonify({"success": False, "message": "Invalid input"}), 400

        start_timestamp = validate_and_format_timestamp(start_timestamp)
        end_timestamp = validate_and_format_timestamp(end_timestamp)

        data = fetch_trade_data(market_name, start_timestamp, end_timestamp)
        if not data:
            return jsonify({"success": False, "message": "No data found"}), 404

        df = pd.DataFrame(data)
        open_values = df["open"].tolist()
        timestamps = df["timestamp"].tolist()

        predictions = model.predict(df[["open"]])

        result = [
            {
                "timestamp": ts,
                "open": round(open_val, 2),
                "predicted_last": round(pred, 2),
            }
            for ts, open_val, pred in zip(timestamps, open_values, predictions)
        ]

        return jsonify({"success": True, "predictions": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Feature 2: Get trades with risk scores
@app.route('/api/risk', methods=['GET'])
def get_trades_with_risk():
    try:
        threshold = float(request.args.get('threshold', 0.5))
        conn = get_local_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, name, market FROM trades")
        trades = cursor.fetchall()

        result = []
        for trade in trades:
            risk_score = round(random.uniform(0, 1), 2)
            status = "Risky" if risk_score > threshold else "Safe"
            result.append({
                "id": trade[0],
                "name": trade[1],
                "market": trade[2],
                "risk_score": risk_score,
                "status": status
            })

        conn.close()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Feature 2: Get distinct market names
@app.route('/api/markets', methods=['GET'])
def get_markets():
    try:
        conn = get_local_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT DISTINCT market FROM trades")
        markets = cursor.fetchall()

        conn.close()
        return jsonify([market[0] for market in markets]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
