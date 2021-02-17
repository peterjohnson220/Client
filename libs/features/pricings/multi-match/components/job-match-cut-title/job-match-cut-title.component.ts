import { Component, Input, Output, OnInit, EventEmitter, ViewChild} from '@angular/core';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { JobMatchCut } from 'libs/models/payfactors-api';
import { PricingMatchEntityTypes } from 'libs/constants';
import { JobToPrice } from '../../models';

@Component({
  selector: 'pf-job-match-cut-title',
  templateUrl: './job-match-cut-title.component.html',
  styleUrls: ['./job-match-cut-title.component.scss'],
})

export class JobMatchCutTitleComponent implements OnInit {
  @Input() dataCut: JobMatchCut;
  @Input() job: JobToPrice;

  @Output() editCut: EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>
    = new EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>();

  @ViewChild(TooltipDirective)
  public tooltip: TooltipDirective;

  entityType: PricingMatchEntityTypes;
  entityId: any;
  matchType: string;

  handleDataCutClick(job: JobToPrice, jobMatchCut: JobMatchCut) {
    if (!!jobMatchCut.PeerCutId) {
      this.tooltip.hide();
      this.editCut.emit({jobCut: jobMatchCut, job: job});
    }
  }

  ngOnInit() {
    this.entityType = this.dataCut.MatchType;
    this.entityId = this.dataCut.MatchId;
    this.matchType = this.dataCut.MatchSourceCode;
  }
}
