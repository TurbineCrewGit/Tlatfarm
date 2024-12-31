import * as XLSX from 'xlsx';

// CSV 파일 파싱
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map((line) => line.trim()).filter((line) => line);
      const headers = lines[0].split('\t').map((header) => header.trim());

      const jsonData = lines.slice(1).map((line) => {
        const values = line.split('\t').map((value) => value.trim());
        const row = {};
        headers.forEach((header, i) => {
          if (header.toLowerCase() === 'id') row.id = values[i];
          if (header.toLowerCase() === '전력 생산량') row.powerProduction = values[i];
          if (header.toLowerCase() === '위도') row.latitude = values[i];
          if (header.toLowerCase() === '경도') row.longitude = values[i];
        });
        return row;
      });

      resolve(jsonData);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Excel 파일 파싱
export const parseXLSX = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet).map((row) => ({
          id: row.id || row.ID,
          powerProduction: row['전력 생산량'],
          latitude: row['위도'],
          longitude: row['경도'],
        }));

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
