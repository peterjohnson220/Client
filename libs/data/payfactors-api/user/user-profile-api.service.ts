import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JdmListFilter } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserProfileApiService {
  private endpoint = 'UserProfile';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getUserFilterList(): Observable<JdmListFilter[]> {
    return this.payfactorsApiService.get<JdmListFilter[]>(`${this.endpoint}.GetFilterList`);
  }
}
