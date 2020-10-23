import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotesBase } from '../../../models/notes';

import { PayfactorsApiService } from '../payfactors-api.service';
import { BaseNotesApiService } from './base-notes-api.service';
import { SaveNotesRequest } from '../../../models/payfactors-api/notes/save-notes-request.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyJobsNotesApi extends BaseNotesApiService {
  private endpoint = 'CompanyJob';

  constructor(private payfactorsApiService: PayfactorsApiService) {
    super();
  }

  getNotes(entityId: number): Observable<NotesBase[]> {
    return this.payfactorsApiService.get<NotesBase[]>(`${this.endpoint}/GetCompanyJobNotes`, {params: {entityId: entityId}});
  }

  saveNotes(request: SaveNotesRequest) {
    // All records have the same Entity and EntityId
    return this.payfactorsApiService.post(`${this.endpoint}/Default.SaveCompanyJobNotes`, request);
  }
}
