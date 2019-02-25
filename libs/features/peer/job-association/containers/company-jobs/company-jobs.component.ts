// angular core
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

// 3rd party
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { DataStateChangeEvent, GridComponent, GridDataResult, RowArgs, SelectAllCheckboxState
} from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

// Payfactors
import { GridTypeEnum } from '../../../../../models/common';
import { InputDebounceComponent } from '../../../../../forms/components/input-debounce';
import * as fromJobAssociationReducers from '../../reducers';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { CompanyJob, ExchangeJobAssociation } from '../../models';

@Component({
  selector: 'pf-peer-job-association-company-jobs',
  templateUrl: './company-jobs.component.html',
  styleUrls: ['./company-jobs.component.scss']
})
export class CompanyJobsComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(InputDebounceComponent) public companyJobSearchComponent: InputDebounceComponent;
  @ViewChild(GridComponent) public grid: GridComponent;

  // Observables
  companyJobsGridItemsData$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  totalCompanyJobsGridItems$: Observable<number>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  exchangeJobAssociations$: Observable<ExchangeJobAssociation[]>;

  // Subscriptions
  companyJobsGridItemsDataSubscription: Subscription;
  exchangeJobAssociationsSubscription: Subscription;
  searchTermSubscription: Subscription;

  // Properties
  companyJobGridDataResult: GridDataResult;
  exchangeJobAssociations: ExchangeJobAssociation[];
  maxSelectionThreshold: number;
  selectedCompanyJobIds: CompanyJob[] = [];
  searchTerm;

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  ngOnInit() {
    this.maxSelectionThreshold = 10;

    this.companyJobsGridItemsData$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData));
    this.totalCompanyJobsGridItems$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsTotal));
    this.gridState$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsGridState));
    this.loading$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoading));
    this.loadingError$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoadingError));
    this.exchangeJobAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations));

    this.searchTermSubscription =
        this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSearchTerm)).subscribe(
            (searchTerm) => this.searchTerm = searchTerm);

    this.companyJobsGridItemsDataSubscription =
        this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData)).subscribe(
            (gridDataResult) => this.companyJobGridDataResult = gridDataResult);

    this.exchangeJobAssociationsSubscription = this.exchangeJobAssociations$.subscribe(
            (exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations);

    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  ngOnDestroy() {
    this.companyJobsGridItemsDataSubscription.unsubscribe();
    this.exchangeJobAssociationsSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
  }

  reload(resetSearchTerm = false): void {
    // if this is invoked from an empty search results grid reset the term, otherwise keep the term as is and reload
    if (resetSearchTerm) {
      this.companyJobSearchComponent.clearValue();
    } else {
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  showTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.tagName.toLowerCase() === 'div') {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, state));
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  handleSearchChanged(searchTerm: string) {
    this.store.dispatch(new companyJobsActions.SearchTermUpdated(searchTerm));
    if (!searchTerm  || searchTerm.length > 1) {
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  handleDetailExpand(event: any): void {
    // determine how many results we have in the grid
    const gridData = this.grid.data as any;
    const totalRows = gridData.data.length;

    // collapse all rows that are not the newly expanded row so we only have one detail open at a time
    for (let i = 0; i < totalRows; i++) {
      if (i !== event.index) {
        this.grid.collapseRow(i);
      }
    }
  }

  handleSelectAllClick(): void {
    const selectAllCheckboxState = this.getSelectAllState();
    if (selectAllCheckboxState === 'unchecked') {
      this.selectedCompanyJobIds = this.selectedCompanyJobIdsUptoThreshold();
    } else if (selectAllCheckboxState === 'checked' || selectAllCheckboxState === 'indeterminate' ) {
      this.selectedCompanyJobIds = [];
    }
    this.dispatchSelectCompanyJobs();
  }

  selectedCompanyJobIdsUptoThreshold() {
    return this.companyJobGridDataResult.data.slice(0, this.maxSelectionThreshold);
  }

  getSelectAllState(): SelectAllCheckboxState {
    if (!this.thereAreSelectedRows()) {
      return 'unchecked';
    } else if (this.hasMetMaxSelectableRowsThreshold() || this.resultsEqualSelected()) {
      return 'checked';
    } else {
      return 'indeterminate';
    }
  }

  handleSelectionChange(event: any): void {
    if (event.selectedRows.length > 0 && !this.hasMetMaxSelectableRowsThreshold()) {
        event.selectedRows.forEach((row) => {
          this.selectedCompanyJobIds.push(row.dataItem);
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row) => {
        this.selectedCompanyJobIds = this.selectedCompanyJobIds
                .filter((companyJob) => companyJob.CompanyJobId !== row.dataItem.CompanyJobId);
      });
    }
    this.dispatchSelectCompanyJobs();
  }

  dispatchSelectCompanyJobs(): void {
     const companyJobsToDispatch: CompanyJob[] = [];
     this.selectedCompanyJobIds.forEach((companyJob) => companyJobsToDispatch.push({
       CompanyJobId: companyJob.CompanyJobId,
       JobTitle: companyJob.JobTitle,
       IsAssociated: companyJob.IsAssociated,
       JobFamily: companyJob.JobFamily,
       JobCode: companyJob.JobCode
     }));
    this.store.dispatch(new companyJobsActions.SelectCompanyJobs(companyJobsToDispatch));
  }

  isPendingAssociation(companyJobId: number): boolean {
    let isAssociated = false;
    this.exchangeJobAssociations.forEach((eja) => {
      if (eja.CompanyJobs.map(cj => cj.CompanyJobId).sort().indexOf(companyJobId) >= 0) {
        isAssociated = true;
        return;
      }
    });
    return isAssociated;
  }

  isRowSelected = (e: RowArgs) => this.selectedCompanyJobIds
      .map(scj => scj.CompanyJobId).indexOf(e.dataItem.CompanyJobId) >= 0

  hasMetMaxSelectableRowsThreshold(): boolean {
    if (!this.selectedCompanyJobIds) {
      return false;
    }
    return (this.selectedCompanyJobIds.length > 0 && this.selectedCompanyJobIds.length === this.maxSelectionThreshold);
  }

  thereAreSelectedRows(): boolean {
    return this.selectedCompanyJobIds.length > 0;
  }

  resultsEqualSelected(): boolean {
    return (this.selectedCompanyJobIds.length > 0 &&
        this.companyJobGridDataResult.total === this.selectedCompanyJobIds.length);
  }
}

