export const TEMP_PEER_DATA_CUT_PREFIX = 'TEMP_PEER_';
export interface DataCutValidationInfo {
  DataCutGuid: string;
  CompanyIds: number[];
  CompanyCount: number;
}

export function generateMockDataCutValidationInfo(): DataCutValidationInfo {
  return {
    DataCutGuid: 'MockDataCutGuid',
    CompanyIds: [1, 2, 3, 4, 5],
    CompanyCount: 5
  };
}
