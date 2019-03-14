
export interface CommunityJob {
  Id: string;
  PositionTitle: string;
  Location: string;
  Url: string;
  DatePosted: Date;
  TimeTicks: number;
  CompanyName: string;
  CompanyLogo: string;
  ElapsedTime: string;
  IsCurrentUserJob: boolean;
}

export function generateMockCommunityJob(): CommunityJob {
  return {
    Id: '1234',
    PositionTitle: 'Job Title',
    Location: 'Boston',
    Url: 'https://www.google.com',
    DatePosted: new Date(),
    TimeTicks: 123456789,
    CompanyLogo: '',
    CompanyName: 'my company',
    ElapsedTime: '1 week',
    IsCurrentUserJob: true
  };
}
