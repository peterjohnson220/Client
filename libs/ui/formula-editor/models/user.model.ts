export interface SharedDataViewUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  UserPicture?: string;
  Title?: string;
  CanEdit: boolean;
}

export function generateMockSharedDataViewUser(): SharedDataViewUser {
  return {
    UserId: 1234,
    CanEdit: false,
    FirstName: 'John',
    LastName: 'Smith',
    Title: 'CEO'
  };
}
