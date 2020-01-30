export class UserBulkAdd {
    CompanyId: number;
    WorksheetName: string;

  constructor(companyId: number, worksheetName: string) {
    this.CompanyId = companyId;
    this.WorksheetName = worksheetName;
  }
}
