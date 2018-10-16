import { CommunityUserInfo } from './community-user-info.model';

export interface CommunityJob {
  Id: string;
  PositionTitle: string;
  Location: string;
  Url: string;
  UserInfo: CommunityUserInfo;
  DatePosted: Date;
  TimeTicks: number;
}
