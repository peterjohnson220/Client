import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromCompanyResourcesPageActions from '../../../actions/company-resources.actions';
import * as fromCompanyResourcesPageReducer from '../../../reducers';
import { CompanyResources } from '../../../models';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

@Component({
  selector: 'pf-company-resources',
  templateUrl: './company-resources.page.html',
  styleUrls: ['./company-resources.page.scss']
})
export class CompanyResourcesPageComponent implements OnInit, OnDestroy {

  companyName: string;
  companyResources$: Observable<CompanyResources>;
  companyResourcesLoading$: Observable<boolean>;
  companyResourcesLoadingError$: Observable<boolean>;
  identity$: Observable<UserContext>;
  loadingError$: Observable<boolean>;

  private indentitySubscription: Subscription;

  constructor(private store: Store<fromCompanyResourcesPageReducer.State>, private rootStore: Store<fromRootState.State>) {
    this.companyResources$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResources);
    this.companyResourcesLoading$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoading);
    this.companyResourcesLoadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.loadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.store.dispatch(new fromCompanyResourcesPageActions.GettingCompanyResources());

    this.indentitySubscription = this.identity$.subscribe((response) => {
      this.companyName = response.CompanyName;
    });
  }

  ngOnDestroy() {
    this.indentitySubscription.unsubscribe();
  }
}
