import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked, HostListener, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss'],
})
export class PricingMatchesJobTitleComponent implements OnInit, AfterViewChecked {

  @Input() dataRow: any[];

  @ViewChild('jobTitleText', { static: false }) jobTitleText: ElementRef;
  @ViewChild('detailsText', { static: false }) detailsText: ElementRef;

  public isCollapsed = true;
  public isOverflow = false;

  @HostListener('window:resize') windowResize() {
    this.ngAfterViewChecked();
  }

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.isOverflow = this.checkOverflow(this.jobTitleText.nativeElement) || this.checkOverflow(this.detailsText.nativeElement);
    this.cdRef.detectChanges();
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

  checkOverflow(element) {
    // IE hack because IE calculates offsets differently
    const agent = window.navigator.userAgent.toLowerCase();
    const IEOffsetModifier = agent.indexOf('trident') > -1 || agent.indexOf('edge') > -1 ? 1 : 0.49;
    return element.getBoundingClientRect().width + IEOffsetModifier < element.scrollWidth;
  }

}
