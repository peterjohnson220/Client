import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromCompaniesActions from '../../../actions/companies.actions';
import * as fromCompaniesReducer from '../../../reducers';
import { CompanyGridItem } from '../../../models';
import { CompaniesListConstants } from '../../../constants/companies-list-constants';

@Component({
    selector: 'pf-admin-companies-list-page',
    templateUrl: './companies-list.page.html',
    styleUrls: []
})
export class CompaniesListPageComponent implements OnInit {
    companies$: Observable<CompanyGridItem[]>;
    companiesLoading$: Observable<boolean>;
    companiesLoadingError$: Observable<boolean>;
    searchTerm$: Observable<string>;
    companiesEditRouterLink: string = CompaniesListConstants.COMPANIES_EDIT_ROUTER_LINK;

    constructor( private store: Store<fromCompaniesReducer.CompanyManagementState>) {
        this.companies$ = this.store.select(fromCompaniesReducer.getCompanies);
        this.companiesLoading$ = this.store.select(fromCompaniesReducer.getCompaniesLoading);
        this.companiesLoadingError$ = this.store.select(fromCompaniesReducer.getCompaniesLoadingError);
        this.searchTerm$ = this.store.select(fromCompaniesReducer.getSearchTerm);
    }

    ngOnInit() {
        this.store.dispatch( new fromCompaniesActions.LoadCompanies());
    }

    updateSearchTerm(newSearchTerm: string) {
        this.store.dispatch( new fromCompaniesActions.UpdateSearchTerm(newSearchTerm));
    }
}
