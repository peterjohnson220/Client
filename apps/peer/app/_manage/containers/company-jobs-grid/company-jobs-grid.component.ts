import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import { GridTypeEnum } from 'libs/models';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
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
  selectedCompanyJob$: Observable<CompanyJob>;

  allSubscriptions: Subscription = new Subscription();

  exchangeId: number;
  companyJobsGridState: State;
  gridFilter: CompositeFilterDescriptor;
  pageRowIndexToScrollTo: number;
  selectedCompanyJob: CompanyJob;
  statusFilterOptions: any[] = [
    {StatusName: 'Matched', StatusId: 'matched'},
    {StatusName: 'Not Matched', StatusId: 'not-matched'},
    {StatusName: 'Pending Review', StatusId: 'pending-review'}];
  selectedStatusFilterOption: any;

  // only highlight the selected row if we a) have a job selected, and b) the row's CompanyJob matches the one selected
  public isRowSelected = (e: any) => this.selectedCompanyJob && e.dataItem.CompanyJobId === this.selectedCompanyJob.CompanyJobId;

  constructor(private store: Store<companyJobsReducer.State>) { }

  ngOnInit() {
    this.companyJobsGridData$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsData));
    this.companyJobsGridState$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsGridState));
    this.loadingGrid$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoading));
    this.loadingGridError$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoadingError));
    this.loadingGridErrorMessage$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsLoadingErrorMessage));
    this.selectedCompanyJob$ = this.store.pipe(select(companyJobsReducer.getCompanyJobsSelectedCompanyJob));

    this.allSubscriptions.add(this.companyJobsGridState$.subscribe(gridState => {
      this.companyJobsGridState = cloneDeep(gridState);
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsGridState)).subscribe(gridState => {
      this.gridFilter = gridState.filter;
      this.clearSelectedStatusFilter();
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsPageRowIndexToScrollTo)).subscribe(pageRowIndex => {
      this.pageRowIndexToScrollTo = pageRowIndex;
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsSelectedCompanyJob)).subscribe(selectedCompanyJob => {
      this.selectedCompanyJob = selectedCompanyJob;
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeId)).subscribe(exchangeId => {
      this.exchangeId = exchangeId;
    }));

    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  ngOnDestroy() {
    this.store.dispatch(new companyJobsActions.Reset());
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

  handleCellClick({ dataItem, rowIndex }) {
    // bail if user selects currently selected since there's nothing to do
    if (this.selectedCompanyJob && this.selectedCompanyJob.CompanyJobId === dataItem.CompanyJobId) {
      return;
    }

    const pageRowIndex = rowIndex - this.companyJobsGridState.skip;
    this.store.dispatch(new companyJobsActions.UpdatePageRowIndexToScrollTo(pageRowIndex));

    // if the job is associated fetch the exchange job details, otherwise kick off a search based on the company job's title
    if (dataItem.IsAssociated) {
      this.store.dispatch(new companyJobsActions.LoadMappedExchangeJobs(dataItem.CompanyJobId));
    } else {
      this.store.dispatch(new companyJobsActions.UpdateExchangeJobsTitleSearchTerm(dataItem.JobTitle));
      this.store.dispatch(new companyJobsActions.UpdateExchangeJobsDescriptionSearchTerm(null));
      this.store.dispatch(new companyJobsActions.SearchExchangeJobs());
    }

    // need to wait a turn here so the scroll directive can run as enabled before the indicator to disable (a company job) is set
    setTimeout(() => this.store.dispatch(new companyJobsActions.SetSelectedCompanyJob(dataItem)), 0);
  }

  reloadGrid() {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.PeerManageCompanyJobs));
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

  onStatusFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{ field: 'StatusId', operator: 'eq', value: value }],
      logic: 'and'
    });
  }

  clearSelectedStatusFilter(): void {
    const statusIdFilter: any = this.gridFilter.filters.find((f: FilterDescriptor) => f.field === 'StatusId');
    if (!statusIdFilter) {
      this.selectedStatusFilterOption = null;
    } else if (statusIdFilter.value !== this.selectedStatusFilterOption) {
      this.selectedStatusFilterOption = statusIdFilter.value;
    }
  }
}
