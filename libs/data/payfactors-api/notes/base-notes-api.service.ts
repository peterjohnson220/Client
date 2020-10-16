import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotesBase } from 'libs/models/notes';
import { SaveNotesRequest } from '../../../models/payfactors-api/notes/save-notes-request.model';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseNotesApiService {
  constructor() { }

  abstract getNotes(entityId: number): Observable<NotesBase[]>;

  abstract saveNotes(request: SaveNotesRequest);
}
