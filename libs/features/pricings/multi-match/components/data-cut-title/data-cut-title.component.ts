import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { JobMatchCut } from 'libs/models/payfactors-api';
import { DataCutSummaryTypes } from 'libs/features/pricings/data-cut-summary/constants';

import { JobToPrice } from '../../models';

@Component({
  selector: 'pf-data-cut-title',
  templateUrl: './data-cut-title.component.html',
  styleUrls: ['./data-cut-title.component.scss'],
})

export class DataCutTitleComponent {
  @Input() dataCut: JobMatchCut;
  @Input() job: JobToPrice;

  @Output() editCut: EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>
    = new EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>();

  @ViewChild(TooltipDirective)

  public tooltip: TooltipDirective;
  DataCutSummaryTypes = DataCutSummaryTypes;

  handleDataCutClick(job: JobToPrice, jobMatchCut: JobMatchCut) {
    if (jobMatchCut.MatchSourceCode === DataCutSummaryTypes.PEER) {
      this.tooltip.hide();
      this.editCut.emit({jobCut: jobMatchCut, job: job});
    }
  }
}
