const XLSX = require('xlsx');

const analyzeVelocity = (data) => {
    let totalItems = 0;
    let totalSalesQty = 0;
    let totalStockQty = 0;
    let fastMoving = 0;
    let slowMoving = 0;
    let outOfStock = 0;
    let normalStock = 0;

    const analyzed = data.map(item => {
        // Extract fields based on your exact Excel column headers
        const description = item['Description'] || '';
        const totalSold = parseFloat(item['Total Sold (Qty.)']) || 0;
        const closingQty = parseFloat(item['Closing Qty.']) || 0;
        const avgMonthlySales = parseFloat(item['Average Monthly Sales (Last 24 Months)']) || 0;

        // Skip rows that don't have a valid item description
        if (!description || description.toString().startsWith('ITEM') || description.toString().startsWith('COSCHARIS')) {
            return null;
        }

        totalItems++;
        totalSalesQty += totalSold;
        totalStockQty += closingQty;

        // Categorization Logic based on Velocity & Stock
        let category = 'Normal';
        let forecast = 'Maintain Stock';

        if (closingQty === 0) {
            category = 'Out of Stock';
            forecast = 'URGENT REORDER';
            outOfStock++;
        } else if (totalSold > 10 || avgMonthlySales > 1) {
            category = 'Fast Moving';
            forecast = 'Increase Order Qty';
            fastMoving++;
        } else if (totalSold === 0) {
            category = 'Slow Moving / Non-Moving';
            forecast = 'Reduce / Consider Write-off';
            slowMoving++;
        } else {
            normalStock++;
        }

        return {
            description,
            startQty: item['Start Qty.'] || 0,
            totalSold,
            closingQty,
            avgMonthlySales,
            category,
            forecast
        };
    }).filter(item => item !== null); // Remove null/header rows

    return {
        analyzed,
        summary: {
            totalItems: analyzed.length,
            totalSalesQty,
            totalStockQty,
            fastMoving,
            slowMoving,
            outOfStock
        }
    };
};

exports.uploadAndAnalyze = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        
        // Read starting from row 13 (0-indexed header row in sheet)
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 13 });

        const { analyzed, summary } = analyzeVelocity(rawData);
        
        res.json({ summary, data: analyzed });
    } catch (err) {
        console.error("ANALYSIS ERROR:", err);
        res.status(500).json({ error: "Server Error during analysis: " + err.message });
    }
};