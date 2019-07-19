export interface StandardReportDetails {
  Id: string;
  Name: string;
  DisplayName: string;
  ThumbnailUrl: string;
  Summary: string;
  CreateDate: Date;
  EditDate: Date;
  LastEditedBy: string;
}

export function generateMockStandardReportDetails(): StandardReportDetails {
  return {
    Id: 'workbookId',
    DisplayName: 'Display 1',
    Name: 'Some name',
    LastEditedBy: 'A person',
    Summary: 'Some summary text',
    EditDate: new Date(),
    CreateDate: new Date(),
    ThumbnailUrl: '/path/image.png'
  };
}
