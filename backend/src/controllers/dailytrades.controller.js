import prisma from "../config/connectDB.js";

export async function getDailyTrades(req, res) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    console.log("Ashu");
    const dailyTrades = await prisma.trades.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    if (dailyTrades.length === 0) {
      return res.status(404).json({
        message: "No trades found for today.",
        error: false,
        success: true,
        data: [],
      });
    }
    return res.status(200).json({
      message: "Daily trades fetched successfully.",
      error: false,
      success: true,
      data: dailyTrades,
    });
  } catch (error) {
    console.error("Error fetching daily trades:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}
