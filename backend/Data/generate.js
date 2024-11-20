import fs from "fs";
import xlsx from "xlsx";
const filePath = "C:/Users/KIIT/OneDrive/Desktop/Trade_management/backend/Data/finaldata.xlsx";

async function main() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const tradeData = sheetData.map((row) => ({
      name: row["Product Name"], 
      ticker: row["Globex"],
      market: row["Asset Class"],
    }));
    let baseTimestamp = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
    const generateUniqueTimestamp = () => {
      baseTimestamp += Math.floor(Math.random() * 100000 + 1000);
      return new Date(baseTimestamp);
    };
    const generateRandomTrade = (trade) => {
      const open = (Math.random() * 1000 + 1000).toFixed(2);
      const high = (parseFloat(open) + Math.random() * 50).toFixed(2);
      const low = (parseFloat(open) - Math.random() * 50).toFixed(2);
      const last = (Math.random() * (high - low) + parseFloat(low)).toFixed(2);
      const settle = (Math.random() * 20 + parseFloat(last)).toFixed(2);
      const change = (Math.random() * 20 - 10).toFixed(2);
      const estVolume = Math.floor(Math.random() * 100000 + 50000);

      return {
        name: trade.name,
        ticker: trade.ticker,
        market: trade.market,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        last: parseFloat(last),
        settle: parseFloat(settle),
        change: parseFloat(change),
        estVolume,
        timestamp: generateUniqueTimestamp(),
      };
    };
    const dummyData = tradeData.slice(0, 100).map(generateRandomTrade);
    fs.writeFileSync("trades.json", JSON.stringify(dummyData, null, 2), "utf-8");
    console.log("Data has been written to trades.json");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
