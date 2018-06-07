import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UserFilter } from '../../../models/user-profile';

@Injectable()
export class UserProfileApiService {
  private endpoint = 'UserProfile';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getUserFilterList(): Observable<UserFilter[]> {
    return this.payfactorsApiService.get<UserFilter[]>(`${this.endpoint}.GetFilterList`);
  }
}
