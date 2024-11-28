import React, { useState } from "react";
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

const Comparison = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([{ id: 1, marketName: "" }]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comparisonData, setComparisonData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch available trade names for dropdown
  useState(() => {
    const fetchStockNames = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/stocks");
        setStocks(response.data.stocks || []);
      } catch (err) {
        console.error("Failed to fetch stock names", err);
        setError("Failed to fetch stock names");
      }
    };

    fetchStockNames();
  }, []);

  const handleAddStock = () => {
    setSelectedStocks([...selectedStocks, { id: selectedStocks.length + 1, marketName: "" }]);
  };

  const handleStockChange = (index, value) => {
    const updatedStocks = selectedStocks.map((stock, i) => (i === index ? { ...stock, marketName: value } : stock));
    setSelectedStocks(updatedStocks);
  };

  const fetchComparisonData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all(
        selectedStocks.map((stock) =>
          axios.post("http://127.0.0.1:3000/predict", {
            market_name: stock.marketName,
            start_timestamp: startTime,
            end_timestamp: endTime,
          })
        )
      );

      const data = responses.map((res, index) => ({
        stockName: selectedStocks[index].marketName,
        predictions: res.data.predictions || [],
      }));

      setComparisonData(data);
    } catch (err) {
      setError(err.message || "An error occurred while fetching comparison data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-title"> <h1 className="title">Trade Comparison Dashboard</h1>
    <div className="container">

      {/* Form Section */}
      <form onSubmit={fetchComparisonData} className="form">
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

        {selectedStocks.map((stock, index) => (
          <div key={stock.id} className="stock-group">
            <div className="form-group">
              <label htmlFor={`marketName-${index}`}>Stock Name:</label>
              <select
                id={`marketName-${index}`}
                value={stock.marketName}
                onChange={(e) => handleStockChange(index, e.target.value)}
                required
              >
                <option value="">Select a Stock</option>
                {stocks.map((stockOption) => (
                  <option key={stockOption} value={stockOption}>
                    {stockOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button type="button" className="add-button" onClick={handleAddStock}>
          + Add Stock
        </button>
        <button type="submit" className="submit-button">
          Compare Stocks
        </button>
      </form>

      {/* Results Section */}
      {loading ? (
        <p className="loading">Loading comparison data...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : comparisonData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip 
            contentStyle={{ backgroundColor: "#fff", color: "#454545", fontSize: "1rem" }}
            labelStyle={{ color: "#454545" }} />
            <Legend />
            {comparisonData.map((data) => (
              <Line
                key={data.stockName}
                type="monotone"
                dataKey="predicted_last"
                data={data.predictions}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                name={data.stockName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="msg">No comparison data available. Please try again with different inputs.</p>
      )}
    </div>
    </div>
  );
};

export default Comparison;
