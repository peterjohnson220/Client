import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';

import { calculateTooltipTopPx, TooltipContainerData } from '../../helpers';

@Component({
  selector: 'pf-matches-details-tooltip',
  templateUrl: './matches-details-tooltip.component.html',
  styleUrls: ['./matches-details-tooltip.component.scss']
})
export class MatchesDetailsTooltipComponent implements OnChanges, AfterViewChecked {
  @Input() matchesDetails: string[];
  @Input() tooltipRightPx: number;
  @Input() tooltipTopPx: number;
  @Input() visible: boolean;
  @Input() containerHeight: number;
  @Input() containerWidth: number;

  @ViewChild('tooltip', { static: true }) private tooltipElement: ElementRef;

  readonly tooltipMargin: number = 10;
  readonly rightPadding: number = 50;
  private isTooltipTopPxChanged: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.matchesDetails) {
      this.updateScrollTop();
    }
    this.isTooltipTopPxChanged = !!changes.tooltipTopPx || !!changes.matchesDetails;
  }

  ngAfterViewChecked(): void {
    if (!this.isTooltipTopPxChanged) {
      return;
    }
    const tooltipHeight: number = this.tooltipElement.nativeElement.clientHeight;
    this.updateTooltipElementTopPx(this.containerHeight, tooltipHeight);
    this.isTooltipTopPxChanged = false;
  }

  updateTooltipElementTopPx(containerHeight: number, tooltipHeight: number): void {
    const tooltipContainerData: TooltipContainerData = {
      Top: this.tooltipTopPx,
      Height: tooltipHeight,
      Margin: this.tooltipMargin,
      ContainerHeight: containerHeight
    };
    this.tooltipTopPx = calculateTooltipTopPx(tooltipContainerData);
    this.tooltipElement.nativeElement.style.top = `${this.tooltipTopPx}px`;
    this.tooltipElement.nativeElement.style.right = `${this.tooltipRightPx + this.rightPadding}px`;
  }

  updateScrollTop(): void {
    this.tooltipElement.nativeElement.scrollTop = 0;
  }
}
