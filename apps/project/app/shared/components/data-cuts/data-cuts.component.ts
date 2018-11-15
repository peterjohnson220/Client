import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { MatchesDetailsRequestJobTypes, PricingMatchesDetailsRequest } from 'libs/models';

import { JobResult, MatchesDetailsTooltipData, SurveyDataCut } from '../../models';

@Component({
  selector: 'pf-data-cuts',
  templateUrl: './data-cuts.component.html',
  styleUrls: ['./data-cuts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataCutsComponent implements OnDestroy {

  @Input() job: JobResult;
  @Input() numberCutsSelected: number;
  @Input() dataCuts: SurveyDataCut[];
  @Input() cutsDraggable: boolean;
  @Input() currencyCode: string;

  @Output() dataCutSelected: EventEmitter<SurveyDataCut> = new EventEmitter();
  @Output() payFactorsCutSelected: EventEmitter<any> = new EventEmitter();
  @Output() matchesMouseEnter: EventEmitter<MatchesDetailsTooltipData> = new EventEmitter<MatchesDetailsTooltipData>();
  @Output() matchesMouseLeave: EventEmitter<boolean> = new EventEmitter<boolean>();

  isMatchesHovered: boolean;
  private matchesMouseLeaveTimer: number;
  private readonly matchesMouseLeaveTimeout: number = 100;

  constructor() {}

  ngOnDestroy(): void {
    if (!!this.matchesMouseLeaveTimer) {
      clearTimeout(this.matchesMouseLeaveTimer);
    }
  }

  trackByDataCutId(index, item: SurveyDataCut) {
    return item.SurveyDataId;
  }

  toggleDataCutSelection(dataCut: SurveyDataCut): void {
    this.dataCutSelected.emit(dataCut);
  }

  togglePayfactorsSelection(): void {
    this.payFactorsCutSelected.emit();
  }

  handleMatchesMouseEnter(event: MouseEvent, dataCut: SurveyDataCut): void {
    this.isMatchesHovered = true;
    const request: PricingMatchesDetailsRequest = {
      JobId: dataCut.SurveyDataId.toString(),
      JobType: MatchesDetailsRequestJobTypes.SurveyData
    };
    const data: MatchesDetailsTooltipData = {
      TargetX: event.offsetX,
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
