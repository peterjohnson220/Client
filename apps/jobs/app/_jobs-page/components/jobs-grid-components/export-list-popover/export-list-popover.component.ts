import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import * as fromJobsPageReducer from '../../../reducers';

@Component({
  selector: 'pf-export-list-popover',
  templateUrl: './export-list-popover.component.html',
  styleUrls: ['./export-list-popover.component.scss']
})

export class ExportListPopoverComponent implements OnDestroy {
  @Input() disablePopover: boolean;
  @Input() disabledPopoverTooltip: string;
  @Input() disableCustomExport = false;
  @Input() disabledCustomExportTooltip: string;
  @Output() exportEmitter = new EventEmitter();

  exportOptionsSubscription: Subscription;
  exportOptions = [];
  exportInProgress = false;

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.exportOptionsSubscription = this.store.select(fromJobsPageReducer.getExportOptions).subscribe(exportData => {
      if (exportData) {
        this.exportOptions = exportData;
        this.exportInProgress = exportData.some(d => d.Exporting.loading);
      }
    });
  }

  handleExportClicked(options: any, extension: string) {
    const metaData = {
      Options: options,
      Extension: extension
    };

    this.exportEmitter.emit(metaData);
  }

  ngOnDestroy() {
    this.exportOptionsSubscription.unsubscribe();
  }
}
