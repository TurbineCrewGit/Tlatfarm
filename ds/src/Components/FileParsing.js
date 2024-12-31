import * as XLSX from 'xlsx';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      const headers = lines[0].split('\t').map(header => header.trim());

      const jsonData = lines.slice(1).map(line => {
        const values = line.split('\t').map(value => value.trim());
        const row = {};
        headers.forEach((header, i) => {
          row[header] = values[i];
        });
        return row;
      });

      resolve(jsonData);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parseXLSX = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
