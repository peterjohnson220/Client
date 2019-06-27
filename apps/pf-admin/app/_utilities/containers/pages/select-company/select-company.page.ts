import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSelectCompanyActions from '../../../actions/select-company.actions';
import * as fromUtilitiesReducer from '../../../reducers';
import { DataListItem } from '../../../models';

@Component({
  selector: 'pf-admin-utilities-select-company',
  templateUrl: './select-company.page.html',
  styleUrls: ['./select-company.page.scss']
})
export class SelectCompanyPageComponent implements OnInit {
  loadingCompaniesListItem$: Observable<boolean>;
  loadingCompaniesListItemError$: Observable<boolean>;
  companiesListItems$: Observable<DataListItem[]>;
  companyFilter$: Observable<string>;

  constructor(
    private store: Store<fromUtilitiesReducer.State>,
    private router: Router
  ) {
    this.loadingCompaniesListItem$ = this.store.pipe(select(fromUtilitiesReducer.getLoadingCompaniesList));
    this.loadingCompaniesListItemError$ = this.store.pipe(select(fromUtilitiesReducer.getLoadingCompaniesListError));
    this.companiesListItems$ = this.store.pipe(select(fromUtilitiesReducer.getCompaniesList));
    this.companyFilter$ = this.store.pipe(select(fromUtilitiesReducer.getCompanyFilter));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromSelectCompanyActions.LoadCompaniesListIfEmpty());
  }

  handleCompanyClicked(dataListItem: DataListItem) {
    this.router.navigate(['/utilities/yoy-default-scopes', dataListItem.Id]);
  }

  handleFilterChanged(value: string) {
    this.store.dispatch(new fromSelectCompanyActions.SetCompanyFilter(value));
  }
}
