export interface ValueMapping {
  PayfactorsName: string;
  ClientValues: string[];
}

export function generateMockValueMapping(): ValueMapping {
  return {
    PayfactorsName: 'MockField',
    ClientValues: [
      'mock value 1',
      'MockValue2'
    ]
  };
}
