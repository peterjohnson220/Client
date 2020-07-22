import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { MatchesDetailsRequestJobTypes, PricingMatchesDetailsRequest } from 'libs/models/payfactors-api';
import { SurveySearchResultDataSources } from 'libs/constants';

import { JobResult, MatchesDetailsTooltipData, DataCut } from '../../models';

@Component({
  selector: 'pf-data-cuts',
  templateUrl: './data-cuts.component.html',
  styleUrls: ['./data-cuts.component.scss']
})
export class DataCutsComponent implements OnDestroy {
  @Input() job: JobResult;
  @Input() numberCutsSelected: number;
  @Input() dataCuts: DataCut[];
  @Input() cutsDraggable: boolean;
  @Input() currencyCode: string;
  @Input() legacyIframeImplementation: boolean;

  @Output() dataCutSelected: EventEmitter<DataCut> = new EventEmitter();
  @Output() payFactorsCutSelected: EventEmitter<any> = new EventEmitter();
  @Output() matchesMouseEnter: EventEmitter<MatchesDetailsTooltipData> = new EventEmitter<MatchesDetailsTooltipData>();
  @Output() matchesMouseLeave: EventEmitter<boolean> = new EventEmitter<boolean>();

  isMatchesHovered: boolean;
  surveySearchResultDataSources = SurveySearchResultDataSources;
  private matchesMouseLeaveTimer: number;
  private readonly matchesMouseLeaveTimeout: number = 100;

  constructor() {}

  ngOnDestroy(): void {
    if (!!this.matchesMouseLeaveTimer) {
      clearTimeout(this.matchesMouseLeaveTimer);
    }
  }

  trackById(index, item: DataCut) {
    return item.Id;
  }

  toggleDataCutSelection(dataCut: DataCut): void {
    this.dataCutSelected.emit(dataCut);
  }

  togglePayfactorsSelection(): void {
    this.payFactorsCutSelected.emit();
  }

  togglePeerCutSelection(dataCut: DataCut): void {
    this.dataCutSelected.emit(dataCut);
  }

  handleMatchesMouseEnter(event: MouseEvent, dataCut: DataCut): void {
    this.isMatchesHovered = true;
    const request: PricingMatchesDetailsRequest = {
      JobId: dataCut.ServerInfo.SurveyDataId.toString(),
      JobType: MatchesDetailsRequestJobTypes.SurveyData
    };
    const data: MatchesDetailsTooltipData = {
      TargetX: this.legacyIframeImplementation ? event.offsetX : event.pageX + 10,
      TargetY: event.clientY,
      Request: request
    };
    this.matchesMouseEnter.emit(data);
  }

  handleMatchesMouseLeave(event: MouseEvent): void {
    this.isMatchesHovered = false;
    this.matchesMouseLeaveTimer = window.setTimeout(() => {
      if (!this.isMatchesHovered) {
        this.matchesMouseLeave.emit(true);
      }
    }, this.matchesMouseLeaveTimeout);
  }

}
