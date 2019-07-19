export interface JobDescriptionValidationRequest {
  companyId: number;
  mappingFile: File;
  dataFile: File;
  importMode: string;
}

export function generateMockJobDescriptionValidationRequest(): JobDescriptionValidationRequest {
  return {
    companyId: 13,
    mappingFile: null,
    dataFile: null,
    importMode: 'INSERT'
  };
}
