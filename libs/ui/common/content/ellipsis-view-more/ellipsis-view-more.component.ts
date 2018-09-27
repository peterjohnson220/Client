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

  copyMessage(val: string) {
    copyTextToClipboard(val);
    this.showCopySuccessToolTip();
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
