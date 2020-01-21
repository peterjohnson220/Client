export interface SubsidiaryInfo {
  SubsidiaryId: number;
  CompanyId: number;
  SubsidiaryName: string;
}

export function generateMockSubsidiaryInfo(): SubsidiaryInfo {
  return {
    SubsidiaryId: 1,
    CompanyId: 1,
    SubsidiaryName: 'Subsidiary'
  };
}
