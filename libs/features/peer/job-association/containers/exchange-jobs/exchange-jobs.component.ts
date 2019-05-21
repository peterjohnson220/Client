import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, GridComponent, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { InputDebounceComponent } from 'libs/forms/components';
import * as fromJobAssociationReducers from '../../reducers';
import { GenericMenuItem, GridTypeEnum } from 'libs/models/common';
import * as exchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { CompanyJob, ExchangeJob, ExchangeJobAssociation } from '../../models';
import { CompanyJobMapping } from 'libs/models/peer';
import { MultiSelectComponent } from 'libs/ui/common/content/multi-select/multi-select.component';

@Component({
  selector: 'pf-peer-job-association-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit, OnDestroy {
  @ViewChild('multiSelectJobFamily') public multiSelectJobFamily: MultiSelectComponent;
  @ViewChild('multiSelectExchange') public multiSelectExchange: MultiSelectComponent;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(InputDebounceComponent) public jobTitleSearchComponent: InputDebounceComponent;
  @ViewChild(GridComponent) public grid: GridComponent;

  // Observables
  exchangeJobs$: Observable<GridDataResult>;
  totalPeerExchangeJobs$: Observable<number>;
  gridState$: Observable<State>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  badRequestError$: Observable<string>;
  selectedCompanyJobs$: Observable<CompanyJob[]>;
  exchangeJobAssociations$: Observable<ExchangeJobAssociation[]>;
  selectedExchangeJob$: Observable<ExchangeJob>;
  isDetailPanelExpanded$: Observable<boolean>;
  jobFamilyFilterOptions$: Observable<GenericMenuItem[]>;
  selectedJobFamilyFilterOptions$: Observable<GenericMenuItem[]>;
  exchangeFilterOptions$: Observable<GenericMenuItem[]>;
  selectedExchangeFilterOptions$: Observable<GenericMenuItem[]>;

  // Observables, previous associations
  previousAssociations$: Observable<CompanyJob[]>;
  previousAssociationsToDelete$: Observable<number[]>;
  loadingPreviousAssociations$: Observable<boolean>;
  loadingPreviousAssociationsSuccess$: Observable<boolean>;
  loadingPreviousAssociationsError$: Observable<boolean>;

  // Subscriptions
  allSubscriptions: Subscription = new Subscription();

  // Properties
  maxAssociableThreshold: number;
  searchTerm = '';
  badRequestError: string;
  selectedCompanyJobs: CompanyJob[];
  exchangeJobAssociations: ExchangeJobAssociation[];
  selectedExchangeJob: ExchangeJob;
  expandedDetailRowId: number;
  exchangeJobs: ExchangeJob[];

  // Properties, filters
  jobFamilyFilterOptions: GenericMenuItem[];
  selectedJobFamilies: GenericMenuItem[];
  exchangeFilterOptions: GenericMenuItem[];
  selectedExchanges: GenericMenuItem[];

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  ngOnInit() {
    // Set properties
    this.maxAssociableThreshold = 10;

    // Register Observables
    this.loading$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoading));
    this.loadingError$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoadingError));
    this.exchangeJobs$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsData));
    this.totalPeerExchangeJobs$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsTotal));
    this.gridState$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsGridState));
    this.selectedCompanyJobs$ = this.store.pipe(select(fromJobAssociationReducers.getSelectedCompanyJobs));
    this.exchangeJobAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations));
    this.selectedExchangeJob$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsSelectedExchangeJob));
    this.isDetailPanelExpanded$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsIsDetailPanelExpanded));
    this.badRequestError$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoadingBadRequestError));

    // Register Observables, filters
    this.jobFamilyFilterOptions$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobFamilyFilterOptions));
    this.selectedJobFamilyFilterOptions$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeSelectedJobFamilies));

    this.exchangeFilterOptions$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobExchangeFilterOptions));
    this.selectedExchangeFilterOptions$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeSelectedJobExchangeFilterOptions));

    // Register Observables, previous associations
    this.previousAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getPreviousAssociations));
    this.previousAssociationsToDelete$ = this.store.pipe(select(fromJobAssociationReducers.getPreviousAssociationsToDelete));
    this.loadingPreviousAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getLoadingPreviousAssociations));
    this.loadingPreviousAssociationsSuccess$ = this.store.pipe(select(fromJobAssociationReducers.getLoadingPreviousAssociationsSuccess));
    this.loadingPreviousAssociationsError$ = this.store.pipe(select(fromJobAssociationReducers.getLoadingPreviousAssociationsError));

    // Register Subscriptions
    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsSearchTerm))
      .subscribe((searchTerm) => {
        // when reducer value changes sync the input's content to prevent the search value persisting when modal opened/closed
        this.jobTitleSearchComponent.writeValue(searchTerm);
        this.searchTerm = searchTerm;
      }));

    this.allSubscriptions.add(this.selectedCompanyJobs$
      .subscribe((selectedCompanyJobs) => this.selectedCompanyJobs = selectedCompanyJobs));

    this.allSubscriptions.add(this.exchangeJobAssociations$
      .subscribe((exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations));

    this.allSubscriptions.add(this.selectedExchangeJob$
      .subscribe((selectedExchangeJob) => this.selectedExchangeJob = selectedExchangeJob));

    this.allSubscriptions.add(this.badRequestError$
      .subscribe((badRequestError) => this.badRequestError = badRequestError));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsExpandedDetailRowId))
      .subscribe((expandedDetailRowId) => this.expandedDetailRowId = expandedDetailRowId));

    this.allSubscriptions.add(this.exchangeJobs$
      .subscribe((exchangeJobs) => this.exchangeJobs = exchangeJobs.data));

    this.allSubscriptions.add(this.jobFamilyFilterOptions$.subscribe(v => {
      this.jobFamilyFilterOptions =  v.map(f => ({DisplayName: f.DisplayName, Value: f.Value, IsSelected: f.IsSelected}));
    }));

    this.allSubscriptions.add(this.selectedJobFamilyFilterOptions$.subscribe(selectedJobFamilies => {
      this.selectedJobFamilies = selectedJobFamilies;
    }));

    this.allSubscriptions.add(this.exchangeFilterOptions$.subscribe(v => {
      this.exchangeFilterOptions =  v.map(f => ({DisplayName: f.DisplayName, Value: f.Value, IsSelected: f.IsSelected}));
    }));

    this.allSubscriptions.add(this.selectedExchangeFilterOptions$.subscribe( selectedExchangeFilterOptions => {
      this.selectedExchanges = selectedExchangeFilterOptions;
    }));

    // if the modal is closed and a row is expanded close the expanded row to prevent potentially unlisted associations
    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalIsOpen)).subscribe(isOpen => {
      if (!isOpen) {
        this.collapseDetailRow();
      }
    }));

    this.allSubscriptions.add(this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoading)).subscribe(() => {
      this.collapseDetailRow();
    }));

    this.allSubscriptions.add(
      this.store.pipe(select(fromJobAssociationReducers.getJobAssociationModalSavingSuccess)).subscribe((isSuccess) => {
        if (isSuccess) {
          this.collapseDetailRow();
        }
      })
    );
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  reload(): void {
    this.store.dispatch(new exchangeJobsActions.Reset());
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  showGridTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  collapseDetailRow(): void {
    if (this.expandedDetailRowId !== null) {
      this.grid.collapseRow(this.expandedDetailRowId);
    }
  }

  // event handlers
  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalPeerExchangeJobs, state));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  handleDetailExpand(event: any): void {
    // close the slide in detail panel when expanding a detail row, then close the currently open row if available
    this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
    this.collapseDetailRow();

    // send the company job mappings so they can be used in the xhr, plus the event index so we know which row is currently open
    const CompanyJobMappings = event.dataItem.CompanyJobMappings as CompanyJobMapping[];
    const ExpandedDetailRowId = event.index;
    this.store.dispatch(new exchangeJobsActions.LoadPreviousAssociations({ CompanyJobMappings, ExpandedDetailRowId }));
  }

  // filter handlers
  selectedJobFamilyOptionsChanged() {
    this.store.dispatch(new exchangeJobsActions.SelectedJobFamiliesChanged(this.selectedJobFamilies));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  selectedExchangeOptionsChanged() {
    this.store.dispatch(new exchangeJobsActions.SelectedExchangesChanged(this.selectedExchanges));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  handleJobFamilyFilterToggle() {
    if (this.multiSelectJobFamily.isExpanded) {
      this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
    }
  }

  handleExchangeFilterToggle() {
    if (this.multiSelectExchange.isExpanded) {
      this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
    }
  }

  handleExchangeJobClick(exchangeJob: ExchangeJob) {
    this.store.dispatch(new exchangeJobsActions.SelectExchangeJob(exchangeJob));
  }

  handleCloseDetailPanel() {
    this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
  }

  handleJobTitleFilterChanged(searchTerm: string): void {
    if (searchTerm === this.searchTerm) {
      return;
    }

    this.store.dispatch(new exchangeJobsActions.UpdateSearchTerm(searchTerm));
    if (!searchTerm || searchTerm.length >= 2) {
      this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalPeerExchangeJobs, { skip: 0 } as PageChangeEvent));
      this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
    }
  }

  // close the detail panel when the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
      this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
    }
  }

  handleAssociateClick({ ExchangeId, ExchangeJobId, CompanyJobMappings }, index: number): void {
    if (this.isAssociable(ExchangeId, ExchangeJobId)) {
      this.store.dispatch(new exchangeJobsActions.AddAssociation({ ExchangeId, ExchangeJobId, CompanyJobs: this.selectedCompanyJobs }));
      this.grid.expandRow(index);

      // if it's not already open, pass in matching params for what kendo sends on an expand triggered by clicking the > button
      if (this.expandedDetailRowId !== index) {
        this.handleDetailExpand({ index, dataItem: { CompanyJobMappings } });
      }
    }
  }

  handleRemoveAssociateClick(exchangeId: number, exchangeJobId: number, companyJobId: number): void {
    this.store.dispatch(new exchangeJobsActions.RemoveAssociation(exchangeId, exchangeJobId, companyJobId));
  }

  getCompanyJobIdFromExchangeJobToCompanyJobIds(exchangeJobToCompanyJobIds: number[], { CompanyJobMappings }): number[] {
    return CompanyJobMappings.filter(
      x => exchangeJobToCompanyJobIds.indexOf(x.ExchangeJobToCompanyJobId) >= 0).map(x => x.CompanyJobId);
  }

  handleRemovePreviousAssociationClick(dataItem: any, companyJobId: number): void {
    const CompanyJobMappings = dataItem.CompanyJobMappings as CompanyJobMapping[];
    const mapping = CompanyJobMappings.find(x => x.CompanyJobId === companyJobId);
    this.store.dispatch(new exchangeJobsActions.RemovePreviousAssociation(mapping.ExchangeJobToCompanyJobId));
  }

  handleUndoRemovePreviousAssociationClick(dataItem: any, companyJobId: number): void {
    const CompanyJobMappings = dataItem.CompanyJobMappings as CompanyJobMapping[];
    const mapping = CompanyJobMappings.find(x => x.CompanyJobId === companyJobId);
    this.store.dispatch(new exchangeJobsActions.UndoRemovePreviousAssociation(mapping.ExchangeJobToCompanyJobId));
  }

  // validation/business logic
  isAssociable(exchangeId: number, exchangeJobId: number): boolean {
    let isAssociable = false;
    if (this.hasSelectedCompanyJobs() &&
        this.selectedCompanyJobAreUniqueToExchange(exchangeId) &&
        this.selectedCompanyJobsAndAssociatedExchangeJobAreLessThanLimit(exchangeId, exchangeJobId) ) {
      isAssociable = true;
    }
    return isAssociable;
  }

  hasSelectedCompanyJobs(): boolean {
    return this.selectedCompanyJobs.length > 0;
  }

  selectedCompanyJobAreUniqueToExchange(exchangeId: number): boolean {
    const exchangeJobAssociations = this.exchangeJobAssociations.filter((x) => x.ExchangeId === exchangeId);
    const isUnique = true;

    if (exchangeJobAssociations.length === 0) {
      return isUnique;
    }

    const selectedCompanyJobIds = this.selectedCompanyJobs.map(x => x.CompanyJobId).sort();

    for (const exchangeJobAssociation of exchangeJobAssociations) {
      for (const companyJobId of exchangeJobAssociation.CompanyJobs.map(cj => cj.CompanyJobId).sort()) {
        if (selectedCompanyJobIds.indexOf(companyJobId) >= 0) {
          return !isUnique;
        }
      }
    }
    return isUnique;
  }

  selectedCompanyJobsAndAssociatedExchangeJobAreLessThanLimit(exchangeId: number, exchangeJobId: number): boolean {
    let count = this.selectedCompanyJobs.length;
    count += this.getAssociationCount(exchangeId, exchangeJobId);
    count += this.getPreviouslyAssociatedExchangeJobCount(exchangeId, exchangeJobId);
    return count <= this.maxAssociableThreshold;
  }

  getAssociationCount(exchangeId: number, exchangeJobId: number): number {
    const exchangeJobAssociation = this.exchangeJobAssociations
        .filter((x) => x.ExchangeId === exchangeId && x.ExchangeJobId === exchangeJobId);

    if (exchangeJobAssociation.length <= 0) {
      return 0;
    }

    let totalAssociatedJobs = 0;
    for (let i = 0; i < exchangeJobAssociation.length; i++) {
      totalAssociatedJobs += exchangeJobAssociation[i].CompanyJobs.map((cj) => cj.CompanyJobId).length;
    }
    return totalAssociatedJobs;
  }

  getPreviouslyAssociatedExchangeJobCount(exchangeId: number, exchangeJobId: number): number {
    const exchangeJob = this.exchangeJobs.find((ej: ExchangeJob) => ej.ExchangeId === exchangeId && ej.ExchangeJobId === exchangeJobId);
    return exchangeJob.CompanyJobMappings.length;
  }

  getCompanyJobAssociations(exchangeId: number, exchangeJobId: number): CompanyJob[] {
    const companyJobs: CompanyJob[] = [];
    const exchangeJobAssociation = this.exchangeJobAssociations
        .filter((x) => x.ExchangeId === exchangeId && x.ExchangeJobId === exchangeJobId);

    if (exchangeJobAssociation.length <= 0) {
      return companyJobs;
    }

    for (let i = 0; i < exchangeJobAssociation.length; i++) {
      exchangeJobAssociation[i].CompanyJobs.forEach((cj) => companyJobs.push(cj));
    }
    return companyJobs;
  }

  createAssociateButtonTooltipText(exchangeId: number, exchangeJobId: number) {
    if (!this.selectedCompanyJobs.length) {
      return 'First select the company job you want to associate';
    } else if (this.isAssociable(exchangeId, exchangeJobId)) {
      return 'Click to associate';
    } else if (this.getAssociationCount(exchangeId, exchangeJobId) >= this.maxAssociableThreshold) {
      return 'Exchange jobs should not have more than 10 associations per exchange';
    }
    return 'A single company job can be associated to only 1 job per exchange';
  }
}
