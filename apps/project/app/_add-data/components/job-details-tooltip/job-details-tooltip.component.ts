import { Component, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { JobResult } from '../../models';

@Component({
  selector: 'pf-job-details-tooltip',
  templateUrl: './job-details-tooltip.component.html',
  styleUrls: ['./job-details-tooltip.component.scss']
})
export class JobDetailsTooltipComponent implements AfterViewChecked {
  @Input() job: JobResult;
  @Input() tooltipLeftPx: number;
  @Input() tooltipTopPx: number;
  @Input() visible: boolean;

  @ViewChild('tooltip') private tooltipElement: ElementRef;

  private readonly tooltipMarginTop: number = 10;

  ngAfterViewChecked(): void {
    this.updateTooltipElementTopPx(window.innerHeight, this.tooltipElement.nativeElement.clientHeight);
  }

  updateTooltipElementTopPx(windowHeight: number, tooltipHeight: number): void {
    const isOverlapping = this.tooltipTopPx + tooltipHeight > windowHeight;
    if (isOverlapping) {
      this.tooltipTopPx = this.tooltipTopPx - tooltipHeight + this.tooltipMarginTop;
    }
    this.tooltipElement.nativeElement.style.top = `${this.tooltipTopPx}px`;
  }
}
