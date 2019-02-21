import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GridTypeEnum } from 'libs/models/common';
import * as fromPeerJobsReducer from '../../reducers';
import * as peerExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';

@Component({
  selector: 'pf-peer-job-association-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  peerExchangeJobs$: Observable<GridDataResult>;
  totalPeerExchangeJobs$: Observable<number>;
  gridState$: Observable<State>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;

  constructor(private store: Store<fromPeerJobsReducer.State>) { }

  ngOnInit() {
    this.peerExchangeJobs$ = this.store.select(fromPeerJobsReducer.getExchangeJobsData);
    this.totalPeerExchangeJobs$ = this.store.select(fromPeerJobsReducer.getExchangeJobsTotal);
    this.gridState$ = this.store.select(fromPeerJobsReducer.getExchangeJobsGridState);
    this.loading$ = this.store.select(fromPeerJobsReducer.getExchangeJobsLoading);
    this.loadingError$ = this.store.select(fromPeerJobsReducer.getExchangeJobsLoadingError);

    this.store.dispatch(new peerExchangeJobsActions.LoadExchangeJobs());
  }

  reload(): void {
    this.store.dispatch(new peerExchangeJobsActions.LoadExchangeJobs());
  }

  showTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalPeerExchangeJobs, state));
    this.store.dispatch(new peerExchangeJobsActions.LoadExchangeJobs());
  }
}
