import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { PricingMatchesDetailsRequest, MatchesDetailsRequestJobTypes } from 'libs/models';

import { SurveyDataCut, MatchesDetailsTooltipData } from '../../models';

@Component({
  selector: 'pf-data-cuts',
  templateUrl: './data-cuts.component.html',
  styleUrls: ['./data-cuts.component.scss']
})
export class DataCutsComponent implements OnDestroy {

  @Input() dataCuts: SurveyDataCut[];
  @Input() currencyCode: string;

  @Output() dataCutSelected: EventEmitter<{dataCutId: number}> = new EventEmitter();
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

  toggleCutSelection(dataCut: SurveyDataCut): void {
    this.dataCutSelected.emit({dataCutId: dataCut.SurveyDataId});
  }

  setDataCutClasses(dataCut: SurveyDataCut): any {
    return {
      'selected-data-cut' : dataCut.IsSelected,
      'data-cut-matched' : (dataCut.Matches !== 0) && !dataCut.IsSelected
    };
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
