export interface UpdateCompanyStructureRangeGroupNameDto {
  CompanyStructuresRangeGroupId: number;
  RangeGroupName: string;
}

export function generateMockUpdateCompanyStructureRangeGroupNameDto(): UpdateCompanyStructureRangeGroupNameDto {
  return {
    CompanyStructuresRangeGroupId: 1,
    RangeGroupName: 'TestRangeGroupName',
  };
}
