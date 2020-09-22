import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { QuickPriceType } from 'libs/constants';

import * as fromComphubMainReducer from '../../reducers';
import * as fromJobGridActions from '../../actions/job-grid.actions';
import { JobData, JobGridData, QuickPriceGridColumn, QuickPriceGridColumnConfiguration, WorkflowContext } from '../../models';
import { DataCardHelper } from '../../helpers';

@Component({
  selector: 'pf-comphub-job-grid',
  templateUrl: './job-grid.component.html',
  styleUrls: ['./job-grid.component.scss']
})
export class JobGridComponent implements OnInit, OnDestroy {
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
  gridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };
  jobTitle: string;
  jobDataSelection: JobData;
  firstDayOfMonth: Date;
  quickPriceTypes = QuickPriceType;
  gridHasData: boolean;
  jobGridData: JobGridData;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubMainReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.firstDayOfMonth = DataCardHelper.firstDayOfMonth();
  }

  ngOnInit(): void {
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jobTitle => {
      this.jobTitle = jobTitle;
      this.resetGridContext();
      if (jobTitle?.length) {
        this.loadJobResults();
      }
    });
    this.selectedJobSubscription = this.selectedJobData$.subscribe(j => this.jobDataSelection = j);
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      if (!!wfc) {
        this.workflowContext = wfc;
        this.gridHasData = this.workflowContext.quickPriceType !== QuickPriceType.SMALL_BUSINESS;
        this.gridColumnsConfiguration = this.gridHasData
          ? QuickPriceGridColumnConfiguration.gridWithData()
          : QuickPriceGridColumnConfiguration.gridWithoutData();
      }
    });
    this.jobGridDataSubscription = this.jobResults$.subscribe(value => this.jobGridData = value);
  }

  ngOnDestroy(): void {
    this.selectedJobTitleSubscription.unsubscribe();
    this.selectedJobSubscription.unsubscribe();
    this.workflowContextSubscription.unsubscribe();
  }

  handleSortChange(field: string): void {
    if (this.isSortSupported(field)) {
      this.gridContext = {
        skip: 0,
        take: this.gridContext.take,
        sortBy: this.updateSortFieldAndDirection(field)
      };
      this.loadJobResults();
    }
  }

  handleSelectionChanged(job: JobData) {
    this.store.dispatch(new fromJobGridActions.SetSelectedJobData(job));
  }

  handleExpandJdClicked(clickEvent: MouseEvent, jobId: number) {
    clickEvent.stopPropagation();
    this.store.dispatch(new fromJobGridActions.ToggleJobDescription({ jobId }));
  }

  handleLoadMore(): void {
    if (!this.jobGridData?.Data?.length) {
      return;
    }
    this.gridContext.skip = this.jobGridData.Data.length;
    this.loadJobResults();
  }

  private loadJobResults(): void {
    this.store.dispatch(new fromJobGridActions.GetQuickPriceMarketData({
      JobTitleShort: this.jobTitle,
      CompanyPayMarketId: null,
      Take: this.gridContext.take,
      Skip: this.gridContext.skip,
      Sort: this.gridContext.sortBy,
      WithoutData: !this.gridHasData
    }));
  }

  private isSortSupported(sortField: string): boolean {
    return this.gridColumnsConfiguration.some(c => c.IsSortable && c.SortField === sortField);
  }

  private updateSortFieldAndDirection(field: string): SortDescriptor {
    if (!this.gridContext.sortBy || this.gridContext.sortBy.field !== field) {
      return {
        field: field,
        dir: 'asc'
      };
    }
    if (this.gridContext.sortBy.dir === 'asc') {
      return {
        field: field,
        dir: 'desc'
      };
    }
    return null;
  }

  private resetGridContext(): void {
    this.gridContext = {
      skip: 0,
      take: this.pageSize,
      sortBy: null
    };
  }
}
