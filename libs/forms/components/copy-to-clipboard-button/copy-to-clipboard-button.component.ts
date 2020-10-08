import { Component, Input } from '@angular/core';
import { copyTextToClipboard } from "libs/core/functions";

@Component({
  selector: 'pf-copy-to-clipboard-button',
  templateUrl: './copy-to-clipboard-button.component.html'
})
export class CopyToClipboardButtonComponent {
  @Input() toolTipText = '';
  @Input() copyText = '';

  constructor() {
  }

  onClipboardClick() {
    copyTextToClipboard(this.copyText);
  }
}
