export interface AutoShareUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  UserPicture?: string;
  Title?: string;
  IsSelected?: boolean;
}

export function generateMockAutoShareUser(): AutoShareUser {
  return {
    UserId: 1234,
    FirstName: 'John',
    LastName: 'Smith',
    Title: 'CEO'
  };
}
