
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
//import "./Analytics.css"; // Ensure this file exists and includes Analyticsropriate styling

const Analytics = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // Make a POST request to the Flask API
        const response = await axios.get("http://127.0.0.1:5000/predict");
        if (response.data.success) {
          setPredictions(response.data.predictions);
        } else {
          throw new Error("Failed to fetch predictions");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Trade Predictions Dashboard</h1>

      {loading ? (
        <p className="loading">Loading predictions...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <>
          {/* Table Section 
          <div className="table-container">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Open Price</th>
                  <th>Predicted Closing Price</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, index) => (
                  <tr key={index}>
                    <td>{prediction.stock_name}</td>
                    <td>${prediction.open.toFixed(2)}</td>
                    <td>${prediction.predicted_last.toFixed(2)}</td>
                    <td style={{ color: prediction.profit > 0 ? "green" : "red" }}>
                      ${prediction.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
*/}
          {/* Chart Section */}
          <h2 className="chart-title">Trade Prices Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stock_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#8884d8" name="Open Price" />
              <Line type="monotone" dataKey="predicted_last" stroke="#82ca9d" name="Predicted Closing Price" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default Analytics;
