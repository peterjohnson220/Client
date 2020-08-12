import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import escape from 'lodash/escape';

import { CompanyJobToMapTo, ExchangeJobMapping, Job, LatestCompanyJob } from 'libs/models';

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
  getActiveCompanyJobId$: Observable<number>;
  addingMapping$: Observable<boolean>;
  deletingMapping$: Observable<boolean>;
  deletingMappingError$: Observable<boolean>;
  loadingExchangeMappingInfo$: Observable<boolean>;
  selectedCompanyJobInfoModels$: Observable<LatestCompanyJob[]>;
  selectedJobs: LatestCompanyJob[];

  // Subscriptions
  selectedExchangeJobMappingSubscription: Subscription;
  addingMappingSubscription: Subscription;
  activeExchangeJobToCompanyJobIdSubscription: Subscription;
  selectedCompanyJobsSubscription: Subscription;

  selectedExchangeJobMapping: ExchangeJobMapping;
  selectedCompanyJob: LatestCompanyJob;
  selectedExchangeJobToCompanyJobId: number;
  exchangeJobInfo: Job;
  companyJobQuery: string;
  companyDescriptionQuery: string;
  debouncedQueryValue: string;
  addingMapping: boolean;

  constructor(private store: Store<fromPeerManagementReducer.State>) {
    this.loadingExchangeMappingInfo$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsInfoLoading));
    this.selectedExchangeJobMapping$ = this.store.pipe(select(fromPeerManagementReducer.getSelectedExchangeJobMapping));
    this.companyJobsToMapTo$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsToMapTo));
    this.companyJobsToMapToLoading$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsInfoLoading));
    this.companyJobsToMapToLoadingError$ = this.store.pipe(select(fromPeerManagementReducer.getCompanyJobsInfoLoadingError));
    this.applyingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMapping));
    this.applyingMappingError$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMappingError));
    this.selectedMappingCompanyJobId$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoSelectedMappingCompanyJobId));
    this.addingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoAddingMapping));
    this.deletingMapping$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMapping));
    this.deletingMappingError$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMappingError));
    this.getActiveCompanyJobId$ = this.store.pipe(select(fromPeerManagementReducer.getExchangeJobsInfoActiveCompanyJobId));
    this.selectedCompanyJobInfoModels$ = this.store.pipe(select(fromPeerManagementReducer.getAssociatedCompanyJobs));
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

  resetSearchValues() {
    this.companyJobQuery = '';
    this.companyDescriptionQuery = '';
    this.debouncedQueryValue = '';
  }

  toggleAdding() {
    if (this.addingMapping) {
      this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
    } else {
      this.resetSearchValues();
      this.dispatchLoadCompanyJobsToMapToByQuery();
      this.store.dispatch(new fromExchangeJobMappingInfoActions.AddMapping());
    }
  }

  close() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
    this.closeClicked.emit();
  }

  trackById(index: number, mappedCompanyJob: LatestCompanyJob): number {
    return mappedCompanyJob.CompanyJobId;
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

    this.selectedCompanyJobsSubscription = this.selectedCompanyJobInfoModels$.subscribe(jobs => {
      this.selectedJobs = jobs;
    });

    this.selectedExchangeJobMappingSubscription = this.selectedExchangeJobMapping$.subscribe(sm => {
      if (sm) {
        this.selectedExchangeJobMapping = sm;
        this.resetSearchValues();

        if (sm.CompanyJobMappings && sm.CompanyJobMappings.length > 0) {
          const companies = sm.CompanyJobMappings.map(f => f.CompanyJobId);
          this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadMappedCompanyJobs(companies));
        } else {
          this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadMappedCompanyJobsSuccess(null));
          this.dispatchLoadCompanyJobsToMapToByQuery();
        }

        this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
        this.buildJobModels(sm);
      }
    });

    this.activeExchangeJobToCompanyJobIdSubscription = this.getActiveCompanyJobId$.subscribe(id => {
      if (id) {
        this.selectedCompanyJob = this.selectedJobs.find(
          cjm => cjm.CompanyJobId === id);

        if (this.selectedCompanyJob) {
          this.selectedExchangeJobToCompanyJobId = this.selectedExchangeJobMapping.CompanyJobMappings.find(f =>
            f.CompanyJobId === this.selectedCompanyJob.CompanyJobId).ExchangeJobToCompanyJobId;
        }
      }

    });

    this.addingMappingSubscription = this.addingMapping$.subscribe(em => this.addingMapping = em);
  }

  buildNoResultsString(): string {

    let s = 'No results for ';

    const companyJob = escape(this.companyJobQuery);
    const jobDescription = escape(this.companyDescriptionQuery);

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
    this.selectedCompanyJobsSubscription.unsubscribe();
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
  }
}
