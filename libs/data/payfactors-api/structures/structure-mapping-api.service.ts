import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  SaveCompanyJobStructureMapsRequest,
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class StructureMappingApiService {
  private readonly endpoint = 'StructureMapping';

  constructor(private payfactorsApiService: PayfactorsApiService) { }


  saveStructureGradeMappings(request: SaveCompanyJobStructureMapsRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveStructureGradeMappings`, request);
  }

}
