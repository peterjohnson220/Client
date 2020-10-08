import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromJobGridActions from '../../../actions/job-grid.actions';
import { AbstractJobGrid } from '../shared-job-grid';
import { JobGridComponent } from '../shared-job-grid/job-grid.component';

@Component({
  selector: 'pf-market-data-job-grid',
  templateUrl: './market-data-job-grid.component.html'
})
export class MarketDataJobGridComponent extends AbstractJobGrid implements OnInit, OnDestroy {
  @ViewChild(JobGridComponent, { static: true }) jobGrid: JobGridComponent;

  constructor(
    store: Store<fromComphubMainReducer.State>
  ) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jobTitle => {
      this.jobTitle = jobTitle;
      this.jobGrid.resetGridContext();
      if (jobTitle?.length) {
        this.loadJobResults(this.defaultGridContext);
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.selectedJobTitleSubscription.unsubscribe();
  }

  loadJobResults(gridContext: any): void {
    this.store.dispatch(new fromJobGridActions.GetQuickPriceMarketData({
      JobTitleShort: this.jobTitle,
      CompanyPayMarketId: null,
      Take: gridContext.take,
      Skip: gridContext.skip,
      Sort: gridContext.sortBy
    }));
  }
}
