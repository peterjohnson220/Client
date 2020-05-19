import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewEncapsulation, TemplateRef, ViewChild, OnDestroy, NgZone } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { filter, take } from 'rxjs/operators';
import { GridDataResult, PageChangeEvent, RowClassArgs, GridComponent, ColumnReorderEvent, ColumnComponent } from '@progress/kendo-angular-grid';

import { ViewField, PagingOptions, DataViewType, DataViewFieldDataType } from 'libs/models/payfactors-api';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { DataGridState, SelectAllStatus } from '../../reducers/pf-data-grid.reducer';
import { GridRowActionsConfig, PositionType } from '../../models';
import { MappedFieldNamePipe } from '../../pipes';

@Component({
  selector: 'pf-grid',
  templateUrl: './pf-grid.component.html',
  styleUrls: ['./pf-grid.component.scss'],
  providers: [MappedFieldNamePipe],
  encapsulation: ViewEncapsulation.None
})
export class PfGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() expandedRowTemplate: TemplateRef<any>;
  @Input() gridRowActionsConfig: GridRowActionsConfig;
  @Input() customHeaderTemplate: TemplateRef<any>;
  @Input() rowActionTemplate: TemplateRef<any>;
  @Input() noRecordsFoundTemplate: TemplateRef<any>;
  @Input() allowSplitView: boolean;
  @Input() splitViewDisplayFields = [];
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
  @Input() autoFitColumnsToHeader = false;
  @Input() pageable = true;
  @Input() theme: 'default' | 'next-gen' = 'default';
  @Input() customSortOptions: (sortDescriptor: SortDescriptor[]) => SortDescriptor[] = null;

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  pagingOptions$: Observable<PagingOptions>;
  sortDescriptor$: Observable<SortDescriptor[]>;
  defaultSortDescriptor$: Observable<SortDescriptor[]>;
  selectAllState$: Observable<string>;
  selectedKeys$: Observable<number[]>;

  expandedRowsSubscription: Subscription;
  expandedRows: number[];
  sortDescriptorSubscription: Subscription;
  defaultSortDescriptorSubscription: Subscription;
  dataFieldsSubscription: Subscription;

  dataSubscription: Subscription;
  data: GridDataResult;
  sortDescriptor: SortDescriptor[];
  defaultSortDescriptor: SortDescriptor[];

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


  constructor(private store: Store<fromReducer.State>, private ngZone: NgZone, private mappedFieldName: MappedFieldNamePipe) { }

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
    this.defaultSortDescriptorSubscription = this.defaultSortDescriptor$.subscribe(value => this.defaultSortDescriptor = value);

    this.primaryKeySubscription = this.store.select(fromReducer.getPrimaryKey, this.pageViewId).subscribe(primaryKey => {
      this.primaryKey = primaryKey;
    });

    this.selectionFieldSubscription = this.store.select(fromReducer.getSelectionField, this.pageViewId).subscribe(selectionField => {
      this.selectionField = selectionField;
    });

    this.saveSortSubscription = this.store.select(fromReducer.getSaveSort, this.pageViewId).subscribe(saveSort => {
      this.saveSort = saveSort;
    });

    this.dataFieldsSubscription = this.dataFields$.pipe(filter(df => !!df)).subscribe(df => {
      if (this.autoFitColumnsToHeader) {
        this.autoFitColumns(df.filter(d => d.IsSelected && d.IsSelectable && !d.Width).map(f => this.mappedFieldName.transform(f)));
      }
    });
  }

  ngOnDestroy() {
    this.expandedRowsSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.primaryKeySubscription.unsubscribe();
    this.selectionFieldSubscription.unsubscribe();
    this.sortDescriptorSubscription.unsubscribe();
    this.defaultSortDescriptorSubscription.unsubscribe();
    this.saveSortSubscription.unsubscribe();
    this.dataFieldsSubscription.unsubscribe();
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
      this.defaultSortDescriptor$ = this.store.select(fromReducer.getDefaultSortDescriptor, changes['pageViewId'].currentValue);
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
    // If selection is enabled: the first column can't be reordered
    // For ColumnGroup the first index is also 0, but the level = 1
    if (this.enableSelection && value.newIndex === 0 && value.column.level === 0) {
      value.preventDefault();
      return;
    }

    this.store.dispatch(new fromActions.ReorderColumns(
      this.pageViewId,
      {
        OldIndex: value.oldIndex,
        NewIndex: value.newIndex,
        Level: value.column.level,
        IsUseColumnGroupsEnabled: this.useColumnGroups,
        IsSelectionEnabled: this.enableSelection
      },
    ));
  }

  getColWidth(col: any) {
    let colWidth = col.Width;

    if (this.selectedRecordId) {
      colWidth = this.MIN_SPLIT_VIEW_COL_WIDTH;
    } else if (!!this.defaultColumnWidth && !this.autoFitColumnsToHeader && !col.Width) {
      colWidth = this.defaultColumnWidth;
    }

    return colWidth;
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromActions.UpdatePagingOptions(this.pageViewId, { From: event.skip, Count: event.take }));
  }

  // TODO: Kendo sorts the grids asc -> desc -> none in that order, rather than dir -> !dir -> none regardless of direction
  // If the default sort for a grid is to be ordered desc, there would be no way to order that column asc so we have to make the addt'l check
  // Achieving the 2nd sort direction logic requires additional effort
  onSortChange(sortDescriptor: SortDescriptor[]): void {
    let descriptorToDispatch = !sortDescriptor[0].dir ?
      this.defaultSortDescriptor :
      sortDescriptor;

    if (this.customSortOptions != null) {
      descriptorToDispatch = this.customSortOptions(descriptorToDispatch);
    }

    this.store.dispatch(new fromActions.UpdateSortDescriptor(this.pageViewId, descriptorToDispatch));
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
      return `text-${col.TextAlign}`;
    } else if (col.DataType === DataViewFieldDataType.Int || col.DataType === DataViewFieldDataType.Float) {
      return 'text-right';
    } else {
      return 'text-left';
    }
  }

  onSelectedKeysChange(selectedKey: number) {
    this.store.dispatch(new fromActions.UpdateSelectedKey(this.pageViewId, selectedKey));
  }

  onSelectAllChange() {
    this.store.dispatch(new fromActions.SelectAll(this.pageViewId));
  }

  // Note: We remove this function for dataFields$ in the template because it breaks the reorder column feature
  // TODO: We could try built in trackBy from kendo grid to track changes in data rows instead
  trackByField(index, field: ViewField) {
    return field
      ? field.DataElementId ? field.DataElementId : field.Group
      : index;
  }

  private autoFitColumns(columnFieldNames: string[]) {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns(this.grid.columnList.filter((c: any) => columnFieldNames.some(col => {
        return col === c.field;
      })));
    });
  }
}
