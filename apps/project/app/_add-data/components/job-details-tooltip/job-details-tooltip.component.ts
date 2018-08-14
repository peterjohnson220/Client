import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewChecked, EventEmitter, Output } from '@angular/core';

import { JobResult } from '../../models';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { copyTextToClipboard } from 'libs/core/functions';

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
  @Output() closed: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('tooltip') private tooltipElement: ElementRef;
  @ViewChild('jobDescription') private jobDescriptionElement: ElementRef;
  @ViewChild('t') private tooltip: NgbTooltip;

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

  hide() {
    this.closed.emit();
  }

  copyMessage(val: string) {
    copyTextToClipboard(val);
    this.showCopySuccessToolTip();
  }

  private showCopySuccessToolTip() {
    const isOpen = this.tooltip.isOpen();
    this.tooltip.close();
    if (!isOpen)  {
      this.tooltip.open('Copied');
      setTimeout(() => this.tooltip.close(),  2000);
    }
  }
}
