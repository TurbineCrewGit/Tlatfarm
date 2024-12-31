export const checkDuplicateIds = (newData, tableData) => {
    const existingIds = new Set(tableData.map((item) => item.id));
    const duplicates = newData.filter((item) => existingIds.has(item.id));
    const uniqueData = newData.filter((item) => !existingIds.has(item.id));
  
    return { duplicates, uniqueData };
  };
  