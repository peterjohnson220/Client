import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';

import { CompanyEmployee } from 'libs/models';
import { EntityKeyFieldsResponse } from 'libs/models/payfactors-api';

@Injectable()
export class EntityKeysValidationApiService {
  private endpoint = 'EntityKeysValidation';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  validateEmployeeKeys(employee: CompanyEmployee): Observable<EntityKeyFieldsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateEmployeeKeys`, employee);
  }
}
