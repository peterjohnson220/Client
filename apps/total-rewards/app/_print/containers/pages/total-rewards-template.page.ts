import { Component } from '@angular/core';
import { Statement, generateMockStatement } from '../../../shared/models';



@Component({
  selector: 'pf-total-rewards-template-print-page',
  templateUrl: './total-rewards-template.page.html',
  styleUrls: ['./total-rewards-template.page.scss']
})
export class TotalRewardsTemplatePageComponent {
  mockStatement: Statement;
  constructor () {
    this.mockStatement = generateMockStatement();
  }
}
