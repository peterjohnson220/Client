import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss']
})
export class PricingMatchesJobTitleComponent implements OnInit, AfterViewInit {

  @Input() dataRow: any[];

  @ViewChild('jobTitleText', { static: false }) jobTitleText: ElementRef;
  @ViewChild('detailsText', { static: false }) detailsText: ElementRef;

  public isCollapsed = true;
  public isOverflow = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // The jobTitleText and the detailsText are templates and their content changes
    // after ngIf directives on the containing template and executed
    // As a result the get the ExpressionChangedAfterItHasBeenCheckedError
    // The solution is to wait for the dom to render and set a local isOverflow property to check if the text overflows
    setTimeout(() => {
      this.isOverflow = this.checkOverflow(this.jobTitleText.nativeElement) || this.checkOverflow(this.detailsText.nativeElement);
    });
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
