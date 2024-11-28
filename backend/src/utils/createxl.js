import fs from 'fs';
import XLSX from 'xlsx';

function convertJsonToExcel() {
    const inputFile = 'daily_trades.json';
    const outputFile = 'daily_trades.xlsx';

    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
        if (!Array.isArray(jsonData)) {
            throw new Error('Invalid JSON data: Expected an array.');
        }
        const headers = [
            'id',
            'name',
            'market',
            'open',
            'high',
            'low',
            'last',
            'settle',
            'change',
            'estVolume',
            'timestamp'
        ];
        const formattedData = jsonData.map(entry => ({
            id: entry.id || '',
            name: entry.name || '',
            market: entry.market || '',
            open: entry.open || '',
            high: entry.high || '',
            low: entry.low || '',
            last: entry.last || '',
            settle: entry.settle || '',
            change: entry.change || '',
            estVolume: entry.estVolume || '',
            timestamp: entry.timestamp || ''
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Trades');
        XLSX.writeFile(workbook, outputFile);

        console.log(`Excel file has been created successfully: ${outputFile}`);
    } catch (error) {
        console.error('Error converting JSON to Excel:', error.message);
    }
}

// Run the function
convertJsonToExcel();
