import { Component } from '@angular/core';

import { DojGuidelinesService } from '../../services/doj-guidelines.service';

@Component({
  selector: 'pf-guidelines-badge',
  templateUrl: './guidelines-badge.component.html',
  styleUrls: ['./guidelines-badge.component.scss']
})
export class GuidelinesBadgeComponent {
  constructor(public guidelinesService: DojGuidelinesService) { }

  get dataDominanceMessage(): string {
    const shouldOrMust = this.guidelinesService.hasNoHardDominatingData ? 'should' : 'must';
    const percentageSoftOrHard = this.guidelinesService.hasNoHardDominatingData ? '25%' : 'or equal to 50%';
    return `The results ${shouldOrMust} not contain a company that makes up more than ${percentageSoftOrHard} of the overall data cut`;
  }
}
