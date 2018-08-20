import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { DataCut, PricingMatchesDetailsRequest, MatchesDetailsRequestJobTypes } from 'libs/models/survey-search';

import { JobResult, JobDetailsToolTipData, MatchesDetailsTooltipData } from '../../models';
import * as fromAddDataReducer from '../../reducers';


@Component({
  // The job result table row needs to be an immediate child of the tbody.
  // this component will be used through an attribute selector.
  // tslint:disable-next-line
  selector: '[pf-job-result]',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit, OnDestroy {

  @Input() job: JobResult;
  @Input() currencyCode: string;
  @Output() jobTitleClick: EventEmitter<JobDetailsToolTipData> = new EventEmitter<JobDetailsToolTipData>();
  @Output() showCutsClick: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() cutSelected: EventEmitter<DataCut> = new EventEmitter<DataCut>();
  @Output() matchesMouseEnter: EventEmitter<MatchesDetailsTooltipData> = new EventEmitter<MatchesDetailsTooltipData>();
  @Output() matchesMouseLeave: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Observables
  loadingResults$: Observable<boolean>;
  // Subscription
  private loadingResultsSub: Subscription;

  toggleDataCutsLabel: string;
  showDataCuts: boolean;
  matchesTooltipX: number;
  matchesTooltipY: number;
  matchesMouseLeaveTimer: number;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';
  private readonly matchesMouseLeaveTimeout: number = 100;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.loadingResults$ = this.store.select(fromAddDataReducer.getLoadingResults);
  }

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
    this.loadingResultsSub = this.loadingResults$.subscribe(() => {
      this.showDataCuts = false;
      this.toggleDataCutsLabel = this.showCutsLabel;
    });
  }

  ngOnDestroy() {
    this.loadingResultsSub.unsubscribe();
    if (!!this.matchesMouseLeaveTimer) {
      clearTimeout(this.matchesMouseLeaveTimer);
    }
  }

  toggleDataCutsDisplay(): void {
    this.showDataCuts = !this.showDataCuts;
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;

    if (this.showDataCuts) {
      this.showCutsClick.emit(this.job);
    }
  }

  handleJobTitleClick(event: MouseEvent): void {
    const data: JobDetailsToolTipData = {
      TargetX: event.offsetX + 10,
      TargetY: event.clientY,
      Job: this.job
    };
    this.jobTitleClick.emit(data);
  }

  toggleJobSelection(): void {
    // only payfactors job results can be selected
    if (!this.job.IsPayfactors) {
      return;
    }
    this.cutSelected.emit({
      IsPayfactorsJob: true,
      SurveyJobCode: this.job.Code,
      CountryCode: this.job.CountryCode
    });
  }

  handleDataCutSelected(idObj: { dataCutId: number }) {
    this.cutSelected.emit({
      IsPayfactorsJob: false,
      DataCutId: idObj.dataCutId,
      SurveyJobId: this.job.Id
    });
  }

  handleMatchesMouseEnter(event: MouseEvent): void {
    const request: PricingMatchesDetailsRequest = this.createPricingMatchesDetailsRequest();
    const data: MatchesDetailsTooltipData = {
      TargetX: event.offsetX,
      TargetY: event.clientY,
      Request: request
    };
    this.matchesMouseEnter.emit(data);
  }

  handleMatchesMouseLeave(event: MouseEvent): void {
    this.matchesMouseLeaveTimer = setTimeout(() => {
      this.matchesMouseLeave.emit(true);
    }, this.matchesMouseLeaveTimeout);
  }

  handleDataCutMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
    this.matchesMouseEnter.emit(data);
  }

  private createPricingMatchesDetailsRequest(): PricingMatchesDetailsRequest {
    const jobId: string = this.job.IsPayfactors ? this.job.Code : this.job.Id.toString();
    const jobType: number = this.job.IsPayfactors ?
      MatchesDetailsRequestJobTypes.PayfactorsJob : MatchesDetailsRequestJobTypes.SurveyJob;
    const request: PricingMatchesDetailsRequest = {
      JobId: jobId,
      JobType: jobType
    };
    return request;
  }
}
