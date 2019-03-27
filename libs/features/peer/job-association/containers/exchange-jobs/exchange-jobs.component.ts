import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, GridComponent, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { InputDebounceComponent } from 'libs/forms/components';
import * as fromJobAssociationReducers from '../../reducers';
import { GridTypeEnum, GenericMenuItem } from 'libs/models/common';

import * as fromExchangeJobsReducer from '../../reducers';
import * as exchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { CompanyJob, ExchangeJob, ExchangeJobAssociation } from '../../models';

@Component({
  selector: 'pf-peer-job-association-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(InputDebounceComponent) public jobTitleSearchComponent: InputDebounceComponent;
  @ViewChild(GridComponent) public grid: GridComponent;

  // Observables
  exchangeJobs$: Observable<GridDataResult>;
  totalPeerExchangeJobs$: Observable<number>;
  gridState$: Observable<State>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  selectedCompanyJobs$: Observable<CompanyJob[]>;
  exchangeJobAssociations$: Observable<ExchangeJobAssociation[]>;
  gridResultsCount$: Observable<number>;
  selectedExchangeJob$: Observable<ExchangeJob>;
  isDetailPanelExpanded$: Observable<boolean>;

  // Subscriptions
  searchTermSubscription: Subscription;
  selectedCompanyJobsSubscription: Subscription;
  exchangeJobAssociationsSubscription: Subscription;
  selectedExchangeJobSubscription: Subscription;

  // Properties
  maxAssociableThreshold: number;
  isListView: boolean;
  isJobFamilyFilterExpanded: boolean;
  searchTerm: string;
  selectedCompanyJobs: CompanyJob[];
  exchangeJobAssociations: ExchangeJobAssociation[];
  selectedExchangeJob: ExchangeJob;

  // Job Family Filter
  isJobFamilyFilterExpandedSubscription: Subscription;
  isJobFamilyFilterExpanded$: Observable<boolean>;
  isJobFamilyFilterLoading$: Observable<boolean>;
  jobFamilyFilterOptions$: Observable<GenericMenuItem[]>;
  selectedJobFamilyOptionNames$: Observable<string[]>;

  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  ngOnInit() {
    // Set properties
    this.maxAssociableThreshold = 10;
    this.isListView = true;

    // Register Observables
    this.loading$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoading));
    this.loadingError$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsLoadingError));
    this.exchangeJobs$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsData));
    this.totalPeerExchangeJobs$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsTotal));
    this.gridState$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsGridState));
    this.selectedCompanyJobs$ = this.store.pipe(select(fromJobAssociationReducers.getSelectedCompanyJobs));
    this.exchangeJobAssociations$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobAssociations));
    this.gridResultsCount$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsResultsCount));
    this.selectedExchangeJob$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsSelectedExchangeJob));
    this.isDetailPanelExpanded$ = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsIsDetailPanelExpanded));

    //  Register Observables, job family
    this.isJobFamilyFilterExpanded$ = this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobFamilyFilterIsExpanded));
    this.isJobFamilyFilterLoading$ = this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobsFamilyFilterLoading));
    this.jobFamilyFilterOptions$ = this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobFamilyFilterOptions));

    // Register Subscriptions
    this.searchTermSubscription = this.store.pipe(select(fromJobAssociationReducers.getExchangeJobsSearchTerm))
        .subscribe((searchTerm) => this.searchTerm = searchTerm);

    this.selectedCompanyJobsSubscription = this.selectedCompanyJobs$
        .subscribe((selectedCompanyJobs) => this.selectedCompanyJobs = selectedCompanyJobs);

    this.exchangeJobAssociationsSubscription = this.exchangeJobAssociations$
        .subscribe((exchangeJobAssociations) => this.exchangeJobAssociations = exchangeJobAssociations);

    this.selectedExchangeJobSubscription = this.selectedExchangeJob$
      .subscribe((selectedExchangeJob) => this.selectedExchangeJob = selectedExchangeJob);

    // job family
    this.isJobFamilyFilterExpanded$ =
      this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobFamilyFilterIsExpanded));

    this.isJobFamilyFilterLoading$ =
      this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobsFamilyFilterLoading));

    this.jobFamilyFilterOptions$ = this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobFamilyFilterOptions));

    this.selectedJobFamilyOptionNames$ =
      this.store.pipe(select(fromExchangeJobsReducer.getExchangeJobFamilyFilterSelectedOptionNames));

    this.isJobFamilyFilterExpandedSubscription = this.isJobFamilyFilterExpanded$.subscribe((isExpanded) => {
      this.isJobFamilyFilterExpanded = isExpanded;
    });
  }

  ngOnDestroy() {
    this.searchTermSubscription.unsubscribe();
    this.selectedCompanyJobsSubscription.unsubscribe();
    this.exchangeJobAssociationsSubscription.unsubscribe();
    this.selectedExchangeJobSubscription.unsubscribe();
    // job family
    this.isJobFamilyFilterExpandedSubscription.unsubscribe();
  }

  reload(resetSearchTerm = false): void {
    // if this is invoked from an empty search results grid reset the term, otherwise keep the term as is and reload
    if (resetSearchTerm) {
      this.jobTitleSearchComponent.clearValue();
      this.store.dispatch(new exchangeJobsActions.ClearSelectedJobFamilies());
    } else {
      this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
    }
  }

  showExchangeTitleTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth && e.target.id.includes('exchange-title-')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  // event handlers
  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalPeerExchangeJobs, state));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  handleDetailExpand(event: any): void {
    this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());

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

  closeJobFamilyFilter(): void {
    if (this.isJobFamilyFilterExpanded) {
      this.store.dispatch(new exchangeJobsActions.ToggleJobFamilyFilter(false));
    }
  }

  handleJobFamilyToggle(isExpanded?: boolean) {
    this.store.dispatch(new exchangeJobsActions.ToggleJobFamilyFilter(isExpanded));
  }

  handleJobFamilyCheckboxToggle(option: GenericMenuItem) {
    this.store.dispatch(new exchangeJobsActions.ToggleJobFamilyFilterSelection(option));
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalPeerExchangeJobs, { skip: 0 } as PageChangeEvent));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  handleJobFamilyClearSelections() {
    this.store.dispatch(new exchangeJobsActions.ClearSelectedJobFamilies());
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalPeerExchangeJobs, { skip: 0 } as PageChangeEvent));
    this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
  }

  handleExchangeJobClick(exchangeJob: ExchangeJob) {
    this.store.dispatch(new exchangeJobsActions.SelectExchangeJob(exchangeJob));
  }

  handleCloseDetailPanel() {
    this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
  }

  handleSearchFilterChanged(searchTerm: string): void {
    this.store.dispatch(new exchangeJobsActions.UpdateSearchTerm(searchTerm));

    // only search if 2+ chars are supplied, or if the term is reset and it's empty
    if (!searchTerm || searchTerm.length >= 2) {
      this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.JobAssociationModalPeerExchangeJobs, { skip: 0 } as PageChangeEvent));
      this.store.dispatch(new exchangeJobsActions.LoadExchangeJobs());
    }
  }

  handleAssociateClick(exchangeId: number, exchangeJobId: number): void {
    if (this.isAssociable(exchangeId, exchangeJobId)) {
      this.store.dispatch(new exchangeJobsActions.AddAssociation({
        ExchangeId: exchangeId,
        ExchangeJobId: exchangeJobId,
        CompanyJobs: this.selectedCompanyJobs
      }));
    }
  }

  handleRemoveAssociateClick(exchangeId: number, exchangeJobId: number, companyJobId: number): void {
    this.store.dispatch(new exchangeJobsActions.RemoveAssociation(
        exchangeId,
        exchangeJobId,
        companyJobId));
  }

  // close the job family filter when the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'escape') {
      this.store.dispatch(new exchangeJobsActions.ToggleJobFamilyFilter(false));
      this.store.dispatch(new exchangeJobsActions.CloseDetailPanel());
    }
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

  toggleViewType(isListView: boolean): void {
    if (this.isListView === isListView) {
      return;
    }
    this.isListView = !this.isListView;
  }
}
