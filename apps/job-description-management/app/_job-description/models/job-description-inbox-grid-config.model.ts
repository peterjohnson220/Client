export interface InboxGridField {
    FieldName: string;
    DisplayName: string;
    DataType: string;
    Width?: number;
    CustomClass?: string;
  }

  export const inboxGridFields: InboxGridField[] = [
    {
      FieldName: 'JobCode',
      DisplayName: 'Job Code',
      DataType: 'string',
      Width: 140,
    },
    {
      FieldName: 'JobTitle',
      DisplayName: 'Job Title',
      DataType: 'string',
      Width: 220,
    },
    {
      FieldName: 'CreatedBy',
      DisplayName: 'Created By',
      DataType: 'string',
      Width: 160,
    },
    {
      FieldName: 'CreateDate',
      DisplayName: 'Created On',
      DataType: 'date',
      Width: 120,
    },
    {
      FieldName: 'LastUpdatedDate',
      DisplayName: 'Last Updated',
      DataType: 'date',
      Width: 120,
    },
    {
      FieldName: 'VersionNumber',
      DisplayName: 'Version',
      DataType: 'int',
      Width: 70,
      CustomClass: 'version'
    },
    {
      FieldName: 'CurrentReviewer',
      DisplayName: 'Current Reviewer',
      DataType: 'string',
      Width: 200,
    }
  ];
