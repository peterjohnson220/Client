export interface ExportData {
  JsonAnswer: string;
  JsonReport: string;
}

export function generateMockExportData(): ExportData {
  return {
    JsonAnswer: '',
    JsonReport: ''
  };
}
