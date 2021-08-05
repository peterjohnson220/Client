import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { AbstractJobGrid } from '../../../../_shared/containers/job-grid/shared-job-grid';
import { JobGridComponent } from '../../../../_shared/containers/job-grid/shared-job-grid';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';

@Component({
  selector: 'pf-market-data-job-results',
  templateUrl: './market-data-job-results.component.html'
})
export class MarketDataJobResultsComponent extends AbstractJobGrid implements OnInit, OnDestroy {
  @ViewChild(JobGridComponent, { static: true }) jobGrid: JobGridComponent;

  constructor(
    store: Store<fromComphubSharedReducer.State>,
  ) {
    super(store);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jobTitle => {
      this.jobTitle = jobTitle;
      this.resetGridContext();
      if (jobTitle?.length) {
        this.loadJobResults(this.gridContext);
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
