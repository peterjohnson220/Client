import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompositeFieldResponse } from '../../../models/payfactors-api';

@Injectable()
export class CompositeFieldApiService {
  private readonly endpoint = 'CompositeField';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  GetCompositeFieldsForStructuresModel(): Observable<CompositeFieldResponse[]> {
    return this.payfactorsApiService.get<CompositeFieldResponse[]>(
      `${this.endpoint}/Default.GetControlPointsForStructuresModel`);
  }
}
