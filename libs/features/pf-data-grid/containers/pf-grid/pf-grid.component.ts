import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewEncapsulation, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { GridDataResult, PageChangeEvent, RowClassArgs, GridComponent, ColumnReorderEvent } from '@progress/kendo-angular-grid';
import { ViewField, PagingOptions, DataViewType, DataViewFieldDataType } from 'libs/models/payfactors-api';
import { DataGridState, SelectAllStatus } from '../../reducers/pf-data-grid.reducer';
import { SortDescriptor } from '@progress/kendo-data-query';
import {GridRowActionsConfig, PositionType} from '../../models';

@Component({
  selector: 'pf-grid',
  templateUrl: './pf-grid.component.html',
  styleUrls: ['./pf-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PfGridComponent implements OnInit, OnDestroy, OnChanges {

  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() gridRowActionsConfig: GridRowActionsConfig;
  @Input() expandedRowTemplate: TemplateRef<any>;
  @Input() customHeaderTemplate: TemplateRef<any>;
  @Input() allowSplitView: boolean;
  @Input() selectedRecordId: number;
  @Input() enableSelection = false;
  @Input() noRecordsFound: string;
  @Input() compactGrid = false;
  @Input() backgroundColor: string;
  @Input() allowSort = true;
  @Input() reorderable = false;
  @Input() customHeaderClass: string;
  @Input() defaultColumnWidth: number;
  @Input() showHeaderWhenCompact: boolean;
  @Input() useColumnGroups = true;

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  pagingOptions$: Observable<PagingOptions>;
  sortDescriptor$: Observable<SortDescriptor[]>;
  selectAllState$: Observable<string>;
  selectedKeys$: Observable<number[]>;

  expandedRowsSubscription: Subscription;
  expandedRows: number[];
  sortDescriptorSubscription: Subscription;

  dataSubscription: Subscription;
  data: GridDataResult;
  sortDescriptor: SortDescriptor[];

  primaryKeySubscription: Subscription;
  primaryKey: string;

  selectionFieldSubscription: Subscription;
  selectionField: string;

  saveSortSubscription: Subscription;
  saveSort: boolean;

  selectAllStatus = SelectAllStatus;

  pagingBarConfig = null;

  positionType = PositionType;

  readonly MIN_SPLIT_VIEW_COL_WIDTH = 100;

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
    this.sortDescriptorSubscription = this.sortDescriptor$.subscribe(value => this.sortDescriptor = value);

    this.primaryKeySubscription = this.store.select(fromReducer.getPrimaryKey, this.pageViewId).subscribe(primaryKey => {
      this.primaryKey = primaryKey;
    });

    this.selectionFieldSubscription = this.store.select(fromReducer.getSelectionField, this.pageViewId).subscribe(selectionField => {
      this.selectionField = selectionField;
    });

    this.saveSortSubscription = this.store.select(fromReducer.getSaveSort, this.pageViewId).subscribe(saveSort => {
      this.saveSort = saveSort;
    });
  }

  ngOnDestroy() {
    this.expandedRowsSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.primaryKeySubscription.unsubscribe();
    this.selectionFieldSubscription.unsubscribe();
    this.sortDescriptorSubscription.unsubscribe();
    this.saveSortSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      if (this.grid) {
        this.grid.resetGroupsState();
      }
      this.gridState$ = this.store.select(fromReducer.getGrid, changes['pageViewId'].currentValue);
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      if (this.useColumnGroups) {
        this.dataFields$ = this.store.select(fromReducer.getGroupedFields, changes['pageViewId'].currentValue);
      } else {
        this.dataFields$ = this.store.select(fromReducer.getVisibleOrderedFields, changes['pageViewId'].currentValue);
      }

      this.pagingOptions$ = this.store.select(fromReducer.getPagingOptions, changes['pageViewId'].currentValue);
      this.sortDescriptor$ = this.store.select(fromReducer.getSortDescriptor, changes['pageViewId'].currentValue);
      this.selectedKeys$ = this.store.select(fromReducer.getSelectedKeys, changes['pageViewId'].currentValue);
      this.selectAllState$ = this.store.select(fromReducer.getSelectAllState, changes['pageViewId'].currentValue);
    }

    if (changes['selectedRecordId']) {
      this.pagingBarConfig = changes['selectedRecordId'].currentValue ?
        {
          info: true,
          type: 'input',
          pageSizes: false,
          previousNext: true
        } : {
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: [20, 50, 100, 250],
          previousNext: true
        };
    }
  }

  onColumnReorder(value: ColumnReorderEvent) {
    this.store.dispatch(new fromActions.ReorderColumns(
      this.pageViewId,
      value.oldIndex - 1,
      value.newIndex - 1,
    ));
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
    if (this.saveSort) {
      this.store.dispatch(new fromActions.SaveView(this.pageViewId, null, DataViewType.userDefault));
    }
  }

  onCellClick({ dataItem, rowIndex, originalEvent }) {

    if (originalEvent.button !== 0) {
      return;
    }

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

  getColumnHeaderClass(): string {
    return this.compactGrid && !this.showHeaderWhenCompact ? 'pf-data-grid-no-header' : 'pf-data-grid-header';
  }

  getCheckboxHeaderClass() {
    return `${this.customHeaderClass || ''} pf-grid-checkbox`.trim();
  }

  getRowClasses = (context: RowClassArgs) => ({
    'pf-data-grid-clickable-row': this.selectionField,
    'pf-data-grid-non-clickable-row': this.compactGrid,
    'k-state-selected': this.selectionField && !this.compactGrid && (context.dataItem[this.primaryKey] === this.selectedRecordId)
  })

  getColumnClasses(col: ViewField): string {
    return this.columnTemplates && this.columnTemplates[col.SourceName] && this.columnTemplates[col.SourceName].IsCompact
      ? 'pf-data-grid-compact-cell' : '';
  }

  getColTextAlignClass(col: ViewField): string {
    if (!col) {
      return '';
    } else if (col.TextAlign) {
      return  `text-${col.TextAlign}`;
    } else if (col.DataType === DataViewFieldDataType.Int || col.DataType === DataViewFieldDataType.Float) {
      return 'text-right';
    } else {
      return 'text-left';
    }
  }

  isSortable() {
    return this.allowSort ? this.selectedRecordId ? null : `{allowUnsort: 'true', mode: 'single'}` : null;
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
