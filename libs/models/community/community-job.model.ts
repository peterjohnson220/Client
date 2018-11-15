import { CommunityUserInfo, generateMockCommunityUserInfo } from './community-user-info.model';

export interface CommunityJob {
  Id: string;
  PositionTitle: string;
  Location: string;
  Url: string;
  UserInfo: CommunityUserInfo;
  DatePosted: Date;
  TimeTicks: number;
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
    UserInfo: generateMockCommunityUserInfo(),
    DatePosted: new Date(),
    TimeTicks: 123456789,
    CompanyLogo: '',
    ElapsedTime: '1 week',
    IsCurrentUserJob: true
  };
}
