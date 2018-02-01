import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CompanyJobToMapTo, ExchangeJobMapping, Job } from 'libs/models';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromPeerMainReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-mapping-info',
  templateUrl: './exchange-job-mapping-info.component.html',
  styleUrls: [ './exchange-job-mapping-info.component.scss' ]
})
export class ExchangeJobMappingInfoComponent implements OnInit, OnDestroy {
  @Input() exchangeId: number;
  @Output() closeClicked = new EventEmitter();

  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
  selectedExchangeJobMappingSubscription$: Subscription;
  companyJobsToMapTo$: Observable<CompanyJobToMapTo[]>;
  companyJobsToMapToLoading$: Observable<boolean>;
  companyJobsToMapToLoadingError$: Observable<boolean>;
  applyingMapping$: Observable<boolean>;
  applyingMappingError$: Observable<boolean>;
  selectedMappingCompanyJobId$: Observable<number>;

  selectedExchangeJobMapping: ExchangeJobMapping;
  exchangeJobInfo: Job;
  companyJobInfo: Job;
  companyJobQuery: string;
  debouncedQueryValue: string;

  constructor(private store: Store<fromPeerMainReducer.State>) {
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerMainReducer.getSelectedExchangeJobMapping);
    this.companyJobsToMapTo$ = this.store.select(fromPeerMainReducer.getCompanyJobsToMapTo);
    this.companyJobsToMapToLoading$ = this.store.select(fromPeerMainReducer.getCompanyJobsToMapToLoading);
    this.companyJobsToMapToLoadingError$ = this.store.select(fromPeerMainReducer.getCompanyJobsToMapToLoadingError);
    this.applyingMapping$ = this.store.select(fromPeerMainReducer.getExchangeJobsInfoApplyingMapping);
    this.applyingMappingError$ = this.store.select(fromPeerMainReducer.getExchangeJobsInfoApplyingMappingError);
    this.selectedMappingCompanyJobId$ = this.store.select(fromPeerMainReducer.getExchangeJobsInfoSelectedMappingCompanyJobId);
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
      exchangeId: this.exchangeId,
      exchangeJobId: this.selectedExchangeJobMapping.ExchangeJobId,
      companyJobId: companyJobId
    }));
  }

  close() {
    this.closeClicked.emit();
  }

  // Lifecycle
  ngOnInit() {
    this.selectedExchangeJobMappingSubscription$ = this.selectedExchangeJobMapping$.subscribe(sm => {
      if (sm) {
        this.selectedExchangeJobMapping = sm;
        this.companyJobQuery = '';

        this.buildJobModels(sm);

        if (!sm.Mapped) {
          this.store.dispatch(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery({
            exchangeId: this.exchangeId,
            query: sm.ExchangeJobTitle
          }));
        }
      }
    });
  }

  ngOnDestroy() {
    this.selectedExchangeJobMappingSubscription$.unsubscribe();
  }

  private buildJobModels(ejm: ExchangeJobMapping): void {
    this.exchangeJobInfo = {
      JobType: 'Exchange',
      JobTitle: ejm.ExchangeJobTitle,
      JobCode: ejm.ExchangeJobCode,
      JobFamily: ejm.ExchangeJobFamily,
      JobLevel: ejm.ExchangeJobFamily,
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
