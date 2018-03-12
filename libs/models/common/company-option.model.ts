export interface CompanyOption {
  CompanyId: number;
  Name: string;
}

export function generateMockCompanyOption(): CompanyOption {
  return {
    CompanyId: 1,
    Name: 'MockCompany'
  };
}
