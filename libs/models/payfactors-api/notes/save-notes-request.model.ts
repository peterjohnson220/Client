import { NoteRequest } from '../../notes';

export class SaveNotesRequest {
  noteRequestList: NoteRequest[];
  entityId: number;
}
