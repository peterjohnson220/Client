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
}

export function generateMockTemplateListItem(): TemplateListItem {
  return {
    TemplateId: 1,
    TemplateName: 'Test Template Name',
    CreatedBy: 'Test Created By',
    CreatedDate: new Date('01/01/2000'),
    LastModifiedBy: 'Test Last Modified By',
    LastModifiedDate: new Date('01/01/2000'),
    EffectiveDate: new Date('01/01/2000'),
    AssignedJobsCount: 1,
    Status: 'Test Status'
  };
}
