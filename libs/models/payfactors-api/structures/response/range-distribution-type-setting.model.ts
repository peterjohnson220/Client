export interface RangeDistributionTypeSetting {
  MinMidMax: MinMidMax;
}

export interface MinMidMax {
  Minimum: number;
  Midpoint: number;
  Maximum: number;
  ControlPoint: string;
}


export function generateMockRangeDistributionTypeSetting(): RangeDistributionTypeSetting {
  return  {
    MinMidMax: generateMockMinMidMax()
  };
}

export function generateMockMinMidMax(): MinMidMax {
  return  {
    Minimum: 1,
    Midpoint: 2,
    Maximum: 3,
    ControlPoint: 'BaseMRP'
  };
}


