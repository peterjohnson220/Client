export interface ExistingCompany {
  CompanyId: number;
  CompanyName: string;
  Industry: string;
  Size: number;
  FTEs: number;
  InExchange: boolean;
  PendingInvitation: boolean;
  Peers: string[];
}

export function generateMockExistingCompany(): ExistingCompany {
  return {
    CompanyId: 0,
    CompanyName: 'MockCompany',
    Industry: 'MockIndustry',
    Size: 0,
    FTEs: 0,
    InExchange: false,
    PendingInvitation: false,
    Peers: ['MockPeer']
  };
}
