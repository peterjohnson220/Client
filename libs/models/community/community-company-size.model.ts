export interface CommunityCompanySize {
  Id: Number;
  LowRange: number;
  HighRange: number;
  DisplayName: string;
 }

export function generateMockCommunityCompanySize(): CommunityCompanySize {
  return {
    Id: 123,
    LowRange: 0,
    HighRange: 25,
    DisplayName: '<25 Employees'
  };
}
