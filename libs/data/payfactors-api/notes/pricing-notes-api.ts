import { Injectable } from '@angular/core';
import { BaseNotesApiService } from './base-notes-api.service';
import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';
import { NotesBase } from '../../../models/notes';
import { SaveNotesRequest } from '../../../models/payfactors-api/notes/save-notes-request.model';

@Injectable({
  providedIn: 'root',
})
export class PricingNotesApi extends BaseNotesApiService {
  private endpoint = 'Pricing';

  constructor(private payfactorsApiService: PayfactorsApiService) {
    super();
  }

  getNotes(entityId: number): Observable<NotesBase[]> {
    return this.payfactorsApiService.get<NotesBase[]>(`${this.endpoint}/GetPricingNotes`, {params: {entityId: entityId}});
  }

  saveNotes(request: SaveNotesRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SavePricingNotes?entityId=${request.entityId}`, request.noteRequestList);
  }
}
