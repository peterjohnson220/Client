import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import { GridTypeEnum } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as companyJobsReducer from '../../reducers';

@Component({
  selector: 'pf-company-jobs-grid',
  templateUrl: './company-jobs-grid.component.html',
  styleUrls: ['./company-jobs-grid.component.scss']
})

export class CompanyJobsGridComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;

  companyJobsGridData$: Observable<GridDataResult>;
  companyJobsGridState$: Observable<State>;
  loadingGrid$: Observable<boolean>;
  loadingGridError$: Observable<boolean>;
  loadingGridErrorMessage$: Observable<string>;

  allSubscriptions: Subscription = new Subscription();

  companyJobsGridState: State;
  gridFilter: CompositeFilterDescriptor;

  constructor(private store: Store<companyJobsReducer.State>) { }

  ngOnInit() {
    this.companyJobsGridData$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsData));
    this.companyJobsGridState$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsGridState));
    this.loadingGrid$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoading));
    this.loadingGridError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoadingError));
    this.loadingGridErrorMessage$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoadingErrorMessage));

    this.allSubscriptions.add(this.companyJobsGridState$.subscribe(gridState => {
      this.companyJobsGridState = cloneDeep(gridState);
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsGridState)).subscribe(gridState => {
      this.gridFilter = gridState.filter;
    }));

    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.PeerManageCompanyJobs, state));

    // reset back to page 1 when the filters change to avoid staying on page 2 when results change to consume only 1 page
    if (!isEqual(state.filter, this.gridFilter)) {
      this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.PeerManageCompanyJobs, { skip: 0 } as PageChangeEvent));
    }

    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  reloadGrid() {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.PeerManageCompanyJobs, { skip: 0 } as PageChangeEvent));
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  showGridTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

}
