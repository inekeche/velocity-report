// Example in server/utils/excelParser.js
const XLSX = require('xlsx');

const parseVelocityReport = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // Start parsing from row 12 (index 11)
  const data = XLSX.utils.sheet_to_json(sheet, { range: 11 });
  return data;
};