export interface RangeDistributionType {
  Id: number;
  Type: string;
}

export function generateMockStructureRangeDistributionType(): RangeDistributionType {
  return  {
    Id: 1,
    Type: 'Min/Mid/Max'
  };
}

export function generateMockStructureRangeDistributionTypes(): RangeDistributionType[] {
  return [
    generateMockStructureRangeDistributionType()
  ];
}
