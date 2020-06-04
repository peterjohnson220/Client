import { Component } from '@angular/core';
import { generateMockStatement, generateMockEmployeeRewardsData, StatementModeEnum} from '../../../shared/models';

@Component({
  selector: 'pf-total-rewards-template-print-page',
  templateUrl: './total-rewards-template.page.html',
  styleUrls: ['./total-rewards-template.page.scss']
})
export class TotalRewardsTemplatePageComponent {
  mockStatement = generateMockStatement();
  mockEmployeeRewardsData = generateMockEmployeeRewardsData();
  mode = StatementModeEnum.Print;
  constructor() {}
}
