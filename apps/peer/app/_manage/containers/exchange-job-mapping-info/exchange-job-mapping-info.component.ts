import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import * as lodash from 'lodash';

import { CompanyJobToMapTo, ExchangeJobMapping, Job, CompanyJobMapping } from 'libs/models';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromPeerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-mapping-info',
  templateUrl: './exchange-job-mapping-info.component.html',
  styleUrls: ['./exchange-job-mapping-info.component.scss']
})
export class ExchangeJobMappingInfoComponent implements OnInit, OnDestroy {
  @Input() exchangeId: number;
  @Output() closeClicked = new EventEmitter();
  @Output() editMappingClicked = new EventEmitter();
  @ViewChild(NgbCarousel) carousel: NgbCarousel;

  // Observables
  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
  companyJobsToMapTo$: Observable<CompanyJobToMapTo[]>;
  companyJobsToMapToLoading$: Observable<boolean>;
  companyJobsToMapToLoadingError$: Observable<boolean>;
  applyingMapping$: Observable<boolean>;
  applyingMappingError$: Observable<boolean>;
  selectedMappingCompanyJobId$: Observable<number>;
  activeExchangeJobToCompanyJobId$: Observable<number>;
  addingMapping$: Observable<boolean>;
  deletingMapping$: Observable<boolean>;
  deletingMappingError$: Observable<boolean>;
  loadingExchangeJobMappings$: Observable<boolean>;

  // Subscriptions
  selectedExchangeJobMappingSubscription: Subscription;
  addingMappingSubscription: Subscription;
  activeExchangeJobToCompanyJobIdSubscription: Subscription;

  selectedExchangeJobMapping: ExchangeJobMapping;
  selectedCompanyJobMapping: CompanyJobMapping;
  selectedCompanyJobInfoModels: Job[];
  exchangeJobInfo: Job;
  companyJobQuery: string;
  companyDescriptionQuery: string;
  debouncedQueryValue: string;
  addingMapping: boolean;

  constructor(private store: Store<fromPeerManagementReducer.State>) {
    this.loadingExchangeJobMappings$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobMappingsLoading));
    this.selectedExchangeJobMapping$ = this.store.pipe(select(fromPeerManagementReducer.getSelectedExchangeJobMapping));
    this.companyJobsToMapTo$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsToMapTo));
    this.companyJobsToMapToLoading$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsToMapToLoading));
    this.companyJobsToMapToLoadingError$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsToMapToLoadingError));
    this.applyingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMapping));
    this.applyingMappingError$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMappingError));
    this.selectedMappingCompanyJobId$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoSelectedMappingCompanyJobId));
    this.addingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoAddingMapping));
    this.deletingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMapping));
    this.deletingMappingError$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMappingError));
    this.activeExchangeJobToCompanyJobId$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoActiveMapping));
  }

  searchChanged() {
    this.debouncedQueryValue = this.companyJobQuery;

    if (this.companyJobQuery.length <= 0 && this.companyDescriptionQuery.length <= 0) {
      this.debouncedQueryValue = this.selectedExchangeJobMapping.ExchangeJobTitle;
    }

    this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: this.exchangeId,
      jobTitleAndCodeQuery: this.debouncedQueryValue,
      jobDescriptionQuery: this.companyDescriptionQuery
    }));
  }

  handleSearchDescValueChanged(event: string) {
    this.companyDescriptionQuery = event;
    this.searchChanged();
  }

  handleSearchTitleValueChanged(event: string) {
    this.companyJobQuery = event;
    this.searchChanged();
  }

  handleApplyMapping(companyJobId: number) {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.ApplyMapping({
      ExchangeId: this.exchangeId,
      ExchangeJobId: this.selectedExchangeJobMapping.ExchangeJobId,
      CompanyJobId: companyJobId
    }));
  }

  handleDeleteClick() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.OpenDeleteConfirmationModal());
  }

  resetValues() {
    this.companyJobQuery = '';
    this.companyDescriptionQuery = '';
    this.debouncedQueryValue = '';
  }

  toggleAdding() {
    if (this.addingMapping) {
      this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
    } else {
      this.resetValues();
      this.dispatchLoadCompanyJobsToMapToByQuery();
      this.store.dispatch(new fromExchangeJobMappingInfoActions.AddMapping());
    }
  }

  close() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
    this.closeClicked.emit();
  }

  trackById(index: number, mappedCompanyJob: CompanyJobMapping): number {
    return mappedCompanyJob.ExchangeJobToCompanyJobId;
  }

  // Carousel handlers
  handleControlRightClick() {
    this.carousel.next();
  }

  handleControlLeftClick() {
    this.carousel.prev();
  }

  handleIndicatorClick(index: string) {
    this.carousel.select(index);
  }

  onCarouselSlideChange(slideEvent: NgbSlideEvent): void {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.SetActiveMapping(+slideEvent.current));
  }
  // Lifecycle
  ngOnInit() {
    this.selectedExchangeJobMappingSubscription = this.selectedExchangeJobMapping$.subscribe(sm => {
      if (sm) {
        this.selectedExchangeJobMapping = sm;
        this.resetValues();

        this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
        this.buildJobModels(sm);

        if (!sm.Mapped) {
          this.dispatchLoadCompanyJobsToMapToByQuery();
        }
      }
    });

    this.activeExchangeJobToCompanyJobIdSubscription = this.activeExchangeJobToCompanyJobId$.subscribe(id => {
      if (id) {
        this.selectedCompanyJobMapping = this.selectedExchangeJobMapping.CompanyJobMappings.find(
          cjm => cjm.ExchangeJobToCompanyJobId === id
        );
      }
    });

    this.addingMappingSubscription = this.addingMapping$.subscribe(em => this.addingMapping = em);
  }

  buildNoResultsString(): string {

    let s = 'No results for ';

    const companyJob = lodash.escape(this.companyJobQuery);
    const jobDescription = lodash.escape(this.companyDescriptionQuery);

    if (!companyJob && !jobDescription) {
      s += '<u>' + this.selectedExchangeJobMapping.ExchangeJobTitle + '</u>';
    } else if (companyJob) {
      s += '<u>' + companyJob + '</u>';
      if (jobDescription) {
        s += ' <i>and</i> ';
      }
    }

    if (jobDescription) {
      s += '<u>' + jobDescription + '</u>';
    }
    return s;

  }

  ngOnDestroy() {
    this.selectedExchangeJobMappingSubscription.unsubscribe();
    this.addingMappingSubscription.unsubscribe();
    this.activeExchangeJobToCompanyJobIdSubscription.unsubscribe();
  }

  private dispatchLoadCompanyJobsToMapToByQuery(): void {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
      exchangeId: this.exchangeId,
      jobTitleAndCodeQuery: this.selectedExchangeJobMapping.ExchangeJobTitle,
      jobDescriptionQuery: ''
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
    this.selectedCompanyJobInfoModels = ejm.CompanyJobMappings.map(this.buildCompanyJobInfoModel);
  }

  private buildCompanyJobInfoModel(cji: CompanyJobMapping): Job {
    return {
      JobId: cji.ExchangeJobToCompanyJobId,
      JobType: 'Company',
      JobTitle: cji.CompanyJobTitle,
      JobCode: cji.CompanyJobCode,
      JobFamily: cji.CompanyJobFamily,
      JobLevel: cji.CompanyJobLevel,
      JobDescription: cji.CompanyJobDescription
    };
  }
}
