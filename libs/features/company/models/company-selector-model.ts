export interface CompanySelectorItem {
  CompanyId: number;
  CompanyName: string;
}

export function MockSelectedCompany(): CompanySelectorItem {
  return {
    CompanyId: 13,
    CompanyName: 'pf company test'
  };
}
