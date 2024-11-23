from flask import Flask, jsonify
import pickle
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the pre-trained model from pickle file
with open("./linear_regression_model.pkl", "rb") as f:
    model = pickle.load(f)

# Database configuration
DATABASE_URL ="postgresql://postgres.xmqpgvqvegpfpfcweivo:Ashutosh%402004%23@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

def fetch_trade_data():
    """Fetch trade data from PostgreSQL database."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT name as stock_name,open FROM public."Trades"
            ORDER BY id ASC;
        """
        cursor.execute(query)
        
        rows = cursor.fetchall()
        print(rows)
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

@app.route("/predict", methods=["GET"])
def predict():
    try:
        # Fetch data from PostgreSQL
        data = fetch_trade_data()
        if not data:
            return jsonify({"success": False, "message": "Failed to fetch data"}), 500

        # Prepare data for prediction
        df = pd.DataFrame(data)
        open_values = df["open"].tolist()
        stock_names = df["stock_name"].tolist()

        # Predict the 'last' values (predicted closing prices) based on the 'open' values
        predictions = model.predict(df[["open"]])

        # Calculate the profit for each stock (profit = predicted_last - open)
        profits = [pred - open_val for pred, open_val in zip(predictions, open_values)]

        # Prepare the response with stock name, open price, predicted last, and profit
        result = [
            {
                "stock_name": stock_name,
                "open": open,
                "predicted_last": round(pred, 2),
                "profit": round(profit, 2),
            }
            for stock_name, open, pred, profit in zip(
                stock_names, open_values, predictions, profits
            )
        ]

        return jsonify({"success": True, "predictions": result})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
