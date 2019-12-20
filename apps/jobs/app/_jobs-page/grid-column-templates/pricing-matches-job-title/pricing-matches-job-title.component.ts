import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss']
})
export class PricingMatchesJobTitleComponent implements OnInit {

  @Input() dataRow: any[];

  public isCollapsed = true;

  constructor() { }

  ngOnInit() {
  }

  getJobTitle(): string {
    return `${this.dataRow['vw_PricingMatchesJobTitlesMerged_Job_Title']} (${this.dataRow['vw_PricingMatchesJobTitlesMerged_Job_Code']})`;
  }

  getScope(): string {
    return `${this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope1'] ? ' - ' + this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope1'] : ''}
    ${this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope2'] ? ' - ' + this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope2'] : ''}
    ${this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope3'] ? ' - ' + this.dataRow['vw_PricingMatchesJobTitlesMerged_Scope3'] : ''}`;
  }

  getSource(): string {
    return `${this.dataRow['vw_PricingMatchesJobTitlesMerged_Source']}`;
  }

  showExpandButton(): boolean {
    return this.getScope().length > 50;
  }

  checkOverflow (element) {
    return element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;
  }

}
