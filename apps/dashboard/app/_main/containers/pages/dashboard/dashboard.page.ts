import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromDashboardReducer from '../../../reducers';
import * as fromDashboardActions from '../../../actions/dashboard.actions';
import * as fromCompanyContextActions from 'libs/state/app-context/actions/company-context.actions';
import * as fromRootState from 'libs/state/state';

import { Feature } from '../../../models';
import { CompanyDto } from 'libs/models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  driftUserId: number;
  companyContext: CompanyDto;

  accountExecutiveDriftUserId$: Observable<number>;
  features$: Observable<Feature[]>;
  loadingError$: Observable<boolean>;
  companyContext$: Observable<CompanyDto>;

  accountExecutiveDriftUserIdSubscription: Subscription;
  companyContextSubscription: Subscription;


  constructor(private store: Store<fromDashboardReducer.State>) {
    this.accountExecutiveDriftUserId$ = this.store.select(fromDashboardReducer.getAccountExecutiveDriftUserId);
    this.loadingError$ = this.store.select(fromDashboardReducer.getFeaturesLoadingError);
    this.features$ = this.store.select(fromDashboardReducer.getFeatures);
    this.companyContext$ = this.store.pipe(select(fromRootState.getCompanyContext));
  }

  @HostListener('window:pendo-fetch-event', ['$event'])
    onPendoFetchEvent(event) {
      this.getAccountExecutiveDriftUserId();
  }

  @HostListener('window:pendo-event', ['$event'])
    onPendoEvent(event) {
      this.store.dispatch(new fromDashboardActions.SendingInAppMarketingEmail(event.detail));
  }

  ngOnInit() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
    this.store.dispatch(new fromCompanyContextActions.GetCompanyContext());
    this.companyContextSubscription = this.companyContext$.subscribe((response) => {
      this.companyContext = response;
    });
  }

  ngOnDestroy() {
    this.accountExecutiveDriftUserIdSubscription.unsubscribe();
    this.companyContextSubscription.unsubscribe();
  }

  handleFeaturesReload() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }

  private getAccountExecutiveDriftUserId() {
    if (!this.driftUserId) {
      this.getDriftUserId();
    } else {
      this.dispatchDriftUserIdToPendo();
    }
  }

  private getDriftUserId() {
    this.store.dispatch(new fromDashboardActions.GettingDriftUserId(this.companyContext.AccountExecutiveUserId));
      this.accountExecutiveDriftUserIdSubscription = this.accountExecutiveDriftUserId$.subscribe((id) => {
        this.driftUserId = id;
        if (id) {
          this.dispatchDriftUserIdToPendo();
        }
    });
  }

  private dispatchDriftUserIdToPendo() {
    const pfEvent = new CustomEvent('pf-event', {
      bubbles: true,
      detail: {
        driftUserId: this.driftUserId
      }
    });
    window.dispatchEvent(pfEvent);
  }
}
