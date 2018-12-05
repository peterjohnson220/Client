import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatchesDetailsRequestJobTypes, PricingMatchesDetailsRequest } from 'libs/models/payfactors-api';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { DataCutDetails, JobResult, MatchesDetailsTooltipData, SurveyDataCut } from '../../models';
import { hasMoreDataCuts } from '../../helpers';
import * as fromSurveySearchReducer from '../../reducers';

@Component({
  selector: 'pf-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit, OnDestroy {
  @Input() job: JobResult;
  @Input() cutsDraggable: boolean;
  @Input() currencyCode: string;
  @Output() loadDataCuts: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() cutSelected: EventEmitter<DataCutDetails> = new EventEmitter<DataCutDetails>();
  @Output() matchesMouseEnter: EventEmitter<MatchesDetailsTooltipData> = new EventEmitter<MatchesDetailsTooltipData>();
  @Output() matchesMouseLeave: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Observables
  loadingResults$: Observable<boolean>;
  selectedCuts$: Observable<DataCutDetails[]>;

  // Subscription
  private loadingResultsSub: Subscription;

  toggleDataCutsLabel: string;
  showDataCuts: boolean;
  showJobDetail: boolean;
  matchesMouseLeaveTimer: number;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';
  private readonly matchesMouseLeaveTimeout: number = 100;

  constructor(
    private store: Store<fromSurveySearchReducer.State>
  ) {
    // This is not ideal. "Dumb" components should not know about the store. However we need to track these
    // components in the NgFor so they do not get re-initialized if they show up in subsequent searches. Currently this
    // is the only way to know about a search so we can reset some things.
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
  }
  get toggleJobDetailLabel() {
    return (this.showJobDetail ? 'Hide' : 'Show') + ' Job Detail';
  }

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
    this.loadingResultsSub = this.loadingResults$.subscribe(() => {
      this.showDataCuts = false;
      this.showJobDetail = false;
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
      this.handleLoadDataCuts();
    }
  }

  toggleJobDetailDisplay(): void {
    this.showJobDetail = !this.showJobDetail;
  }

  handleDataCutSelected(idObj: SurveyDataCut) {
    this.cutSelected.emit({
      IsPayfactorsJob: false,
      DataCutId: idObj.SurveyDataId,
      SurveyJobId: this.job.Id,
      Job: this.job,
      TCC50th: idObj.TCC50th,
      Base50th: idObj.Base50th
    });
  }

  handlePayfactorsCutSelected() {
    this.cutSelected.emit({
      IsPayfactorsJob: true,
      SurveyJobCode: this.job.Code,
      CountryCode: this.job.CountryCode,
      Job: this.job,
      Base50th: this.job.Base50th,
      TCC50th: this.job.TCC50th
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

  handleMatchesMouseLeave(): void {
    this.matchesMouseLeaveTimer = window.setTimeout(() => {
      this.matchesMouseLeave.emit(true);
    }, this.matchesMouseLeaveTimeout);
  }

  handleDataCutMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
    this.matchesMouseEnter.emit(data);
  }

  handleLoadDataCuts(): void {
    this.loadDataCuts.emit(this.job);
  }

  public get hasMoreDataCuts(): boolean {
    return hasMoreDataCuts(this.job);
  }

  private createPricingMatchesDetailsRequest(): PricingMatchesDetailsRequest {
    const jobId: string = this.job.IsPayfactors ? this.job.Code : this.job.Id.toString();
    const jobType: string = this.job.IsPayfactors ?
      MatchesDetailsRequestJobTypes.PayfactorsJob : MatchesDetailsRequestJobTypes.SurveyJob;
    const request: PricingMatchesDetailsRequest = {
      JobId: jobId,
      JobType: jobType
    };
    return request;
  }
}
