import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';


import { Subscription } from 'rxjs';

import { ExportOptions } from '../../models/export-options.model';

@Component({
  selector: 'pf-export-list-popover',
  templateUrl: './export-list-popover.component.html',
  styleUrls: ['./export-list-popover.component.scss']
})

export class ExportListPopoverComponent {
  @ViewChild('popover') popover: NgbPopover;
  @Input() disablePopover: boolean;
  @Input() disabledPopoverTooltip: string;
  @Input() disableCustomExport = false;
  @Input() disabledCustomExportTooltip: string;
  @Input() exportOptions: ExportOptions[];
  @Input() exportInProgress = false;
  @Input() requireSelectionText: string;
  @Output() exportEmitter = new EventEmitter();

  exportTitleText(customOptions?: boolean, requiresSelection?: boolean): string {
    if (this.exportInProgress) {
      return 'Download in progress';
    } else if ( this.disableCustomExport && customOptions) {
      return this.disabledCustomExportTooltip;
    } else if (requiresSelection) {
      return this.requireSelectionText;
    } else {
      return 'Click to download';
    }
  }

  handleExportClicked(options: any, extension: string) {
    const metaData = {
      Options: options,
      Extension: extension
    };

    this.exportEmitter.emit(metaData);
    this.popover.close();
  }
}
