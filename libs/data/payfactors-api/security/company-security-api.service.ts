import { Injectable } from '@angular/core';
import { UserContext } from '../../../models/security';
import { PayfactorsApiService } from '../payfactors-api.service';

import { Store } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { take, filter, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanySecurityApiService {
  private endpoint = 'CompanySecurity';

  constructor(
    private payfactorsApiService: PayfactorsApiService,
    private store: Store<fromRootState.State>
  ) { }

  getIdentity() {
    return this.payfactorsApiService.get<UserContext>(`${this.endpoint}.GetIdentity`);
  }

  public getIsCompanyAdmin() {
    return this.waitForUserAssignedRoleLoadAttempt().pipe(
      switchMap(() => {
        return this.store.select(fromRootState.getUserAssignedRoles).pipe(
          map(uar => {
            if (uar.find(r => r.RoleName === 'Company Admin').Assigned) {
              return true;
            } else {
              return false;
            }
          }),
          take(1)
        );
      })
    );
  }

  private waitForUserAssignedRoleLoadAttempt() {
    return this.store.select(fromRootState.getUserAssignedRolesAttempted).pipe(
      filter(attempted => attempted),
      take(1)
    );
  }

}
