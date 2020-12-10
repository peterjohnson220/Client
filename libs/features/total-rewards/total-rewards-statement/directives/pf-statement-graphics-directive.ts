import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { TotalRewardsColorEnum } from '../models';

@Directive({ selector: '[pfStatementGraphicsDirective]' })
export class StatementGraphicsDirective implements OnChanges {
  @Input() colors: string[];
  @Input() colorRank: TotalRewardsColorEnum;
  @Input() styleAttrToColor: 'backgroundColor' | 'color' | 'borderRightColor' = 'backgroundColor';
  @Input() enabled = true;

  constructor(public elementRef: ElementRef) { }

  ngOnChanges() {
    // bail out if we don't have colors or if we're explicitly opting out
    if (!this.colors?.length || this.colorRank === TotalRewardsColorEnum.Undefined || !this.enabled) {
      return;
    }

    // we have colors and a color rank (primary/secondary/etc), so set the element's background/color/etc to match the color set in the colors array
    const htmlElement = this.elementRef.nativeElement as HTMLElement;
    htmlElement.style[this.styleAttrToColor] = this.colors[this.getColorIndex()];
  }

  // return 0 for primary, 1 for secondary, etc, so the ranks align with array indexes
  private getColorIndex(): number {
    if (this.colorRank === TotalRewardsColorEnum.Primary)    { return 0; }
    if (this.colorRank === TotalRewardsColorEnum.Secondary)  { return 1; }
    if (this.colorRank === TotalRewardsColorEnum.Tertiary)   { return 2; }
    if (this.colorRank === TotalRewardsColorEnum.Quaternary) { return 3; }
    return -1;
  }
}
