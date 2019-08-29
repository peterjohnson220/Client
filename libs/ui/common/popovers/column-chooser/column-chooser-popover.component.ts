import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { PfGridColumnModel } from 'libs/models/common';

@Component({
  selector: 'pf-column-chooser-popover',
  templateUrl: './column-chooser-popover.component.html',
  styleUrls: ['./column-chooser-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ColumnChooserPopoverComponent {
  @Input() ListAreaColumns: PfGridColumnModel[];

  @Output() saveColumns = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public loading = false; // : any;
  public columnSearchTerm: any;

  saveButtonClicked() {
    this.saveColumns.emit(this.ListAreaColumns);
    this.p.close();
  }
}
