import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { UserContext } from 'libs/models/security';
import * as fromUserContextReducer from 'libs/state/app-context/reducers/user-context.reducer';
import { CompanyDto } from 'libs/models/company';

import * as fromPublicViewHeaderActions from '../../actions/public-view-header.actions';
import * as fromRootState from 'libs/state/state';

@Component({
  selector: 'pf-public-view-header',
  templateUrl: './public-view-header.component.html'
})

export class PublicViewHeaderComponent implements OnInit {
  public identity$: Observable<UserContext>;
  public company$: Observable<CompanyDto>;

  constructor(
    private store: Store<fromUserContextReducer.State>) {
    this.identity$ = this.store.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identity$.subscribe(i => {
      this.store.dispatch(new fromPublicViewHeaderActions.LoadCompanyInformation({ CompanyId: i.CompanyId }));
    });
  }
}
