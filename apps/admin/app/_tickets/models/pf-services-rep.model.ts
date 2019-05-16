export interface PfServicesRep {
  PfServicesRepId: number;
  Name: string;
}

export function generateMockPfServicesRep(): PfServicesRep {
  return {
    PfServicesRepId: 1,
    Name: 'Services Rep'
  };
}
