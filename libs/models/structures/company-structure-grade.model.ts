export interface CompanyStructureGrade {
  CompanyId: number;
  CompanyStructuresGradesId: number;
  CompanyStructuresId: number;
  GradeCode: string;
  GradeName: string;
  StructureCode: string;
  IsDefault: boolean;
}

export function generateMockCompanyStructureGrade(): CompanyStructureGrade {
  return {
    CompanyId: 13,
    CompanyStructuresGradesId: 1,
    CompanyStructuresId: 1,
    GradeCode: 'TestGradeCode',
    GradeName: 'TestGradeName',
    StructureCode: 'TestStructureCode',
    IsDefault: false
  };
}
