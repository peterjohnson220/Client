import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { ListAreaColumn } from 'libs/models/common';
import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionGridActions from '../../../actions/job-description-grid.actions';

@Component({
  selector: 'pf-column-selector-popover',
  templateUrl: './column-selector-popover.component.html',
  styleUrls: ['./column-selector-popover.component.scss']
})

export class ColumnSelectorPopoverComponent implements OnChanges {
  @Input() canRestrictJobDescriptionFromPublicView: boolean;
  @Input() listAreaColumns: ListAreaColumn[];
  @ViewChild('columnPopover', { static: true }) public columnPopover: any;

  public filter: any;
  public loading: any;
  public columnSearchTerm: any;

  private unsavedColumns: ListAreaColumn[];

  constructor(private store: Store<fromJobDescriptionReducers.State>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listAreaColumns'] && changes['listAreaColumns'].currentValue !== changes['listAreaColumns'].previousValue) {
      this.unsavedColumns = cloneDeep(this.listAreaColumns);
    }
  }

  columnChecked(listAreaColumn: ListAreaColumn, checked: boolean) {
    const index = this.unsavedColumns.findIndex(c => c.ListAreaColumnId === listAreaColumn.ListAreaColumnId);
    this.unsavedColumns[index].Visible = checked;
    event.stopPropagation();
  }

  saveButtonClicked() {
    this.store.dispatch(new fromJobDescriptionGridActions.SaveListAreaColumns({ Columns: this.unsavedColumns }));
    this.columnPopover.close();
  }
}
