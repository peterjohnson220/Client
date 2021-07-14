import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { QuickPriceType } from 'libs/constants';
import { JobData, JobGridData } from 'libs/models/comphub';

import * as fromComphubSharedReducer from '../../../reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { QuickPriceGridColumn, QuickPriceGridColumnConfiguration, WorkflowContext } from '../../../models';

@Injectable()
export abstract class AbstractJobGrid implements OnInit, OnDestroy {
  selectedJobTitle$: Observable<string>;
  jobResults$: Observable<JobGridData>;
  jobResultsLoading$: Observable<boolean>;
  jobResultsLoadingError$: Observable<boolean>;
  selectedJobData$: Observable<JobData>;
  workflowContext$: Observable<WorkflowContext>;

  jobGridDataSubscription: Subscription;
  selectedJobTitleSubscription: Subscription;
  selectedJobSubscription: Subscription;
  workflowContextSubscription: Subscription;

  workflowContext: WorkflowContext;
  gridColumnsConfiguration: QuickPriceGridColumn[];
  pageSize = 5;
  jobTitle: string;
  jobDataSelection: JobData;
  gridHasData: boolean;
  jobGridData: JobGridData;
  gridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };

  constructor(
    protected store: Store<fromComphubSharedReducer.State>
  ) {
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubSharedReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubSharedReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubSharedReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubSharedReducer.getSelectedJob);
    this.selectedJobData$ = this.store.select(fromComphubSharedReducer.getSelectedJobData);
  }

  ngOnInit(): void {
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jobTitle => this.jobTitle = jobTitle);
    this.selectedJobSubscription = this.selectedJobData$.subscribe(j => this.jobDataSelection = j);
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      if (!!wfc) {
        this.workflowContext = wfc;
        this.gridHasData = this.workflowContext.quickPriceType !== QuickPriceType.SMALL_BUSINESS;
        this.gridColumnsConfiguration = QuickPriceGridColumnConfiguration.getGridColumnConfigByType(this.workflowContext.quickPriceType);
      }
    });
    this.jobGridDataSubscription = this.jobResults$.subscribe(value => this.jobGridData = value);
  }

  ngOnDestroy(): void {
    this.selectedJobTitleSubscription.unsubscribe();
    this.selectedJobSubscription.unsubscribe();
    this.workflowContextSubscription.unsubscribe();
    this.jobGridDataSubscription.unsubscribe();
  }

  handleSelectionChanged(job: JobData) {
    this.store.dispatch(new fromComphubPageActions.SetSelectedJobData(job));
  }

  handleExpandJdClicked(jobId: number) {
    this.store.dispatch(new fromJobGridActions.ToggleJobDescription({ jobId }));
  }

  resetGridContext(): void {
    this.gridContext = {
      skip: 0,
      take: this.pageSize,
      sortBy: null
    };
  }
}
