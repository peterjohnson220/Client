import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';

import { JobResult } from '../../models';

@Component({
  selector: 'pf-job-details-tooltip',
  templateUrl: './job-details-tooltip.component.html',
  styleUrls: ['./job-details-tooltip.component.scss']
})
export class JobDetailsTooltipComponent implements OnChanges, AfterViewChecked {
  @Input() job: JobResult;
  @Input() tooltipLeftPx: number;
  @Input() tooltipTopPx: number;
  @Input() visible: boolean;
  @Input() containerHeight: number;
  @Input() containerWidth: number;

  @ViewChild('tooltip') private tooltipElement: ElementRef;
  @ViewChild('jobDescription') private jobDescriptionElement: ElementRef;

  private readonly tooltipMargin: number = 20;
  private readonly tooltipPadding: number = 5;
  private isTooltipTopPxChanged: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.job || (changes.visible &&
      changes.visible.currentValue === true &&
      changes.visible.previousValue === false)
    ) {
      this.updateJobDescriptionScrollTop();
    }
    this.isTooltipTopPxChanged = !!changes.tooltipTopPx;
  }

  ngAfterViewChecked(): void {
    if (!this.isTooltipTopPxChanged) {
      return;
    }
    const tooltipHeight: number = this.tooltipElement.nativeElement.clientHeight;
    const tooltipWidth: number = this.tooltipElement.nativeElement.clientWidth;
    this.updateTooltipElementTopPx(this.containerHeight, tooltipHeight);
    this.updateTooltipElementLeftPx(this.containerWidth, tooltipWidth);
    this.isTooltipTopPxChanged = false;
  }

  updateTooltipElementTopPx(containerHeight: number, tooltipHeight: number): void {
    const isOverlappingTop: boolean = this.tooltipTopPx + tooltipHeight > containerHeight;
    if (isOverlappingTop) {
      const newTopPx: number = this.tooltipTopPx - tooltipHeight + this.tooltipMargin;
      this.tooltipTopPx = newTopPx < 0 ? 0 : newTopPx;
    }
    this.tooltipElement.nativeElement.style.top = `${this.tooltipTopPx}px`;
  }

  updateTooltipElementLeftPx(containerWidth: number, tooltipWidth: number): void {
    const isOverlappingRight: boolean = this.tooltipLeftPx + tooltipWidth + this.tooltipPadding > containerWidth;
    if (isOverlappingRight) {
      this.tooltipLeftPx = containerWidth - tooltipWidth - this.tooltipMargin;
    }
    this.tooltipElement.nativeElement.style.left = `${this.tooltipLeftPx}px`;
  }

  updateJobDescriptionScrollTop(): void {
    this.jobDescriptionElement.nativeElement.scrollTop = 0;
  }
}
