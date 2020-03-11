import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api';

import { ColumnGroupListComponent } from '../column-group-list';
import { ColumnChooserType } from '../../models';

@Component({
  selector: 'pf-column-chooser',
  templateUrl: './column-chooser.component.html',
  styleUrls: ['./column-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ColumnChooserComponent implements OnChanges {
  @Input() dataFields: ViewField[];
  @Input() disabled = false;
  @Input() columnChooserType: ColumnChooserType;

  @Output() saveColumns = new EventEmitter();

  listAreaColumns = [];

  @ViewChild('p', { static: true }) public p: any;
  @ViewChild('columnGroupList', { static: false }) public columnGroupList: ColumnGroupListComponent;

  public filter: any;
  public loading: any;
  columnChooserTypes = ColumnChooserType;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataFields']) {
      this.listAreaColumns = cloneDeep(changes['dataFields'].currentValue);
    }
  }

  saveButtonClicked() {
    if (this.columnChooserType === ColumnChooserType.ColumnGroup) {
      this.saveColumns.emit(this.columnGroupList.allFields);
    } else {
      this.saveColumns.emit(this.listAreaColumns);
    }
    this.p.close();
  }

  onHidden() {
    this.filter = '';
    this.listAreaColumns = cloneDeep(this.dataFields);
  }
}
