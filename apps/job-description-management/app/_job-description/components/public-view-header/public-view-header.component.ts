import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { UserContext } from 'libs/models/security';
import * as fromUserContextReducer from 'libs/state/app-context/reducers/user-context.reducer';
import { CompanyDto } from 'libs/models/company';

import * as fromPublicViewHeaderActions from '../../actions/public-view-header.actions';
import * as fromPublicViewHeaderReducer from '../../reducers';

@Component({
  selector: 'pf-public-view-header',
  templateUrl: './public-view-header.component.html'
})

export class PublicViewHeaderComponent implements OnInit {
  public identity$: Observable<UserContext>;
  public company$: Observable<CompanyDto>;

  constructor(
    private userContextStore: Store<fromUserContextReducer.State>,
    private publicHeaderStore: Store<fromPublicViewHeaderReducer.State>
  ) {
    this.identity$ = this.userContextStore.select(fromUserContextReducer.getUserContext);
    this.company$ = this.publicHeaderStore.select(fromPublicViewHeaderReducer.getCompany);
  }

  ngOnInit() {
    this.identity$.subscribe(i => {
      this.publicHeaderStore.dispatch(new fromPublicViewHeaderActions.LoadCompanyInformation({ CompanyId: i.CompanyId }));
    });
  }
}
