import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PagingOptions } from 'libs/models/payfactors-api/search';
import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromJobBasedRangeReducer from '../reducers';
import { AddJobsModalComponent } from '../containers/add-jobs-modal';
import { JOB_BASED_RANGE_ADD_JOBS_MODAL_PAGE_WORKFLOW } from '../constants/add-jobs-modal.constants';

@Component({
  selector: 'pf-job-based-range-page',
  templateUrl: './job-based-range.page.html',
  styleUrls: ['./job-based-range.page.scss']
})
export class JobBasedRangePageComponent implements OnInit, AfterViewInit {
  @ViewChild('mid', {static: false}) midColumn: ElementRef;
  @ViewChild(AddJobsModalComponent, {static: false}) public AddJobsModalComponent: AddJobsModalComponent;

  pageTitle$: Observable<string>;

  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 10
  };
  colTemplates = {};
  filter: PfDataGridFilter;

  // todo: remove temporary fields once back-end implemented
  private readonly contextPaymarket: number;
  private readonly contextProjectId: number;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private route: ActivatedRoute
  ) {
    this.pageTitle$ = this.store.pipe(select(fromJobBasedRangeReducer.getPageTitle));

    // tslint:disable:no-bitwise
    this.contextPaymarket = route.snapshot.queryParams['Paymarket'] ? +(route.snapshot.queryParams['Paymarket']) : 109139;
    this.contextProjectId = route.snapshot.queryParams['ProjectId'] ? +(route.snapshot.queryParams['ProjectId']) : 768456;
    this.filter  = {
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
  }

  // Events
  handleAddJobsClicked() {
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

  ngAfterViewInit() {
    this.colTemplates = {
      ['Mid']: {Template: this.midColumn}
    };
  }
}

