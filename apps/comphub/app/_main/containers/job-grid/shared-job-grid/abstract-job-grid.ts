import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { QuickPriceType } from 'libs/constants';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromJobGridActions from '../../../actions/job-grid.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { JobData, JobGridData, QuickPriceGridColumn, QuickPriceGridColumnConfiguration, WorkflowContext } from '../../../models';

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
  defaultGridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };
  jobTitle: string;
  jobDataSelection: JobData;
  gridHasData: boolean;
  jobGridData: JobGridData;

  constructor(
    protected store: Store<fromComphubMainReducer.State>
  ) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubMainReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
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
}
