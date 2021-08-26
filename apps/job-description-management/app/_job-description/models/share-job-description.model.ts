export interface ShareJobEmail {
  CompanyId?: string;
  UserId?: string;
  EmailAddress: string;
  FirstName: string;
  LastName: string;
  UserPicture?: string;
}

export interface SharedJobDescription {
  SharedTo: ShareJobEmail;
  SharedBy: string;
  SharedDate: Date;
  ExpirationDate?: Date;
}