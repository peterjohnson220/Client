import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobBasedRangeReducer from '../reducers';
import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import { AddJobsModalComponent } from '../containers/add-jobs-modal';
import { JOB_BASED_RANGE_ADD_JOBS_MODAL_PAGE_WORKFLOW } from '../constants/add-jobs-modal.constants';
import { RangeGroupMetadata } from '../../shared/models';

@Component({
  selector: 'pf-model-page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy {
  @ViewChild(AddJobsModalComponent, {static: false}) public AddJobsModalComponent: AddJobsModalComponent;

  metaData$: Observable<RangeGroupMetadata>;
  filter: PfDataGridFilter;
  rangeGroupId: any;

  // todo: remove temporary fields once back-end implemented
  private readonly contextPaymarket: number;
  private readonly contextProjectId: number;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private route: ActivatedRoute
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filter  = {
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Value: this.rangeGroupId
    };

    // tslint:disable:no-bitwise
    this.contextPaymarket = route.snapshot.queryParams['Paymarket'] ? +(route.snapshot.queryParams['Paymarket']) : 109139;
    this.contextProjectId = route.snapshot.queryParams['ProjectId'] ? +(route.snapshot.queryParams['ProjectId']) : 768456;
  }

  // Events
  handleAddJobs() {
    this.store.dispatch(new fromAddJobsModalActions.OpenAddJobsModal(JOB_BASED_RANGE_ADD_JOBS_MODAL_PAGE_WORKFLOW));

    // note: ProjectId => UserSession_ID in [dbo].[UserSession]
    const jobBasedRangesAddJobsModalPageContext = {
      PayMarketId: this.contextPaymarket,
      ProjectId: this.contextProjectId
    };

    this.store.dispatch(new fromAddJobsPageActions.SetContext(jobBasedRangesAddJobsModalPageContext));
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }

  ngOnDestroy(): void {
    this.store.dispatch(new pfDataGridActions.Reset());
  }
}

