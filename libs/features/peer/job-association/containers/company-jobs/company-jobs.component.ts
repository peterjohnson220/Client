// angular core
import { Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';

// 3rd party
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { DataStateChangeEvent, GridComponent, GridDataResult, RowArgs, SelectAllCheckboxState, PageChangeEvent
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
  selectedCompanyJobInDetailPanel$: Observable<CompanyJob>;
  isDetailPanelExpanded$: Observable<boolean>;

  // Subscriptions
  companyJobsGridItemsDataSubscription: Subscription;
  exchangeJobAssociationsSubscription: Subscription;
  selectedCompanyJobsSubscription: Subscription;
  searchTermSubscription: Subscription;
  selectedCompanyJobInDetailPanelSubscription: Subscription;

  // Properties
  companyJobGridDataResult: GridDataResult;
  exchangeJobAssociations: ExchangeJobAssociation[];
  maxSelectionThreshold: number;
  selectedCompanyJobIds: CompanyJob[];
  selectedCompanyJobInDetailPanel: CompanyJob;
  searchTerm: string;

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  ngOnInit() {
    this.maxSelectionThreshold = 10;

    this.companyJobsGridItemsData$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData));
    this.totalCompanyJobsGridItems$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsTotal));
    this.gridState$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsGridState));
    this.loading$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoading));
    this.loadingError$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoadingError));
    this.isDetailPanelExpanded$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsIsDetailPanelExpanded));
    this.selectedCompanyJobInDetailPanel$ =
      this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSelectedCompanyJobInDetailPanel));

    this.selectedCompanyJobsSubscription = this.store.pipe(select(fromJobAssociationReducers.getSelectedCompanyJobs))
      .subscribe((selectedCompanyJobs) => this.selectedCompanyJobIds = selectedCompanyJobs);

    this.companyJobsGridItemsDataSubscription =
        this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData)).subscribe(
            (gridDataResult) => this.companyJobGridDataResult = gridDataResult);

    this.exchangeJobAssociationsSubscription =
      this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations)).subscribe(
            (exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations);

    this.searchTermSubscription =
      this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSearchTerm)).subscribe(
        (searchTerm) => this.searchTerm = searchTerm);

    this.selectedCompanyJobInDetailPanelSubscription =
      this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSelectedCompanyJobInDetailPanel)).subscribe(
        (selectedCompanyJobInDetailPanel) => this.selectedCompanyJobInDetailPanel = selectedCompanyJobInDetailPanel);

    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  ngOnDestroy() {
    this.companyJobsGridItemsDataSubscription.unsubscribe();
    this.exchangeJobAssociationsSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
    this.selectedCompanyJobsSubscription.unsubscribe();
    this.selectedCompanyJobInDetailPanelSubscription.unsubscribe();
  }

  reload(resetSearchTerm = false): void {
    // if this is invoked from an empty search results grid reset the term, otherwise keep the term as is and reload
    if (resetSearchTerm) {
      this.companyJobSearchComponent.clearValue();
    } else {
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  showTooltip(e: any, id: string): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.id.includes(id)) {
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
      this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalCompanyJobs, { skip: 0 } as PageChangeEvent));
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  handleCompanyJobTitleOrCodeClick(companyJob: CompanyJob) {
    this.store.dispatch(new companyJobsActions.SelectJobTitleOrCode(companyJob));
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

  handleCloseDetailPanel() {
    this.store.dispatch(new companyJobsActions.CloseDetailPanel());
  }

  handleSelectAllClick(): void {
    let selectedCompanyJobs: CompanyJob[] = [];
    if (this.getSelectAllState() === 'unchecked') {
      selectedCompanyJobs = this.selectCompanyJobIdsUptoThreshold();
    }
    this.store.dispatch(new companyJobsActions.SelectCompanyJobs(selectedCompanyJobs));
  }

  selectCompanyJobIdsUptoThreshold(): CompanyJob[] {
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
    let selectedCompanyJobs = [...this.selectedCompanyJobIds];
    if (event.selectedRows.length > 0 && !this.hasMetMaxSelectableRowsThreshold()) {
        event.selectedRows.forEach((row) => {
          selectedCompanyJobs.push(row.dataItem);
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row) => {
        selectedCompanyJobs = selectedCompanyJobs
                .filter((companyJob) => companyJob.CompanyJobId !== row.dataItem.CompanyJobId);
      });
    }

    this.store.dispatch(new companyJobsActions.SelectCompanyJobs(selectedCompanyJobs));
  }

  // close the job family filter when the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
      this.store.dispatch(new companyJobsActions.CloseDetailPanel());
    }
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

  isRowSelected = (e: RowArgs) => this.isSelectedCompanyJob(e.dataItem.CompanyJobId);

  isSelectedCompanyJob(companyJobId: number): boolean {
    return this.selectedCompanyJobIds.map(scj => scj.CompanyJobId).indexOf(companyJobId) >= 0;
  }

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
