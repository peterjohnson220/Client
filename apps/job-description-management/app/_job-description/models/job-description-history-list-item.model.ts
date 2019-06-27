export interface JobDescriptionHistoryListItem {
  VersionNumber: number;
  CreatedDate: Date;
  CreatedBy: string;
  Status: string;
  HasWorkflow: boolean;
}

export function generateMockJobDescriptionHistoryListItem(mockVersionNumber: number = 1): JobDescriptionHistoryListItem {
  return {
    VersionNumber: 1,
    CreatedDate: new Date('01/01/2000'),
    CreatedBy: 'Test Created By',
    Status: 'Test Status',
    HasWorkflow: false
  };
}
