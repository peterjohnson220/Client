import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewEncapsulation, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { GridDataResult, PageChangeEvent, RowClassArgs, GridComponent } from '@progress/kendo-angular-grid';
import { ViewField, PagingOptions } from 'libs/models/payfactors-api';
import { DataGridState, SelectAllStatus } from '../../reducers/pf-data-grid.reducer';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'pf-grid',
  templateUrl: './pf-grid.component.html',
  styleUrls: ['./pf-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PfGridComponent implements OnInit, OnDestroy, OnChanges {

  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() expandedRowTemplate: TemplateRef<any>;
  @Input() customHeaderTemplate: TemplateRef<any>;
  @Input() rowActionTemplate: TemplateRef<any>;
  @Input() allowSplitView: boolean;
  @Input() selectedRecordId: number;
  @Input() enableSelection = false;
  @Input() noRecordsFound: string;
  @Input() compactGrid = false;
  @Input() backgroundColor: string;
  @Input() allowSort = true;
  @Input() customHeaderClass: string;
  @Input() defaultColumnWidth: number;

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  pagingOptions$: Observable<PagingOptions>;
  sortDescriptor$: Observable<SortDescriptor[]>;
  selectAllState$: Observable<string>;
  selectedKeys$: Observable<number[]>;

  expandedRowsSubscription: Subscription;
  expandedRows: number[];

  dataSubscription: Subscription;
  data: GridDataResult;

  primaryKeySubscription: Subscription;
  primaryKey: string;

  selectionFieldSubscription: Subscription;
  selectionField: string;

  selectAllStatus = SelectAllStatus;

  @ViewChild(GridComponent, { static: false }) grid: GridComponent;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() {
    this.dataSubscription = this.store.select(fromReducer.getData, this.pageViewId).subscribe(newData => {
      this.data = newData;
      if (this.data && this.grid) {
        this.grid.resetGroupsState();
        for (let index = 0; index < this.data.data.length; index++) {
          if (!this.expandedRows.includes(index)) {
            this.grid.collapseRow(index);
          }
        }
      }
    });

    this.expandedRowsSubscription = this.store.select(fromReducer.getExpandedRows, this.pageViewId).subscribe(expandedRows => {
      this.expandedRows = expandedRows;
    });

    this.primaryKeySubscription = this.store.select(fromReducer.getPrimaryKey, this.pageViewId).subscribe(primaryKey => {
      this.primaryKey = primaryKey;
    });

    this.selectionFieldSubscription = this.store.select(fromReducer.getSelectionField, this.pageViewId).subscribe(selectionField => {
      this.selectionField = selectionField;
    });
  }

  ngOnDestroy() {
    this.expandedRowsSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.primaryKeySubscription.unsubscribe();
    this.selectionFieldSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      if (this.grid) {
        this.grid.resetGroupsState();
      }
      this.gridState$ = this.store.select(fromReducer.getGrid, changes['pageViewId'].currentValue);
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      this.dataFields$ = this.store.select(fromReducer.getGroupedFields, changes['pageViewId'].currentValue);
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
    return (!this.selectedRecordId || col.IsLocked) && col.IsSelectable && col.IsSelected;
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

  onCellClick({ dataItem, rowIndex }) {
    if (getSelection().toString()) {
      // User is highlighting text so we don't want to mark this as a click
    } else if (this.allowSplitView) {
      this.store.dispatch(new fromActions.UpdateSelectedRecordId(this.pageViewId, dataItem[this.primaryKey], '='));
    } else if (this.expandedRowTemplate) {
      if (this.expandedRows.includes(rowIndex)) {
        this.store.dispatch(new fromActions.CollapseRow(this.pageViewId, rowIndex));
        this.grid.collapseRow(rowIndex);
      } else {
        this.store.dispatch(new fromActions.ExpandRow(this.pageViewId, rowIndex));
        this.grid.expandRow(rowIndex);
      }
    } else if (this.enableSelection) {
      this.store.dispatch(new fromActions.UpdateSelectedKey(this.pageViewId, dataItem[this.primaryKey]));
    }
  }

  getGridColumnHeaderClass(col: ViewField) {
    const headerClass = this.compactGrid ? 'pf-data-grid-no-header' : 'pf-data-grid-header';
    let textAlignClass = !!col && !!col.TextAlign ? `text-align-${col.TextAlign}` : '';
    // [GL] adding truthy check since the kendo action column does not have a ViewField bound to it, but it still calls this function
    if (col && col.Group) {
      textAlignClass = 'text-align-center';
    }
    return `${this.customHeaderClass || ''} ${headerClass} ${textAlignClass}`.trim();
  }

  getCheckboxHeaderClass() {
    return `${this.customHeaderClass || ''} pf-grid-checkbox`.trim();
  }

  getRowClasses = (context: RowClassArgs) => ({
    'pf-data-grid-clickable-row': this.selectionField,
    'pf-data-grid-non-clickable-row': this.compactGrid,
    'k-state-selected': this.selectionField && !this.compactGrid && (context.dataItem[this.primaryKey] === this.selectedRecordId)
  })

  getColumnClasses(col: ViewField) {
    return this.columnTemplates && this.columnTemplates[col.SourceName] && this.columnTemplates[col.SourceName].IsCompact ? 'pf-data-grid-compact-cell' : '';
  }

  isSortable() {
    return this.allowSort ? this.selectedRecordId ? null : `{allowUnsort: 'true', mode: 'single'}` : null;
  }

  getPagingBarConfig(state: DataGridState) {
    if (state && state.data && state.pagingOptions && (state.data.total / state.pagingOptions.Count) > 1) {
      if (this.selectedRecordId) {
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

  onSelectedKeysChange(selectedKey: number) {
    this.store.dispatch(new fromActions.UpdateSelectedKey(this.pageViewId, selectedKey));
  }

  onSelectAllChange() {
    this.store.dispatch(new fromActions.SelectAll(this.pageViewId));
  }

  trackByField(index, field: ViewField) {
    return field
      ? field.DataElementId ? field.DataElementId : field.Group
      : index;
  }

}
