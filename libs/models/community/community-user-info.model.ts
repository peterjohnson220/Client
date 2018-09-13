export interface CommunityUserInfo {
  UserId: number;
  CompanyId: number;
  UserFirstName: string;
  UserLastName: string;
  CompanyName: string;
  AvatarSource: string;
}

export function generateMockCommunityUserInfo(): CommunityUserInfo {
  return {
    UserId: 12345,
    CompanyId: 13,
    UserFirstName:  'Testfirstname',
    UserLastName: 'Testlastname',
    CompanyName: 'Company Name',
    AvatarSource: 'Avatar Source'
  };
}
