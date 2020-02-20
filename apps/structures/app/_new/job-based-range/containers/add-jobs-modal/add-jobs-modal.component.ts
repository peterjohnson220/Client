import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserContext } from 'libs/models/security';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import * as fromRootState from 'libs/state/state';
import { Permissions, SystemUserGroupNames } from 'libs/constants';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { staticFilters } from 'libs/features/add-jobs/data';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromPaymarketActions from 'libs/features/add-jobs/actions/paymarkets.actions';
import * as fromPaymarketReducer from 'libs/features/add-jobs/reducers';

import * as fromStructuresReducer from '../../reducers';
import * as fromJobBasedRangesAddJobsModalActions from '../../actions/add-jobs-modal.actions';
import * as fromJobBasedRangesSearchResultsActions from '../../actions/search-results.actions';

@Component({
  selector: 'pf-add-jobs-modal',
  templateUrl: './add-jobs-modal.component.html',
  styleUrls: ['./add-jobs-modal.component.scss']
})
export class AddJobsModalComponent extends SearchBase implements OnInit, OnDestroy {
  @Output() saved = new EventEmitter();
  @Output() opened = new EventEmitter();

  @Input() saving = false;
  @Input() errorSaving = false;
  @Input() modalOpen$: Observable<boolean>;
  @Input() addJobsSaving: boolean;

  // Observables
  searchingFilter$: Observable<boolean>;
  numberOfSearchResults$: Observable<number>;
  selectedPaymarkets$: Observable<number[]>;
  pageShown$: Observable<boolean>;
  addingData$: Observable<boolean>;
  addingDataError$: Observable<boolean>;
  addingDataErrorMessage$: Observable<any>;
  userContext: Observable<UserContext>;
  _Permissions = null;

  // Subscriptions
  selectedJobIdsSubscription: Subscription;
  selectedPayfactorsJobCodesSubscription: Subscription;

  // Local variables
  maxAllowedJobsSetting = 0;
  currentJobCountSetting = 0;
  isSmallBiz = false;
  selectedJobIdCount: number;
  selectedJobCodeCount: number;

  addJobsForm: FormGroup;
  attemptedSave = false;

  constructor(
    private formBuilder: FormBuilder,
    store: Store<fromSearchReducer.State>,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {
    super(store);
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.numberOfSearchResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.selectedPaymarkets$ = this.store.select(fromPaymarketReducer.getSelectedPaymarkets);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.addingData$ = this.store.select(fromStructuresReducer.getAddingData);
    this.addingDataError$ = this.store.select(fromStructuresReducer.getAddingDataError);
    this.addingDataErrorMessage$ = this.store.select(fromStructuresReducer.getAddingDataErrorMessage);
    this.userContext = store.select(fromRootState.getUserContext);
    this._Permissions = Permissions;
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromJobBasedRangesAddJobsModalActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));

    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());

    // Always get the latest company settings so we have the latest job count
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
  }

  onResetApp(): void {
    this.store.dispatch(new fromPaymarketActions.ClearPayMarkets());
    this.store.dispatch(new fromJobBasedRangesSearchResultsActions.ClearSelectedJobs());
    this.store.dispatch(new fromJobBasedRangesSearchResultsActions.Reset());
  }

  handleAddClicked(): void {
    this.store.dispatch(new fromJobBasedRangesAddJobsModalActions.AddSelectedJobs());
  }

  handleClearSelectionsClicked(): void {
    this.store.dispatch(new fromJobBasedRangesSearchResultsActions.ClearSelectedJobs());
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
    this.buildForm();

    this.userContext.subscribe(uc => {
      this.isSmallBiz = (uc.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness);
      if (this.isSmallBiz) {
        this.settingsService.selectCompanySetting<number>(CompanySettingsEnum.MaxProjectJobCount, 'number')
          .subscribe(setting => this.maxAllowedJobsSetting = setting);
        this.settingsService.selectCompanySetting<number>(CompanySettingsEnum.ProjectJobCount, 'number')
          .subscribe(setting => this.currentJobCountSetting = setting);
      }
    });

    this.selectedJobIdsSubscription = this.store.select(fromStructuresReducer.getSelectedJobIds)
      .subscribe(jobIds => this.selectedJobIdCount = jobIds.length);
    this.selectedPayfactorsJobCodesSubscription = this.store.select(fromStructuresReducer.getSelectedPayfactorsJobCodes)
      .subscribe(jobCodes => this.selectedJobCodeCount = jobCodes.length);
  }

  handleModalDismiss() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
  }

  save() {
    this.attemptedSave = true;
  }

  buildForm() {
    this.addJobsForm = this.formBuilder.group({});
  }

  ngOnDestroy() {
    this.selectedJobIdsSubscription.unsubscribe();
    this.selectedPayfactorsJobCodesSubscription.unsubscribe();
  }
}
