import psycopg2
import random
from datetime import datetime, timedelta

# Connect to the PostgreSQL database
def get_db_connection():
    return psycopg2.connect(
        dbname="cme_trades",
        user="postgres",  
        password="lolo45", 
        host="localhost"
    )

# Populate the trades table with random data
def populate_trades():
    conn = get_db_connection()
    cursor = conn.cursor()

    # CME Group markets and trade names
    markets = ['Energy', 'Metals', 'Agriculture', 'Equities', 'Interest Rates', 'Forex']
    trade_names = ['WTI Crude Oil', 'Gold', 'Corn', 'S&P 500', 'US Treasury Bonds', 'Euro']

    # Generate random data
    for _ in range(100):  # Generate 100 rows
        name = random.choice(trade_names)
        ticker = name[:3].upper() + str(random.randint(10, 99))
        open_price = round(random.uniform(50, 1500), 2)
        high_price = open_price + round(random.uniform(5, 50), 2)
        last_price = high_price - round(random.uniform(1, 10), 2)
        settle_price = last_price + round(random.uniform(-5, 5), 2)
        change = round(settle_price - open_price, 2)
        volume = random.randint(1000, 1000000)
        market = random.choice(markets)
        timestamp = datetime.now() - timedelta(days=random.randint(0, 30))

        # Insert into the table
        cursor.execute(
            """
            INSERT INTO trades (name, ticker, open, high, last, settle, change, volume, market, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (name, ticker, open_price, high_price, last_price, settle_price, change, volume, market, timestamp)
        )

    conn.commit()
    conn.close()
    print("Populated trades table with random data.")

if __name__ == "__main__":
    populate_trades()
