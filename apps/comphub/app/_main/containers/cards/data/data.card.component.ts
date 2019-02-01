import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { State, SortDescriptor } from '@progress/kendo-data-query';
import { PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AccordionCards, ComphubPages } from '../../../data';
import { JobData } from '../../../models';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubMainReducer from '../../../reducers';

@Component({
  selector: 'pf-data-card',
  templateUrl: './data.card.component.html',
  styleUrls: ['./data.card.component.scss']
})
export class DataCardComponent implements OnInit, OnDestroy {
  state: State = {
    skip: 0,
    take: 10
  };
  jobTitle: string;
  paymarketId?: number;
  jobDataSelection: JobData;

  // observables
  jobResults$: Observable<GridDataResult>;
  jobResultsLoading$: Observable<boolean>;
  jobResultsLoadingError$: Observable<boolean>;
  selectedJobTitle$: Observable<string>;
  selectedPaymarket$: Observable<number>;
  selectedPageIndex$: Observable<number>;
  selectedJobData$: Observable<JobData>;

  // subscriptions
  jobTitleSubscription: Subscription;
  paymarketSubscription: Subscription;
  selectedIndexSubscription: Subscription;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.jobResults$ = this.store.select(fromComphubMainReducer.getJobGridResults);
    this.jobResultsLoading$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResults);
    this.jobResultsLoadingError$ = this.store.select(fromComphubMainReducer.getLoadingJobGridResultsError);
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedPageIndex$ = this.store.select(fromComphubMainReducer.getSelectedPageIndex);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
  }

  ngOnInit(): void {
    this.jobTitleSubscription = this.selectedJobTitle$.subscribe(t => this.jobTitle = t);
    this.paymarketSubscription = this.selectedPaymarket$.subscribe(p => this.paymarketId = p);
    this.selectedIndexSubscription = this.selectedPageIndex$.subscribe(pageIndex => {
        if (pageIndex === AccordionCards.findIndex(ac => ac.Id === ComphubPages.Data)) {
          this.loadJobResults();
        }
      });
  }

  handlePageChange({ skip, take }: PageChangeEvent): void {
    this.state = {
      skip: skip,
      take: take,
      sort: this.state.sort
    };
    this.loadJobResults();
  }

  handleSortChange(sort: SortDescriptor[]): void {
    this.state = {
      skip: this.state.skip,
      take: this.state.take,
      sort: sort
    };
    this.loadJobResults();
  }

  handleSelectionChanged() {
    this.store.dispatch(new fromDataCardActions.SetSelectedJobData(this.jobDataSelection));
  }

  loadJobResults(): void {
    this.store.dispatch(new fromDataCardActions.GetQuickPriceMarketData({
      JobTitleShort: this.jobTitle,
      CompanyPayMarketId: this.paymarketId,
      Take: this.state.take,
      Skip: this.state.skip,
      Sort: this.state.sort
    })
    );
  }

  ngOnDestroy(): void {
    this.jobTitleSubscription.unsubscribe();
    this.paymarketSubscription.unsubscribe();
    this.selectedIndexSubscription.unsubscribe();
  }
}
