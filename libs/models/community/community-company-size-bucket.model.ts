export interface CommunityCompanySizeBucket {
  LowRange: number;
  HighRange: number;
  DisplayName: string;
 }

export function generateMockCommunityCompanySizeBucket(): CommunityCompanySizeBucket {
  return {
    LowRange: 0,
    HighRange: 25,
    DisplayName: '<25 Employees'
  };
}
