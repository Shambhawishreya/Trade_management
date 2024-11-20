import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
const prisma = new PrismaClient();
async function main() {
  try {
    const data = await fs.readFile("./Data/trades.json", "utf-8");
    const trades = JSON.parse(data);
    const formattedTrades = trades.map((trade) => ({
      name: trade.name,
      ticker: trade.ticker,
      market: trade.market,
      open: parseFloat(trade.open),
      high: parseFloat(trade.high),
      low: parseFloat(trade.low),
      last: parseFloat(trade.last),
      settle: parseFloat(trade.settle),
      change: parseFloat(trade.change),
      estVolume: parseInt(trade.estVolume, 10),
      timestamp: new Date(trade.timestamp),
    }));
    await prisma.trades.createMany({ data: formattedTrades });
    console.log(`${formattedTrades.length} trades have been added to the database.`);
  } catch (error) {
    console.error("Error adding trades:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
