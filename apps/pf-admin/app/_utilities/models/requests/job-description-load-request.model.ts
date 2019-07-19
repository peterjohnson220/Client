export interface LoadJobDescriptionRequest {
  CompanyId: number;
  StoredMappingFile: string;
  StoredDataFile: string;
}

const EMPTY_STRING = '';

export function generateMockJobDescriptionLoadRequest(): LoadJobDescriptionRequest {
  return {
    CompanyId: 13,
    StoredMappingFile: EMPTY_STRING,
    StoredDataFile: EMPTY_STRING
  };
}
