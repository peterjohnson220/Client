import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'pf-export-list-popover',
  templateUrl: './export-list-popover.component.html',
  styleUrls: ['./export-list-popover.component.scss']
})

export class ExportListPopoverComponent {
  @Input() exportOptions: any[];
  @Input() disablePopover: boolean;
  @Input() disabledPopoverTooltip: string;
  @Input() disableCustomExport = false;
  @Input() disabledCustomExportTooltip: string;
  @Output() exportEmitter = new EventEmitter();

  constructor() {}

  handleExportClicked(options: any, extension: string) {
    const metaData = {
      Options: options,
      Extension: extension
    };

    this.exportEmitter.emit(metaData);
  }
}
