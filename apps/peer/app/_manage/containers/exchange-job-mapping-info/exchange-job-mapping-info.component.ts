import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CompanyJobToMapTo, ExchangeJobMapping, Job } from 'libs/models';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromPeerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-mapping-info',
  templateUrl: './exchange-job-mapping-info.component.html',
  styleUrls: [ './exchange-job-mapping-info.component.scss' ]
})
export class ExchangeJobMappingInfoComponent implements OnInit, OnDestroy {
  @Input() exchangeId: number;
  @Output() closeClicked = new EventEmitter();
  @Output() editMappingClicked = new EventEmitter();

  // Observables
  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
  companyJobsToMapTo$: Observable<CompanyJobToMapTo[]>;
  companyJobsToMapToLoading$: Observable<boolean>;
  companyJobsToMapToLoadingError$: Observable<boolean>;
  applyingMapping$: Observable<boolean>;
  applyingMappingError$: Observable<boolean>;
  selectedMappingCompanyJobId$: Observable<number>;
  editingMapping$: Observable<boolean>;
  deletingMapping$: Observable<boolean>;
  deletingMappingError$: Observable<boolean>;
  loadingExchangeJobMappings$: Observable<boolean>;

  // Subscriptions
  selectedExchangeJobMappingSubscription: Subscription;
  editingMappingSubscription: Subscription;

  selectedExchangeJobMapping: ExchangeJobMapping;
  exchangeJobInfo: Job;
  companyJobInfo: Job;
  companyJobQuery: string;
  debouncedQueryValue: string;
  editingMapping: boolean;

  constructor(private store: Store<fromPeerManagementReducer.State>) {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoading);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);
    this.companyJobsToMapTo$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapTo);
    this.companyJobsToMapToLoading$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapToLoading);
    this.companyJobsToMapToLoadingError$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapToLoadingError);
    this.applyingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMapping);
    this.applyingMappingError$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMappingError);
    this.selectedMappingCompanyJobId$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoSelectedMappingCompanyJobId);
    this.editingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoEditingMapping);
    this.deletingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMapping);
    this.deletingMappingError$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMappingError);
  }

  handleSearchValueChanged(value: string) {
    this.debouncedQueryValue = value || this.selectedExchangeJobMapping.ExchangeJobTitle;

    this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: this.exchangeId,
      query: this.debouncedQueryValue
    }));
  }

  handleApplyMapping(companyJobId: number) {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.ApplyMapping({
      ExchangeJobToCompanyJobId: this.selectedExchangeJobMapping.ExchangeJobToCompanyJobId,
      ExchangeId: this.exchangeId,
      ExchangeJobId: this.selectedExchangeJobMapping.ExchangeJobId,
      CompanyJobId: companyJobId
    }));
  }

  handleDeleteClick() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.OpenDeleteConfirmationModal());
  }

  toggleEditing() {
    if (this.editingMapping) {
      this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelEditMapping());
    } else {
      this.companyJobQuery = '';
      this.debouncedQueryValue = '';
      this.dispatchLoadCompanyJobsToMapToByQuery();
      this.store.dispatch(new fromExchangeJobMappingInfoActions.EditMapping());
    }
  }

  close() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelEditMapping());
    this.closeClicked.emit();
  }

  // Lifecycle
  ngOnInit() {
    this.selectedExchangeJobMappingSubscription = this.selectedExchangeJobMapping$.subscribe(sm => {
      if (sm) {
        this.selectedExchangeJobMapping = sm;
        this.companyJobQuery = '';
        this.debouncedQueryValue = '';

        this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelEditMapping());
        this.buildJobModels(sm);

        if (!sm.Mapped) {
          this.dispatchLoadCompanyJobsToMapToByQuery();
        }
      }
    });

    this.editingMappingSubscription = this.editingMapping$.subscribe(em => this.editingMapping = em);
  }

  ngOnDestroy() {
    this.selectedExchangeJobMappingSubscription.unsubscribe();
    this.editingMappingSubscription.unsubscribe();
  }

  private dispatchLoadCompanyJobsToMapToByQuery(): void {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: this.exchangeId,
      query: this.selectedExchangeJobMapping.ExchangeJobTitle
    }));
  }

  private buildJobModels(ejm: ExchangeJobMapping): void {
    this.exchangeJobInfo = {
      JobType: 'Exchange',
      JobTitle: ejm.ExchangeJobTitle,
      JobCode: ejm.ExchangeJobCode,
      JobFamily: ejm.ExchangeJobFamily,
      JobLevel: ejm.ExchangeJobLevel,
      JobDescription: ejm.ExchangeJobDescription
    };

    this.companyJobInfo = {
      JobType: 'Company',
      JobTitle: ejm.CompanyJobTitle,
      JobCode: ejm.CompanyJobCode,
      JobFamily: ejm.CompanyJobFamily,
      JobLevel: ejm.CompanyJobLevel,
      JobDescription: ejm.CompanyJobDescription
    };
  }
}
