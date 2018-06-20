import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { CompanyJobToMapTo, ExchangeJobMapping, Job, CompanyJobMapping } from 'libs/models';

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
  debouncedQueryValue: string;
  addingMapping: boolean;

  constructor(private store: Store<fromPeerManagementReducer.State>) {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoading);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);
    this.companyJobsToMapTo$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapTo);
    this.companyJobsToMapToLoading$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapToLoading);
    this.companyJobsToMapToLoadingError$ = this.store.select(fromPeerManagementReducer.getCompanyJobsToMapToLoadingError);
    this.applyingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMapping);
    this.applyingMappingError$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoApplyingMappingError);
    this.selectedMappingCompanyJobId$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoSelectedMappingCompanyJobId);
    this.addingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoAddingMapping);
    this.deletingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMapping);
    this.deletingMappingError$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMappingError);
    this.activeExchangeJobToCompanyJobId$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoActiveMapping);
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
      ExchangeId: this.exchangeId,
      ExchangeJobId: this.selectedExchangeJobMapping.ExchangeJobId,
      CompanyJobId: companyJobId
    }));
  }

  handleDeleteClick() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.OpenDeleteConfirmationModal());
  }

  toggleAdding() {
    if (this.addingMapping) {
      this.store.dispatch(new fromExchangeJobMappingInfoActions.CancelAddMapping());
    } else {
      this.companyJobQuery = '';
      this.debouncedQueryValue = '';
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
        this.companyJobQuery = '';
        this.debouncedQueryValue = '';

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

  ngOnDestroy() {
    this.selectedExchangeJobMappingSubscription.unsubscribe();
    this.addingMappingSubscription.unsubscribe();
    this.activeExchangeJobToCompanyJobIdSubscription.unsubscribe();
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
