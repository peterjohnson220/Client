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
import { CompanyJob, CompanyJobWithMatches, ExchangeJobAssociation } from '../../models';

@Component({
  selector: 'pf-peer-job-association-company-jobs',
  templateUrl: './company-jobs.component.html',
  styleUrls: ['./company-jobs.component.scss']
})
export class CompanyJobsComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  @ViewChild(InputDebounceComponent, { static: true }) public companyJobSearchComponent: InputDebounceComponent;
  @ViewChild(GridComponent, { static: true }) public grid: GridComponent;

  // Observables
  companyJobsGridItemsData$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  totalCompanyJobsGridItems$: Observable<number>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  selectedCompanyJobInDetailPanel$: Observable<CompanyJob>;
  isDetailPanelExpanded$: Observable<boolean>;
  badRequestError$: Observable<string>;

  jdmDescriptionIds$: Observable<number[]>;
  jdmDescriptionLoading$: Observable<boolean>;
  jdmDescriptionLoadingError$: Observable<boolean>;

  // Subscriptions
  allSubscriptions: Subscription = new Subscription();

  // Properties
  companyJobGridDataResult: GridDataResult;
  exchangeJobAssociations: ExchangeJobAssociation[];
  maxSelectionThreshold: number;
  selectedCompanyJobIds: CompanyJobWithMatches[];
  selectedCompanyJobInDetailPanel: CompanyJob;
  searchTerm = '';
  badRequestError: string;

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  ngOnInit() {
    this.maxSelectionThreshold = 50;

    this.companyJobsGridItemsData$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData));
    this.totalCompanyJobsGridItems$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsTotal));
    this.gridState$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsGridState));
    this.loading$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoading));
    this.loadingError$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoadingError));
    this.isDetailPanelExpanded$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsIsDetailPanelExpanded));
    this.selectedCompanyJobInDetailPanel$ =
      this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSelectedCompanyJobInDetailPanel));
    this.jdmDescriptionIds$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsJdmDescriptionIds));
    this.jdmDescriptionLoading$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsDownloadingJdmDescription));
    this.jdmDescriptionLoadingError$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsDownloadingJdmDescriptionError));
    this.badRequestError$ = this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsLoadingBadRequestError));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getSelectedCompanyJobs))
      .subscribe((selectedCompanyJobs) => this.selectedCompanyJobIds = selectedCompanyJobs));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsData)).subscribe(
            (gridDataResult) => this.companyJobGridDataResult = gridDataResult));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations)).subscribe(
            (exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSearchTerm)).subscribe(
        (searchTerm) => {
          // when reducer value changes sync the input's content to prevent the search value persisting when modal opened/closed
          this.companyJobSearchComponent.writeValue(searchTerm);
          this.searchTerm = searchTerm;
        }));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getCompanyJobsSelectedCompanyJobInDetailPanel)).subscribe(
        (selectedCompanyJobInDetailPanel) => this.selectedCompanyJobInDetailPanel = selectedCompanyJobInDetailPanel));

    this.allSubscriptions.add(this.badRequestError$
      .subscribe((badRequestError) => this.badRequestError = badRequestError));
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  reload(): void {
    this.store.dispatch(new companyJobsActions.Reset());
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  showGridTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, state));
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  handleSearchBoxValueChanged(searchTerm: string): void {
    if (searchTerm === this.searchTerm) {
      return;
    }

    this.store.dispatch(new companyJobsActions.UpdateSearchTerm(searchTerm));
    if (!searchTerm || searchTerm.length >= 2) {
      this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalCompanyJobs, { skip: 0 } as PageChangeEvent));
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  handleCompanyJobTitleOrCodeClick(companyJob: CompanyJob) {
    this.store.dispatch(new companyJobsActions.SelectJobTitleOrCode(companyJob));
  }

  handleCloseDetailPanel() {
    this.store.dispatch(new companyJobsActions.CloseDetailPanel());
  }

  handleViewJdmDescriptionClick() {
    this.store.dispatch(new companyJobsActions.DownloadJdmDescription());
  }

  handleSelectAllClick(): void {
    let selectedCompanyJobs: CompanyJobWithMatches[] = [];
    if (this.getSelectAllState() === 'unchecked') {
      selectedCompanyJobs = this.selectCompanyJobIdsUptoThreshold();
    }
    this.store.dispatch(new companyJobsActions.SelectCompanyJobsToAssociate(selectedCompanyJobs));
  }

  selectCompanyJobIdsUptoThreshold(): CompanyJobWithMatches[] {
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

    this.store.dispatch(new companyJobsActions.SelectCompanyJobsToAssociate(selectedCompanyJobs));
  }

  // close the job family filter when the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
      this.store.dispatch(new companyJobsActions.CloseDetailPanel());
    }
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
