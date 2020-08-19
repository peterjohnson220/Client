import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatchesDetailsRequestJobTypes, PricingMatchesDetailsRequest } from 'libs/models/payfactors-api';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SurveySearchResultDataSources } from 'libs/constants';

import { DataCutDetails, JobResult, MatchesDetailsTooltipData, DataCut, PeerJobInfo } from '../../models';
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
  @Input() legacyIframeImplementation: boolean;
  @Input() refineInPeerDisplayed: boolean;
  @Output() loadDataCuts: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() cutSelected: EventEmitter<DataCutDetails> = new EventEmitter<DataCutDetails>();
  @Output() matchesMouseEnter: EventEmitter<MatchesDetailsTooltipData> = new EventEmitter<MatchesDetailsTooltipData>();
  @Output() matchesMouseLeave: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refineInPeerClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();

  // Observables
  loadingResults$: Observable<boolean>;
  selectedCuts$: Observable<DataCutDetails[]>;

  // Subscription
  private loadingResultsSub: Subscription;

  toggleDataCutsLabel: string;
  toggleRefineInPeerLabel = 'Refine';
  showDataCuts: boolean;
  showJobDetail: boolean;
  matchesMouseLeaveTimer: number;
  surveySearchResultDataSources = SurveySearchResultDataSources;

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
  get isPeerJob(): boolean {
    return this.job.DataSource === this.surveySearchResultDataSources.Peer;
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

  toggleRefineInPeerDisplay(): void {
    this.refineInPeerClicked.emit(this.job);
  }

  handleDataCutSelected(dataCut: DataCut) {
    this.cutSelected.emit({
      DataSource: this.job.DataSource,
      SurveyJobId: this.job.Id,
      Job: this.job,
      TCC50th: dataCut.TCC50th,
      Base50th: dataCut.Base50th,
      ServerInfo: dataCut.ServerInfo,
      CutFilterId: dataCut.Id
    });
  }

  handlePayfactorsCutSelected() {
    this.cutSelected.emit({
      DataSource: this.job.DataSource,
      SurveyJobCode: this.job.Code,
      CountryCode: this.job.CountryCode,
      Job: this.job,
      Base50th: this.job.Base50th,
      TCC50th: this.job.TCC50th,
      CutFilterId: this.job.Code + this.job.CountryCode
    });
  }

  // TODO: Create a story to further refactor the multi match display, break dependence on if legacy iFrame do X vs Y
  // Everything should be consistent regardless of implementation
  handleMatchesMouseEnter(event: MouseEvent): void {
    const request: PricingMatchesDetailsRequest = this.createPricingMatchesDetailsRequest();
    const data: MatchesDetailsTooltipData = {
      TargetX: this.legacyIframeImplementation ? event.offsetX : event.pageX,
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
    const jobId: string = this.job.DataSource === SurveySearchResultDataSources.Payfactors ? this.job.Code : this.job.Id.toString();
    const jobType: string = this.job.DataSource === SurveySearchResultDataSources.Payfactors ?
      MatchesDetailsRequestJobTypes.PayfactorsJob : MatchesDetailsRequestJobTypes.SurveyJob;
    const request: PricingMatchesDetailsRequest = {
      JobId: jobId,
      JobType: jobType
    };
    return request;
  }
}
