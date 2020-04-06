export interface CompanyStructureRange {
  CompanyStructuresRangesId: number;
  CompanyStructuresGradesId: number;
  CompanyStructuresId: number;
  CompanyId: number;
  CompanyStructuresRangeGroupId: number;
  CompanyPayMarketId: number;
  Min: number;
  Mid: number;
  Max: number;
  DispSeq: number;
  CompanyJobId: number;
  EditUser: number;
  RangeOverride: boolean;
}

export function generateMockCompanyStructureRange(): CompanyStructureRange {
  return {
    CompanyStructuresRangesId: 1,
    CompanyStructuresGradesId: 1,
    CompanyStructuresId: 1,
    CompanyId: 13,
    CompanyStructuresRangeGroupId: 1,
    CompanyPayMarketId: 1,
    Min: 0.5,
    Mid: 50.5,
    Max: 80.2,
    DispSeq: 1.0,
    CompanyJobId: 1,
    EditUser: -1,
    RangeOverride: false
  };
}
