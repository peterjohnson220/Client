import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotesBase } from 'libs/models/notes';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotesApiService {
  private endpoint = 'Notes';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getNotes(request: {
    Entity: string,
    EntityId: number
  }): Observable<NotesBase[]> {
    return this.payfactorsApiService.post<NotesBase[]>(`${this.endpoint}/GetNotes`, request);
  }

  addNote(request: {
    Entity: string,
    EntityId: number,
    Notes: string
  }): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/AddNote`, request);
  }
}
