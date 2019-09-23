import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as cloneDeep from 'lodash.clonedeep';
import { PfDataGridFieldModel } from 'libs/models/common';

@Component({
  selector: 'pf-column-chooser',
  templateUrl: './column-chooser.component.html',
  styleUrls: ['./column-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ColumnChooserComponent implements OnChanges {
  @Input() dataFields: PfDataGridFieldModel[];

  @Output() saveColumns = new EventEmitter();

  listAreaColumns = [];

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public loading: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataFields']) {
      this.listAreaColumns = cloneDeep(changes['dataFields'].currentValue);
    }
  }

  saveButtonClicked() {
    this.saveColumns.emit(this.listAreaColumns);
    this.p.close();
  }
}
