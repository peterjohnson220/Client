import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';

import { ListAreaColumn } from 'libs/models/common/list-area';

@Component({
  selector: 'pf-list-area-column-chooser',
  templateUrl: './list-area-column-chooser.component.html',
  styleUrls: ['./list-area-column-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListAreaColumnChooserComponent implements OnChanges {
  @Input() listAreaColumns: ListAreaColumn[];
  @Output() saveColumns: EventEmitter<ListAreaColumn[]> = new EventEmitter();

  @ViewChild('columnPopover', { static: true }) public columnPopover: any;

  public filter: any;
  private unsavedColumns: ListAreaColumn[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.listAreaColumns?.currentValue) {
      this.unsavedColumns = orderBy(cloneDeep(changes.listAreaColumns.currentValue), ['Order'], ['asc']);
    }
  }

  saveButtonClicked() {
    this.saveColumns.emit(this.unsavedColumns);
    this.columnPopover.close();
  }

  onHidden() {
    this.filter = '';
    this.unsavedColumns = orderBy(cloneDeep(this.listAreaColumns), ['Order'], ['asc']);
  }
}
