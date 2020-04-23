import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { WindowRef } from 'libs/core/services';
import { Rates, RateType } from 'libs/data/data-sets';
import { KendoDropDownItem } from 'libs/models/kendo';

import { ComphubPages } from '../../../data';
import {
  JobData, PricingPaymarket, JobGridData, QuickPriceGridColumn, QuickPriceGridColumnConfiguration,
  WorkflowContext
} from '../../../models';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { DataCardHelper } from '../../../helpers';

@Component({
  selector: 'pf-data-card',
  templateUrl: './data.card.component.html',
  styleUrls: ['./data.card.component.scss', './shared.data.card.component.scss']
})
export class DataCardComponent implements OnInit, OnDestroy {
  jobTitle: string;
  paymarketId?: number;
  jobDataSelection: JobData;
  currentPageNumber = 1;
  pageSize = 6;
  gridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };
  gridColumnsConfiguration: QuickPriceGridColumn[] = QuickPriceGridColumnConfiguration;
  firstDayOfMonth: Date;
  rates: KendoDropDownItem[] = Rates;
  selectedRate: KendoDropDownItem = { Name: RateType.Annual, Value: RateType.Annual };
  marketDataChange: boolean;
  workflowContext: WorkflowContext;
  comphubPages = ComphubPages;

  // Observables
  jobResults$: Observable<JobGridData>;
  jobResultsLoading$: Observable<boolean>;
  jobResultsLoadingError$: Observable<boolean>;
  selectedJobTitle$: Observable<string>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedJobData$: Observable<JobData>;
  marketDataChange$: Observable<boolean>;
  peerBannerOpen$: Observable<boolean>;
  workflowContext$: Observable<WorkflowContext>;

  // Subscriptions
  jobTitleSubscription: Subscription;
  paymarketSubscription: Subscription;
  selectedPageIdSubscription: Subscription;
  selectedJobSubscription: Subscription;
  marketDataChangeSubscription: Subscription;
  workflowContextSubscription: Subscription;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    public winRef: WindowRef
  ) {
    this.jobResults$ = this.store.select(fromComphubMainReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.marketDataChange$ = this.store.select(fromComphubMainReducer.getMarketDataChange);
    this.peerBannerOpen$ = this.store.select(fromComphubMainReducer.getPeerBannerOpen);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);

    this.firstDayOfMonth = DataCardHelper.firstDayOfMonth();
  }

  ngOnInit(): void {
    this.jobTitleSubscription = this.selectedJobTitle$.subscribe(t => this.jobTitle = t);
    this.paymarketSubscription = this.selectedPaymarket$.subscribe(p => {
      if (!!p) {
        this.paymarketId = p.CompanyPayMarketId;
      }
    });

    this.marketDataChangeSubscription = this.marketDataChange$.subscribe(isChanged => this.marketDataChange = isChanged);
    this.selectedJobSubscription = this.selectedJobData$.subscribe(j => this.jobDataSelection = j);
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      this.workflowContext = wfc;
      this.onWorkflowContextChanges(wfc);
    });
  }

  handlePageChange(newPageNumber: number): void {
    this.gridContext = {
      skip: (newPageNumber - 1) * this.pageSize,
      take: this.pageSize,
      sortBy: this.gridContext.sortBy
    };
    this.loadJobResults();
  }

  handleSortChange(field: string): void {
    if (this.isSortSupported(field)) {
      this.gridContext = {
        skip: this.gridContext.skip,
        take: this.gridContext.take,
        sortBy: this.updateSortFieldAndDirection(field)
      };
      this.loadJobResults();
    }
  }

  handleExpandJdClicked(clickEvent: MouseEvent, jobId: number) {
    clickEvent.stopPropagation();
    this.store.dispatch(new fromDataCardActions.ToggleJobDescription({ jobId }));
  }

  handleSelectionChanged(job: JobData) {
    this.store.dispatch(new fromDataCardActions.SetSelectedJobData(job));
  }

  handleRateSelectionChange(item: KendoDropDownItem) {
    const selectedRate = RateType[item.Value];
    this.store.dispatch(new fromDataCardActions.SetSelectedRate(selectedRate));
  }

  handleLearnMoreClicked() {
    this.winRef.nativeWindow.open('https://payfactors.com/product-peer/');
  }

  trackByFn(index: number, jobData: JobData) {
    return jobData.JobId * (jobData.ShowJd ? 1 : -1);
  }

  updateSortFieldAndDirection(field: string): SortDescriptor {
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

  loadJobResults(): void {
    this.store.dispatch(new fromDataCardActions.GetQuickPriceMarketData({
      JobTitleShort: this.jobTitle,
      CompanyPayMarketId: this.paymarketId,
      Take: this.gridContext.take,
      Skip: this.gridContext.skip,
      Sort: this.gridContext.sortBy
    })
    );
  }

  get isHourly(): boolean {
    return (this.selectedRate.Value === RateType.Hourly);
  }

  calculateDataByRate(value: number): number {
    return this.isHourly
      ? DataCardHelper.calculateDataByHourlyRate(value)
      : value;
  }

  private isSortSupported(sortField: string): boolean {
    return this.gridColumnsConfiguration.some(c => c.IsSortable && c.SortField === sortField);
  }

  private resetGridContext(): void {
    this.gridContext = {
      skip: 0,
      take: this.pageSize,
      sortBy: null
    };
    this.currentPageNumber = 1;
  }

  ngOnDestroy(): void {
    this.jobTitleSubscription.unsubscribe();
    this.paymarketSubscription.unsubscribe();
    this.selectedPageIdSubscription.unsubscribe();
    this.selectedJobSubscription.unsubscribe();
    this.marketDataChangeSubscription.unsubscribe();
    this.workflowContextSubscription.unsubscribe();
  }

  onWorkflowContextChanges(workflowContext: WorkflowContext): void {
    if (workflowContext.selectedPageId === ComphubPages.Data) {
      this.store.dispatch(new fromDataCardActions.CardOpened());

      if (this.marketDataChange) {
        this.resetGridContext();
        this.loadJobResults();
      }
    }
  }
}
