import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';


import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';


@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent {
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.userContext$ = store.select(fromRootState.getUserContext);
  }
}

