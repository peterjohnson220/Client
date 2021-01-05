import { NoteOperation } from '../../features/notes/notes-manager/constants/note-operation-constants';

export interface NotesBase {
  Id: number;
  Notes:  string;
  UserId:  number;
  FirstName:  string;
  LastName:  string;
  UserPicture:  string;
  CreateDate:  string; // DateTimes from DB come back as strings.
  NoteOperation: NoteOperation;
}
