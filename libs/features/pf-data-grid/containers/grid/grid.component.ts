import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import {GridDataResult, PageChangeEvent, RowClassArgs} from '@progress/kendo-angular-grid';
import { ViewField, PagingOptions } from 'libs/models/payfactors-api';
import { DataGridState } from '../../reducers/pf-data-grid.reducer';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'pf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridComponent implements OnInit, OnChanges {

  @Input() selectionEntityName: string;
  @Input() selectionField: string;
  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() selectedRowId: number;
  @Input() allowSplitView: boolean;
  @Input() enableSelection = false;

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  data$: Observable<GridDataResult>;
  pagingOptions$: Observable<PagingOptions>;
  sortDescriptor$: Observable<SortDescriptor[]>;

  selectAllState$: Observable<string>;
  selectedKeys$: Observable<number[]>;
  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.gridState$ = this.store.select(fromReducer.getGrid, changes['pageViewId'].currentValue);
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      this.dataFields$ = this.store.select(fromReducer.getGroupedFields, changes['pageViewId'].currentValue);
      this.data$ = this.store.select(fromReducer.getData, changes['pageViewId'].currentValue);
      this.pagingOptions$ = this.store.select(fromReducer.getPagingOptions, changes['pageViewId'].currentValue);
      this.sortDescriptor$ = this.store.select(fromReducer.getSortDescriptor, changes['pageViewId'].currentValue);
      this.selectedKeys$ = this.store.select(fromReducer.getSelectedKeys, changes['pageViewId'].currentValue);
      this.selectAllState$ = this.store.select(fromReducer.getSelectAllState, changes['pageViewId'].currentValue);
    }
  }

  getValue(row: any, colName: string[]): string[] {
    const values = colName.map(val => row[val]);
    return values;
  }

  showColumn(col: ViewField) {
    return (!this.selectedRowId || col.IsLocked) && col.IsSelectable && col.IsSelected;
  }

  mappedFieldName(col: ViewField): string {
    return (col.EntitySourceName ? col.EntitySourceName + '_' : '') + col.SourceName;
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromActions.UpdatePagingOptions(this.pageViewId, { From: event.skip, Count: event.take }));
  }

  onSortChange(sortDescriptor: SortDescriptor[]): void {
    this.store.dispatch(new fromActions.UpdateSortDescriptor(this.pageViewId, sortDescriptor));
  }

  onCellClick({ dataItem }) {
    if (this.allowSplitView && !getSelection().toString()) {
      this.store.dispatch(new fromActions.UpdateSelectedRowId(this.pageViewId, dataItem[this.getSelectedRowIdentifier()], this.selectionField));
    }
  }

  selectedRowClass = (context: RowClassArgs) => ({
    'k-state-selected': context.dataItem[this.getSelectedRowIdentifier()] === this.selectedRowId
  })

  getPagingBarConfig(state: DataGridState) {
    if (this.isMultiplePages(state)) {
      if (this.selectedRowId) {
        return {
          info: true,
          type: 'input',
          pageSizes: false,
          previousNext: true
        };
      } else {
        return {
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: false,
          previousNext: true
        };
      }
    }
    return false;
  }

  isMultiplePages(state: DataGridState) {
    return state && state.data && (state.data.total / state.pagingOptions.Count) > 1;
  }

  isSortable() {
    return this.selectedRowId ? null : `{allowUnsort: 'true', mode: 'single'}`;
  }

  getSelectedRowIdentifier() {
    return `${this.selectionEntityName}_${this.selectionField}`;
  }

  onSelectedKeysChange(selectedKey: number) {
    this.store.dispatch(new fromActions.UpdateSelectedKey(this.pageViewId, selectedKey));
  }

  isChecked(selectedKeys, id) {
    return (selectedKeys && selectedKeys.indexOf(id) > -1 );
  }

  onSelectAllChange() {
    this.store.dispatch(new fromActions.SelectAll(this.pageViewId, this.getSelectedRowIdentifier()));
  }
}
