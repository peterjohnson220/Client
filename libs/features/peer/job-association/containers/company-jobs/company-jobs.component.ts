// angular core
import { Component, OnInit, ViewChild } from '@angular/core';

// 3rd party
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

// Payfactors
import { GridTypeEnum } from '../../../../../models/common';
import * as fromCompanyJobsReducer from '../../reducers';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';

@Component({
  selector: 'pf-peer-job-association-company-jobs',
  templateUrl: './company-jobs.component.html',
  styleUrls: ['./company-jobs.component.scss']
})
export class CompanyJobsComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  companyJobsGridItemsData$: Observable<GridDataResult>;
  totalCompanyJobsGridItems$: Observable<number>;
  gridState$: Observable<State>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;


  constructor(private store: Store<fromCompanyJobsReducer.State>) {}

  ngOnInit() {
    this.companyJobsGridItemsData$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsData);
    this.totalCompanyJobsGridItems$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsTotal);
    this.gridState$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsGridState);
    this.loading$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsLoading);
    this.loadingError$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsLoadingError);
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  public showTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  reload(): void {
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, state));
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }
}

