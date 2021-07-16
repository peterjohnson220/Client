import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { QuickPriceType } from 'libs/constants';

import { AbstractJobGrid } from '../../../_shared/containers/job-grid/shared-job-grid';
import { QuickPriceGridColumn, QuickPriceGridColumnConfiguration } from '../../../_shared/models';
import * as fromComphubSharedReducer from '../../../_shared/reducers';
import * as fromJobGridActions from '../../../_shared/actions/job-grid.actions';

@Component({
  selector: 'pf-crowd-sourced-job-results',
  templateUrl: './crowd-sourced-job-results.component.html',
  styleUrls: ['./crowd-sourced-job-results.component.scss']
})
export class CrowdSourcedJobResultsComponent extends AbstractJobGrid implements OnInit, OnDestroy  {
  gridConfig: QuickPriceGridColumn[];

  constructor(
    store: Store<fromComphubSharedReducer.State>,
  ) {
    super(store);
  }

  resetGridContext(): void {
    this.gridContext = {
      skip: 0,
      take: this.pageSize,
      sortBy: null
    };
  }

  handleExpandJobTasks(jobTitle: string) {
    this.store.dispatch(new fromJobGridActions.ToggleCrowdSourcedTasks({ jobTitle }));
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jobTitle => {
      this.jobTitle = jobTitle;
      this.resetGridContext();
    });

    // this is hardcoded and will need to be removed once crowd sourced is added to settings
    this.gridConfig = QuickPriceGridColumnConfiguration.getGridColumnConfigByType(QuickPriceType.CROWD_SOURCED_DATA);

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.selectedJobTitleSubscription.unsubscribe();
  }
}
