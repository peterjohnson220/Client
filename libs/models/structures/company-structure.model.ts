import { CompanyStructureGrade, generateMockCompanyStructureGrade } from './company-structure-grade.model';
// import { StructureRangeGroupResponse, generateMockCompanyStructureRangeGroup } from './company-structure-range-group.model';

export interface CompanyStructure {
  CompanyStructuresId: number;
  CompanyId: number;
  StructureCode: string;
  StructureName: string;
  CompanyStructureGrades?: CompanyStructureGrade[];
  CompanyStructureRangeGroups?: any[];
}

export function generateMockCompanyStructure(): CompanyStructure {
  return {
    CompanyStructuresId: 1,
    CompanyId: 13,
    StructureCode: 'TestStructureCode',
    StructureName: 'TestStructureName',
    CompanyStructureGrades: [generateMockCompanyStructureGrade()],
    CompanyStructureRangeGroups: []
  };
}
