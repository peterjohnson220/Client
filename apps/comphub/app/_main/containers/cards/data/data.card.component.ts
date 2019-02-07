import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { AccordionCards, ComphubPages, Rates, RateType } from '../../../data';
import { JobData, PricingPaymarket, JobGridData, QuickPriceGridColumn, QuickPriceGridColumnConfiguration,
  KendoDropDownItem } from '../../../models';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { firstDayOfMonth } from '../../../helpers';

@Component({
  selector: 'pf-data-card',
  templateUrl: './data.card.component.html',
  styleUrls: ['./data.card.component.scss']
})
export class DataCardComponent implements OnInit, OnDestroy {
  jobTitle: string;
  paymarketId?: number;
  jobDataSelection: JobData;
  currentPageNumber = 1;
  pageSize = 10;
  gridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };
  gridColumnsConfiguration: QuickPriceGridColumn[] = QuickPriceGridColumnConfiguration;
  firstDayOfMonth: Date;
  rates: KendoDropDownItem[] = Rates;
  selectedRate: KendoDropDownItem = { Name: RateType.Annual, Value: RateType.Annual };

  // observables
  jobResults$: Observable<JobGridData>;
  jobResultsLoading$: Observable<boolean>;
  jobResultsLoadingError$: Observable<boolean>;
  selectedJobTitle$: Observable<string>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedPageIndex$: Observable<number>;
  selectedJobData$: Observable<JobData>;

  // subscriptions
  jobTitleSubscription: Subscription;
  paymarketSubscription: Subscription;
  selectedIndexSubscription: Subscription;
  selectedJobSubscription: Subscription;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.jobResults$ = this.store.select(fromComphubMainReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedPageIndex$ = this.store.select(fromComphubMainReducer.getSelectedPageIndex);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);

    this.firstDayOfMonth = firstDayOfMonth();
  }

  ngOnInit(): void {
    this.jobTitleSubscription = this.selectedJobTitle$.subscribe(t => this.jobTitle = t);
    this.paymarketSubscription = this.selectedPaymarket$.subscribe(p => {
      if (!!p) {
        this.paymarketId = p.CompanyPayMarketId;
      }
    });
    this.selectedIndexSubscription = this.selectedPageIndex$.subscribe(pageIndex => {
        if (pageIndex === AccordionCards.findIndex(ac => ac.Id === ComphubPages.Data)) {
          this.resetGridContext();
          this.loadJobResults();
        }
      });
    this.selectedJobSubscription = this.selectedJobData$.subscribe(j => this.jobDataSelection = j);
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

  handleSelectionChanged(job: JobData) {
    this.store.dispatch(new fromDataCardActions.SetSelectedJobData(job));
  }

  isChecked(job: JobData): boolean {
    return this.jobDataSelection && this.jobDataSelection.JobId === job.JobId;
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

  handleRateSelectionChange(value: any) {
    this.store.dispatch(new fromDataCardActions.SetSelectedRate(value));
  }

  get isHourly(): boolean {
    return (this.selectedRate.Value === RateType.Hourly);
  }

  calculateDataByRate(value: number): number {
    return this.isHourly ? ((value * 1000) / 2080) : value;
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
    this.selectedIndexSubscription.unsubscribe();
    this.selectedJobSubscription.unsubscribe();
  }
}
