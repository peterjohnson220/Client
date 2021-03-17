import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { DragulaService } from 'ng2-dragula';

import { Permissions, SystemUserGroupNames } from 'libs/constants';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import { UserContext } from 'libs/models/security';
import { CompanySettingsEnum } from 'libs/models/company';
import { AddJobsConfig, SearchFilterMappingData, staticFilters, JobSearchUserFilterType } from 'libs/features/jobs/add-jobs/data';
import * as fromPaymarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { ADD_JOBS_CONFIG_DEFAULT_TRUE } from 'libs/features/jobs/add-jobs/constants';

import { Grade, GradeRangeGroupDetails } from '../../../models';
import * as fromJobsToGradeActions from '../../../actions/jobs-to-grade.actions';
import * as fromJobsToGradeReducer from '../../../reducers';
import { cleanupDatacutsDragging, enableJobsDragging } from '../../../helpers';

@Component({
  selector: 'pf-add-jobs-to-range-page',
  templateUrl: './add-jobs-to-range.page.html',
  styleUrls: ['./add-jobs-to-range.page.scss']
})
export class AddJobsToRangePageComponent extends SearchBaseDirective implements OnInit, OnDestroy {
  @Input() isJobRange: boolean;
  @Input() controlPoint: string;
  @Input() rate: string;
  @Input() gradeRangeGroupDetails: GradeRangeGroupDetails;
  // Observables
  searchingFilter$: Observable<boolean>;
  numberOfSearchResults$: Observable<number>;
  jobCount$: Observable<number>;
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
  gradesSubscription: Subscription;

  // Local variables
  maxAllowedJobsSetting = 0;
  currentJobCountSetting = 0;
  isSmallBiz = false;
  selectedJobIdCount: number;
  selectedJobCodeCount: number;
  grades: Grade[];

  // Add Jobs Config
  addJobsConfig: AddJobsConfig;
  constructor(
    store: Store<fromSearchReducer.State>,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private dragulaService: DragulaService,
    @Optional() private injectedAddJobsConfig: AddJobsConfig

  ) {
    super(store, SearchFilterMappingData, SearchFeatureIds.AddJobs, JobSearchUserFilterType);
    this.addJobsConfig = injectedAddJobsConfig || ADD_JOBS_CONFIG_DEFAULT_TRUE;
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.numberOfSearchResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.jobCount$ = this.store.select(fromAddJobsReducer.getJobCount);
    this.selectedPaymarkets$ = this.store.select(fromAddJobsReducer.getSelectedPaymarkets);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.addingData$ = this.store.select(fromAddJobsReducer.getAddingData);
    this.addingDataError$ = this.store.select(fromAddJobsReducer.getAddingDataError);
    this.addingDataErrorMessage$ = this.store.select(fromAddJobsReducer.getAddingDataErrorMessage);
    this.userContext = store.select(fromRootState.getUserContext);
    this._Permissions = Permissions;
    enableJobsDragging(dragulaService);
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

  handleSaveClicked(): void {
    this.store.dispatch(new fromJobsToGradeActions.SaveGradeJobMaps(this.grades.filter(g => g.JobIdsToAdd.length > 0 || g.JobIdsToRemove.length > 0)));
  }

  handleAddAllClicked(): void {
    this.store.dispatch(new fromAddJobsPageActions.AddAllJobs());
  }

  handleSelectAllClicked(): void {
    this.store.dispatch(new fromAddJobsSearchResultsActions.SelectAllJobs());
  }

  handleAutoGradeSelectedClicked(): void {
    // this.store.dispatch(new fromAddJobsSearchResultsActions.)
  }


  handleClearSelectionsClicked(): void {
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
  }

  handleCreateNewJobClicked(): void {
    this.router.navigate(['../create-new-job'], {relativeTo: this.route});
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

  disableSaveButton(): boolean {
    let disable = true;
    if (this.grades) {
      // see if there is at least one grade with jobs to remove or add, if yes, enable save button
      const found = this.grades.find(g => g.JobIdsToAdd.length > 0 || g.JobIdsToRemove.length > 0);
      disable = found == null;
    }
    return disable;
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
    this.gradesSubscription = this.store.select(fromJobsToGradeReducer.getGrades)
      .subscribe(grades => this.grades = grades);
  }

  ngOnDestroy() {
    this.selectedJobIdsSubscription?.unsubscribe();
    this.selectedPayfactorsJobCodesSubscription?.unsubscribe();
    this.gradesSubscription?.unsubscribe();
    cleanupDatacutsDragging(this.dragulaService);
  }

}
