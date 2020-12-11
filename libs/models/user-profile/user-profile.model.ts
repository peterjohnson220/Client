export interface UserProfile {
  UserId: number;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Title: string;
  UserPicture: string;
}

export function generateMockUserProfile(): UserProfile {
  return {
    UserId: 1,
    FirstName: 'John',
    LastName: 'Doe',
    EmailAddress: 'johndoe@payfactors.com',
    Title: 'Accountant',
    UserPicture: 'FakePicture.Jpg'
  };
}
