import fs from 'fs';
import axios from 'axios';

async function fetchAndSaveDailyTrades() {
    try {
        const response = await axios.get('http://localhost:8000/api/trades/get-trades');
        
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            const dailyTrades = response.data.data;

            // Saving the data to a JSON file
            const filePath = 'daily_trades.json';
            fs.writeFileSync(filePath, JSON.stringify(dailyTrades, null, 2), 'utf-8');

            console.log(`Data has been saved successfully to ${filePath}`);
        } else {
            console.error('Unexpected response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching or saving data:', error.message);
    }
}
fetchAndSaveDailyTrades();
