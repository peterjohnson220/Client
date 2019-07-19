import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromUtilitiesReducer from '../../../reducers';
import * as fromYoyDefaultScopesCompaniesListActions from '../../../actions/yoy-default-scopes-companies-list.actions';
import { CompanyGridItem } from '../../../../_companies/models';
import { UtilitiesSelectCompanyConstants } from '../../../constants/utilities-select-company-constants';
import { CompaniesListViews } from '../../../../_companies/constants/companies-list-constants';

@Component({
  selector: 'pf-utilities-select-company-page',
  templateUrl: './utilities-select-company.page.html'
})
export class UtilitiesSelectCompanyPageComponent implements OnInit {

  companies$: Observable<CompanyGridItem[]>;
  companiesLoading$: Observable<boolean>;
  selectedItem: number;
  filter: string;
  _CompaniesListViews: typeof CompaniesListViews = CompaniesListViews;

  loadJobDescriptionRouterLink: string = UtilitiesSelectCompanyConstants.LOAD_JOB_DESCRIPTIONS_ROUTER_LINK;

  constructor(
    private router: Router,
    private store: Store<fromUtilitiesReducer.State>
  ) {

    this.companies$ = this.store.pipe(select(fromUtilitiesReducer.getYoyDefaultScopesCompanies));
    this.companiesLoading$ = this.store.pipe(select(fromUtilitiesReducer.getYoyDefaultScopesCompaniesLoading));
  }

  ngOnInit() {
    this.store.dispatch(new fromYoyDefaultScopesCompaniesListActions.LoadYoyDefaultScopesCompanies());
  }

  updateSearchTerm(newSearchTerm: string) {
    this.filter = newSearchTerm;
  }
}
