import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

import { JobResult } from '../../models';

@Component({
  selector: 'pf-job-details-tooltip',
  templateUrl: './job-details-tooltip.component.html',
  styleUrls: ['./job-details-tooltip.component.scss']
})
export class JobDetailsTooltipComponent implements OnChanges {
  @Input() job: JobResult;
  @Input() tooltipLeftPx: number;
  @Input() tooltipTopPx: number;
  @Input() visible: boolean;

  @ViewChild('tooltip') private tooltipElement: ElementRef;
  @ViewChild('jobDescription') private jobDescriptionElement: ElementRef;

  private readonly tooltipMarginTop: number = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.job || (changes.visible &&
      changes.visible.currentValue === true &&
      changes.visible.previousValue === false)
    ) {
      this.updateTooltipElementTopPx(window.innerHeight, this.tooltipElement.nativeElement.clientHeight);
      this.updateJobDescriptionScrollTop();
    }
  }

  updateTooltipElementTopPx(windowHeight: number, tooltipHeight: number): void {
    const isOverlapping = this.tooltipTopPx + tooltipHeight > windowHeight;
    if (isOverlapping) {
      this.tooltipTopPx = this.tooltipTopPx - tooltipHeight + this.tooltipMarginTop;
    }
    this.tooltipElement.nativeElement.style.top = `${this.tooltipTopPx}px`;
  }

  updateJobDescriptionScrollTop(): void {
    this.jobDescriptionElement.nativeElement.scrollTop = 0;
  }
}
