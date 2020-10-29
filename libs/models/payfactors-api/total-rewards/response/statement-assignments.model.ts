export interface GetAssignedEmployeesResponse {
  TotalCount: number;
  Data: TotalRewardAssignedEmployee[];
}

export interface TotalRewardAssignedEmployee {
  CompanyEmployeeId: number;
  EmployeeId: string;
  FirstName: string;
  LastName: string;
  JobTitle: string;
  JobCode: string;
  JobFamily: string;
  FLSAStatus: string;
  TotalRewardsLastStatementGeneratedDate?: Date;
  TotalRewardsDeliveryMethod: string;
  TotalRewardsDeliveryStatus: string;
  EmailAddress: string;
}
