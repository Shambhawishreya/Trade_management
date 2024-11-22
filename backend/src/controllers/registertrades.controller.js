import prisma from "../config/connectDB.js"; // Ensure you use the correct import

export async function registerTradeController(req, res) {
  try {
    const {
      name,
      ticker,
      market,
      open,
      high,
      low,
      last,
      settle,
      change,
      estVolume,
      timestamp,
    } = req.body;

    // Validate the required fields
    if (
      !name ||
      !ticker ||
      !market ||
      !open ||
      !high ||
      !low ||
      !last ||
      !settle ||
      !change ||
      !estVolume
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        error: true,
        success: false,
      });
    }

    // Parse timestamp or use the current time if not provided
    const tradeTimestamp = timestamp ? new Date(timestamp) : new Date();

    // Add the new trade to the database
    const newTrade = await prisma.trades.create({
      data: {
        name,
        ticker,
        market,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        last: parseFloat(last),
        settle: parseFloat(settle),
        change: parseFloat(change),
        estVolume: parseInt(estVolume, 10),
        timestamp: tradeTimestamp,
      },
    });

    // Respond with success
    return res.status(201).json({
      message: "Trade registered successfully.",
      data: newTrade,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: error.message || "Something went wrong.",
      error: true,
      success: false,
    });
  }
}
