import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { State } from '@progress/kendo-data-query';
import { PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AccordionCards, ComphubPages } from '../../../data';
import * as fromDataPageActions from '../../../actions/data-page.actions';
import * as fromComphubMainReducer from '../../../reducers';

@Component({
  selector: 'pf-data-page',
  templateUrl: './data.page.component.html',
  styleUrls: ['./data.page.component.scss']
})
export class DataPageComponent implements OnInit, OnDestroy {
  state: State = {
    skip: 0,
    take: 10
  };
  jobTitle: string;
  paymarketId?: number;

  // observables
  jobResults$: Observable<GridDataResult>;
  jobResultsLoading$: Observable<boolean>;
  jobResultsLoadingError$: Observable<boolean>;
  selectedJobTitle$: Observable<string>;
  selectedPaymarket$: Observable<number>;
  selectedPageIndex$: Observable<number>;

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
      take: take
    };
    this.loadJobResults();
  }

  loadJobResults(): void {
    this.store.dispatch(new fromDataPageActions.GetQuickPriceMarketData({
      JobTitleShort: this.jobTitle,
      CompanyPayMarketId: this.paymarketId,
      Take: this.state.take,
      Skip: this.state.skip
    })
    );
  }

  ngOnDestroy(): void {
    this.jobTitleSubscription.unsubscribe();
    this.paymarketSubscription.unsubscribe();
    this.selectedIndexSubscription.unsubscribe();
  }
}
