export interface Statement {
  Id: number;
  Name: string;
  CreatedBy: string;
  CreatedDate: Date;
  LastRunBy: string;
  LastRunDate: Date;
  Employees: number;
  Status: 'Active' | 'Draft';
}

export function generateMockStatement(): Statement {
  return {
    Id: 1,
    Name: 'Name',
    CreatedBy: 'CreatedBy',
    CreatedDate: new Date('December 17, 2019 03:24:00'),
    LastRunBy: 'LastRunBy',
    LastRunDate: new Date('December 17, 2019 03:24:00'),
    Employees: 13,
    Status: 'Active'
  };
}
