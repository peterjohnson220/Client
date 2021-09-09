export interface ShareJobEmail {
  CompanyId?: string;
  UserId?: string;
  EmailAddress: string;
  FirstName: string;
  LastName: string;
  UserPicture?: string;
}

export interface SharedJobDescriptionUser {
  EmailAddress: string;
  FirstName: string;
  LastName: string;
  SharedByEmail: string;
  SharedByFirstName: string;
  SharedByLastName: string;
  ShareDate: Date;
}
