export interface CompanySelectorItem {
  CompanyId: number;
  CompanyName: string;
  CombinedDetail: string;
}

export function MockSelectedCompany(): CompanySelectorItem {
  return {
    CompanyId: 13,
    CompanyName: 'pf company test',
    CombinedDetail: 'pf company test (13)'
  };
}
