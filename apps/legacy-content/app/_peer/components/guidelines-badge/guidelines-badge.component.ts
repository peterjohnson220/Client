import { Component } from '@angular/core';

import { DojGuidelinesService } from '../../services/doj-guidelines.service';

@Component({
  selector: 'pf-guidelines-badge',
  templateUrl: './guidelines-badge.component.html',
  styleUrls: ['./guidelines-badge.component.scss']
})
export class GuidelinesBadgeComponent {
  constructor(public guidelinesService: DojGuidelinesService) { }
}
