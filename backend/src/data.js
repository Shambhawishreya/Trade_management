import axios from "axios";
import xlsx from "xlsx";
import fs from "fs";

const fetchDataAndStoreExcel = async () => {
  try {
    // Step 1: Fetch data using Axios
    const response = await axios.get("http://localhost:8000/api/trades/get-trades"); // Replace with your API URL
    const data = response.data.data; // Access the `data` array from the response

    // Step 2: Format data for Excel
    const formattedData = data.map((item) => ({
      Name: item.name,
      Ticker: item.ticker,
      Low: item.low,
      High: item.high,
      Open: item.open,
      Last: item.last,
      Settle: item.settle,
      Change: item.change,
      EstimatedVolume: item.estVolume,
      Market: item.market,
      Timestamp: item.timestamp,
    }));

    // Step 3: Create a worksheet and workbook
    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data");

    // Step 4: Write to Excel file
    const filePath = "output.xlsx";
    xlsx.writeFile(workbook, filePath);
    console.log(`Data has been written to ${filePath}`);
  } catch (error) {
    console.error("Error fetching data or writing Excel file:", error.message);
  }
};

// Run the function
fetchDataAndStoreExcel();
