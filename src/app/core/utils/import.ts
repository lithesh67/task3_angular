import * as XLSX from 'xlsx';

export function importFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
   
    reader.onload = (e) => {
      if (e.target) {
        try {
          const data = e.target.result as ArrayBuffer;
          const workbook = XLSX.read(data, { type: 'buffer' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const tableData = XLSX.utils.sheet_to_json(worksheet);
          resolve(tableData); 
        } catch (error) {
          reject(error); 
        }
      } 
    else {
        reject(new Error('FileReader target is null'));
      }
    };
    reader.onerror = (error) => {
        reject(error);
       }
    reader.readAsArrayBuffer(file); 
  });
}
