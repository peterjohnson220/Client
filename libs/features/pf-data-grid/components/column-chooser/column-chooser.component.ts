import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

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
  @Input() reorderable: boolean;

  @Output() saveColumns = new EventEmitter();

  listAreaColumns = [];

  @ViewChild('p', { static: true }) public p: any;
  @ViewChild('columnGroupList', { static: false }) public columnGroupList: ColumnGroupListComponent;

  public filter: any;
  public loading: any;
  columnChooserTypes = ColumnChooserType;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataFields']) {
      this.listAreaColumns = orderBy(cloneDeep(changes['dataFields'].currentValue), ['DefaultOrder'], ['asc']);
    }
  }

  saveButtonClicked() {
    // If grid is reorderable then update Order to NULL for all new chosen columns
    // in this case they will be added to the end of the grid
    let fields;
    if (this.columnChooserType === ColumnChooserType.ColumnGroup) {
      fields = this.reorderable
        ? this.updateNewColumnsOrder(cloneDeep(this.columnGroupList.allFields))
        : this.columnGroupList.allFields;
    } else {
      fields = this.reorderable
        ? this.updateNewColumnsOrder(cloneDeep(this.listAreaColumns))
        : this.listAreaColumns;
    }

    this.saveColumns.emit(fields);
    this.p.close();
  }

  onHidden() {
    this.filter = '';
    this.listAreaColumns = orderBy(cloneDeep(this.dataFields), ['DefaultOrder'], ['asc']);
  }

  private updateNewColumnsOrder(fields: ViewField[]): ViewField[] {
    const selectedFields = fields.filter(f => f.IsSelectable && f.IsSelected);
    selectedFields.forEach((selectedField) => {
      if (this.dataFields.find(f => f.DataElementId === selectedField.DataElementId && !f.IsSelected)) {
        selectedField.Order = null;
      }
    });

    return fields;
  }
}
