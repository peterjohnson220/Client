export interface NotesBase {
  Notes:  string;
  UserId:  number;
  User: {
    FirstName:  number;
    LastName:  number;
    UserPicture:  string;
  };
  CreateDate:  Date;
  CreateUser:  Date;
  EditDate:  Date;
  EditUser:  Date;
}
