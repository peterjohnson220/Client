export interface ExportData {
  JsonRequest: string;
  JsonResponse: string;
}

export function generateMockExportData(): ExportData {
  return {
    JsonRequest: '',
    JsonResponse: ''
  };
}
