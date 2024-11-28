import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import './styles.css';

const Analytics = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [marketName, setMarketName] = useState("");
  const [stocks, setStocks] = useState(["Cincinnati HDD Monthly Futures","BTIC on Micro Bitcoin Futures London Close","Oats Futures","Denver Real Estate Futures"]); // For dropdown options
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch available stock names for dropdown
  useEffect(() => {
    const fetchStockNames = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/stocks");
        setStocks(response.data.stocks || []); // Assuming API returns { stocks: [...] }
      } catch (err) {
        console.error("Failed to fetch stock names", err);
        setError("Failed to fetch stock names");
      }
    };

    fetchStockNames();
  }, []);

  const fetchPredictions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:3000/predict", {
        market_name: marketName,
        start_timestamp: startTime,
        end_timestamp: endTime,
      });

      if (response.data.success) {
        setPredictions(response.data.predictions);
      } else {
        throw new Error(response.data.message || "Failed to fetch predictions");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching predictions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><div className="page-title"><h1 className="title">Trade Prediction Dashboard</h1>

    <div className="container">

      {/* Form Section */}
      <form onSubmit={fetchPredictions} className="form">
        <div className="form-group">
          <label htmlFor="marketName">Trade Name:</label>
          <select
            id="marketName"
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
            required
          >
            <option value="">Select a Stock</option>
            {stocks.map((stock) => (
              <option key={stock} value={stock}>
                {stock}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Timestamp:</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Timestamp:</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Fetch Predictions
        </button>
      </form>

      {/* Results Section */}
      {loading ? (
        <p className="loading">Loading predictions...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : predictions.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={predictions}
              margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip 
              contentStyle={{ backgroundColor: "#fff", color: "#454545", fontSize: "1rem" }} 
              labelStyle={{ color: "#454545" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="open"
                stroke="#8884d8"
                name="Open Price"
              />
              <Line
                type="monotone"
                dataKey="predicted_last"
                stroke="#82ca9d"
                name="Predicted Closing Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="msg">No data available. Please try again with different inputs.</p>
      )}
    </div>
    </div>
    </>
  );
};

export default Analytics;