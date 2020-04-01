export interface EmployeeRewardsData {
  Employee_Id: number;
  First_Name: string;
  Last_Name: string;
  City: string;
  Country: string;
  Job_Code: string;
  Department: string;
  DOB: Date;
  DOH: Date;
  Email_Address: string;
  Employee_Status: string;
  FLSA_Status: string;
  FTE: number;
  Location: string;
  Manager_Employee_ID: string;
  State: string;
  Base: number;
  Bonus: number;
  STI: number;
  LTI: number;
  Savings_401K_Match: number;
  Pension_Plan: number;
  Medical_Insurance: number;
  Dental_Insurance: number;
  Vision_Insurance: number;
  Life_Insurance: number;
  Short_Term_Disability: number;
  Long_Term_Disability: number;
  Tuition_Reimbursement: number;
  PTO: number;
  Other_Allowances: number;
}

export function generateMockEmployeeRewardsData(): EmployeeRewardsData {
  return {
    Employee_Id: 12345,
    First_Name: 'John',
    Last_Name: 'Smith',
    City: 'Scranton',
    Country: 'United States',
    Job_Code: 'ACC456',
    Department: 'Accounting',
    DOB: new Date('04/03/80'),
    DOH: new Date('08/12/19'),
    Email_Address: 'john.smith@company.com',
    Employee_Status: 'Full-Time',
    FLSA_Status: 'Exempt',
    FTE: 1,
    Location: 'Scranton',
    Manager_Employee_ID: 'ACC123',
    State: 'MA',
    Base: 150000,
    Bonus: 10000,
    STI: 5000,
    LTI: 10000,
    Savings_401K_Match: 1500,
    Pension_Plan: 2500,
    Medical_Insurance: 11500,
    Dental_Insurance: 550,
    Vision_Insurance: 120,
    Life_Insurance: 350,
    Short_Term_Disability: 2400,
    Long_Term_Disability: 600,
    Tuition_Reimbursement: 1200,
    PTO: 5700,
    Other_Allowances: 500
  };
}
