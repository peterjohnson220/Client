import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { SystemUserGroupNames } from 'libs/constants';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBase } from 'libs/features/search/containers/search-base';
import { UserContext } from 'libs/models/security';
import { CompanySettingsEnum } from 'libs/models/company';

import * as fromAddJobsPageActions from '../../../actions/add-jobs-page.actions';
import * as fromAddJobsSearchResultsActions from '../../../actions/search-results.actions';
import * as fromPaymarketActions from '../../../actions/paymarkets.actions';
import * as fromAddJobsReducer from '../../../reducers';
import { staticFilters } from '../../../data';



@Component({
  selector: 'pf-add-jobs-page',
  templateUrl: './add-jobs.page.html',
  styleUrls: ['./add-jobs.page.scss']
})
export class AddJobsPageComponent extends SearchBase implements OnInit, OnDestroy {
  // Observables
  searchingFilter$: Observable<boolean>;
  numberOfSearchResults$: Observable<number>;
  selectedPaymarkets$: Observable<number[]>;
  pageShown$: Observable<boolean>;
  addingData$: Observable<boolean>;
  addingDataError$: Observable<boolean>;
  addingDataErrorMessage$: Observable<any>;
  userContext: Observable<UserContext>;

  // Subscriptions
  selectedJobIdsSubscription: Subscription;
  selectedPayfactorsJobCodesSubscription: Subscription;

  // Local variables
  maxAllowedJobsSetting = 0;
  currentJobCountSetting = 0;
  isSmallBiz = false;
  selectedJobIdCount: number;
  selectedJobCodeCount: number;

  constructor(
    store: Store<fromSearchReducer.State>,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {
    super(store);
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.numberOfSearchResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.selectedPaymarkets$ = this.store.select(fromAddJobsReducer.getSelectedPaymarkets);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.addingData$ = this.store.select(fromAddJobsReducer.getAddingData);
    this.addingDataError$ = this.store.select(fromAddJobsReducer.getAddingDataError);
    this.addingDataErrorMessage$ = this.store.select(fromAddJobsReducer.getAddingDataErrorMessage);
    this.userContext = store.select(fromRootState.getUserContext);
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromAddJobsPageActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());

    // Always get the latest company settings so we have the latest job count
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
  }

  onResetApp(): void {
    this.store.dispatch(new fromPaymarketActions.ClearPayMarkets());
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
  }

  handleAddClicked(): void {
    this.store.dispatch(new fromAddJobsPageActions.AddSelectedJobs());
  }

  handleClearSelectionsClicked(): void {
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
  }

  handleCreateNewJobClicked(): void {
    this.router.navigate(['../create-new-job'], { relativeTo: this.route });
  }

  get numberOfJobsSelected(): number {
    return (this.selectedJobIdCount + this.selectedJobCodeCount);
  }

  get jobUsageCount(): number {
    return this.currentJobCountSetting + this.numberOfJobsSelected;
  }

  get canSelectJobs(): boolean {
    if (!this.isSmallBiz) {
      return true;
    } else {
      return this.jobUsageCount < this.maxAllowedJobsSetting;
    }
  }

  ngOnInit() {
    this.userContext.subscribe(uc => {
      this.isSmallBiz = (uc.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness);
      if (this.isSmallBiz) {
        this.settingsService.selectCompanySetting<number>(CompanySettingsEnum.MaxProjectJobCount, 'number')
          .subscribe(setting => this.maxAllowedJobsSetting = setting);
        this.settingsService.selectCompanySetting<number>(CompanySettingsEnum.ProjectJobCount, 'number')
          .subscribe(setting => this.currentJobCountSetting = setting);
      }
    });

    this.selectedJobIdsSubscription = this.store.select(fromAddJobsReducer.getSelectedJobIds)
      .subscribe(jobIds => this.selectedJobIdCount = jobIds.length);
    this.selectedPayfactorsJobCodesSubscription = this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes)
      .subscribe(jobCodes => this.selectedJobCodeCount = jobCodes.length);
  }

  ngOnDestroy() {
    this.selectedJobIdsSubscription.unsubscribe();
    this.selectedPayfactorsJobCodesSubscription.unsubscribe();
  }
}
