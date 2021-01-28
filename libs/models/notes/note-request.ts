import { NoteOperation } from '../../features/notes/notes-manager/constants/note-operation-constants';

export interface NoteRequest {
  NoteId: number;
  NoteText: string;
  NoteOperation: NoteOperation;
}
