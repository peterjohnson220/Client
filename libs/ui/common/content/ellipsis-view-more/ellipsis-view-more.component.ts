import { Component, Input, ViewChild } from '@angular/core';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { copyTextToClipboard } from 'libs/core/functions';

@Component({
  selector: 'pf-ellipsis-view-more',
  templateUrl: './ellipsis-view-more.component.html',
  styleUrls: ['./ellipsis-view-more.component.scss']
})
export class EllipsisViewMoreComponent {
  @Input() maxLength: number;
  @Input() content: string;
  @Input() highlightFilter: string;
  @Input() copy: boolean;
  @ViewChild('copiedSuccessToolTip') private tooltip: NgbTooltip;

  showFull: boolean;

  get lessContent(): string {
    return this.content.substr(0, this.maxLength) + '...';
  }

  constructor() {}

  copyMessage(e: MouseEvent, val: string) {
    e.stopPropagation();
    copyTextToClipboard(val);
    this.showCopySuccessToolTip();
  }

  toggleView(e: MouseEvent) {
    e.stopPropagation();
    this.showFull = !this.showFull;
  }

  private showCopySuccessToolTip() {
    const isOpen = this.tooltip.isOpen();
    this.tooltip.close();
    if (!isOpen)  {
      this.tooltip.open('Copied');
      setTimeout(() => this.tooltip.close(),  1000);
    }
  }
}
