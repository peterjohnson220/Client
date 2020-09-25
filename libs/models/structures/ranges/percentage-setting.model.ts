export interface PercentageSetting {
  Enabled: boolean;
  Percentage: number;
}

export function generateMockPercentageSetting(): PercentageSetting {
  return {
      Enabled: false,
      Percentage: 0
    };
}
