export interface TemplateListItem {
  TemplateId: number;
  TemplateName: string;
  CreatedBy: string;
  CreatedDate: Date;
  LastModifiedBy: string;
  LastModifiedDate: Date;
  EffectiveDate: Date;
  AssignedJobsCount: number;
  Status: string;
  Version: number;
}

export function generateMockTemplateListItem(mockNumber: number = 1):
TemplateListItem {
  return {
    TemplateId: mockNumber,
    TemplateName: `Test Template Name ${mockNumber}`,
    CreatedBy: 'Tester',
    CreatedDate: new Date(),
    LastModifiedBy: 'tester',
    LastModifiedDate: new Date(),
    EffectiveDate: new Date(),
    AssignedJobsCount: mockNumber * 5,
    Status: 'State',
    Version: mockNumber
  };
}
