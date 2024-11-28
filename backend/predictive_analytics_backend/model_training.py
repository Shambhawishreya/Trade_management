# model_training.py
import pandas as pd
import psycopg2
from sklearn.linear_model import LinearRegression
import pickle

# Database configuration
DATABASE_URL = "postgresql://postgres.xmqpgvqvegpfpfcweivo:Ashutosh%402004%23@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

def fetch_data():
    """Fetch historical trade data from the database."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        query = """
            SELECT timestamp, open, last
            FROM public."Trades"
            WHERE open IS NOT NULL AND last IS NOT NULL
            ORDER BY timestamp ASC;
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def train_model():
    """Train a linear regression model and save it."""
    data = fetch_data()
    if data is None or data.empty:
        print("No data available for training.")
        return

    # Prepare the data
    data["timestamp"] = pd.to_datetime(data["timestamp"]).map(pd.Timestamp.timestamp)
    X = data[["timestamp", "open"]]
    y = data["last"]

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Save the model
    with open("linear_regression_model.pkl", "wb") as f:
        pickle.dump(model, f)
    print("Model trained and saved successfully.")

if __name__ == "__main__":
    train_model()