import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseNotesApiService } from './base-notes-api.service';
import { PayfactorsApiService } from '../payfactors-api.service';
import { NotesBase } from '../../../models/notes';
import { SaveNotesRequest } from '../../../models/payfactors-api/notes/save-notes-request.model';


@Injectable({
  providedIn: 'root',
})
export class PricingMatchNotesApi extends BaseNotesApiService {
  private endpoint = 'PricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) {
    super();
  }

  getNotes(entityId: number): Observable<NotesBase[]> {
    return this.payfactorsApiService.get<NotesBase[]>(`${this.endpoint}/GetPricingMatchNotes`, {params: {entityId: entityId}});
  }

  saveNotes(request: SaveNotesRequest) {
    // All records have the same Entity and EntityId
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SavePricingMatchNotes?entityId=${request.entityId}`, request.noteRequestList);
  }
}
