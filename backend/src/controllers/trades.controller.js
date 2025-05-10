import prisma from "../config/connectDB.js";

export async function getTradesController(req, res) {
  try {
    const trades = await prisma.trades.findMany();
    res.status(200).json({
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching trades",
      error: true,
      success: false,
    });
  }
}
