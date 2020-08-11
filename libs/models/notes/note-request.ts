export interface AddNoteRequestResponseBase {
  Entity: string;
  EntityId: number;
}

export interface AddNoteRequest extends AddNoteRequestResponseBase {
  Notes: string;
}
