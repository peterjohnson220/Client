import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { PfGridColumnModel } from 'libs/models/common';

@Component({
  selector: 'pf-column-chooser',
  templateUrl: './column-chooser.component.html',
  styleUrls: ['./column-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ColumnChooserComponent {
  @Input() ListAreaColumns: PfGridColumnModel[];

  @Output() saveColumns = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public loading: any;

  saveButtonClicked() {
    this.saveColumns.emit(this.ListAreaColumns);
    this.p.close();
  }
}
