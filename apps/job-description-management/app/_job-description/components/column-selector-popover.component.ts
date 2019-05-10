import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { ListAreaColumn } from 'libs/models/common';

@Component({
  selector: 'pf-column-selector-popover',
  templateUrl: './column-selector-popover.component.html',
  styleUrls: ['./column-selector-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ColumnSelectorPopoverComponent {
  @Input() ListAreaColumns: ListAreaColumn[];

  @Output() columnModified = new EventEmitter();
  @Output() saveColumns = new EventEmitter();

  @ViewChild('p') public p: any;

  public filter: any;
  public loading: any;
  public columnSearchTerm: any;

  columnChecked(listAreaColumn: ListAreaColumn, checked: boolean) {
    this.columnModified.emit({listAreaColumn, checked});
  }

  saveButtonClicked() {
    this.saveColumns.emit(this.ListAreaColumns);
    this.p.close();
  }
}
