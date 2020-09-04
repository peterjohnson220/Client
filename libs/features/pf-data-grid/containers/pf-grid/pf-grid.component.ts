import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  TemplateRef,
  ViewChild,
  OnDestroy,
  NgZone,
  EventEmitter,
  Output
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { filter, take } from 'rxjs/operators';
import {
  GridDataResult,
  PageChangeEvent,
  RowClassArgs,
  GridComponent,
  ColumnReorderEvent,
  ColumnComponent,
  ContentScrollEvent,
  ColumnResizeArgs
} from '@progress/kendo-angular-grid';

import { ViewField, PagingOptions, DataViewType, DataViewFieldDataType } from 'libs/models/payfactors-api';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { DataGridState, SelectAllStatus } from '../../reducers/pf-data-grid.reducer';
import { GridRowActionsConfig, PositionType, GridConfig, ColumnResize } from '../../models';
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
  @Input() modifiedKey: string = null;
  @Input() resetWidthForSplitView = false;
  @Input() allowMultipleSort = false;
  @Input() showSortControls = true;
  @Output() scrolled = new EventEmitter<ContentScrollEvent>();

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  pagingOptions$: Observable<PagingOptions>;
  sortDescriptor$: Observable<SortDescriptor[]>;
  defaultSortDescriptor$: Observable<SortDescriptor[]>;
  selectAllState$: Observable<string>;
  selectedKeys$: Observable<number[]>;
  totalCount$: Observable<number>;

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

  gridConfigSubscription: Subscription;
  gridConfig: GridConfig;

  modifiedKeys: any[];
  modifiedKeysSubscription: Subscription;

  loadingMoreData: boolean;
  loadingMoreDataSubscription: Subscription;
  hasMoreDataOnServer: boolean;
  hasMoreDataOnServerSubscription: Subscription;

  lastUpdateFieldsDateSubscription: Subscription;

  readonly MIN_SPLIT_VIEW_COL_WIDTH = 100;

  @ViewChild(GridComponent) grid: GridComponent;

  constructor(private store: Store<fromReducer.State>, private ngZone: NgZone, private mappedFieldName: MappedFieldNamePipe) {}

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

    this.gridConfigSubscription = this.store.select(fromReducer.getGridConfig, this.pageViewId).subscribe(gridConfig => this.gridConfig = gridConfig);

    this.hasMoreDataOnServerSubscription = this.store.select(fromReducer.getHasMoreDataOnServer, this.pageViewId)
      .subscribe(hasMoreData => this.hasMoreDataOnServer = hasMoreData);
    this.loadingMoreDataSubscription = this.store.select(fromReducer.getLoadingMoreData, this.pageViewId)
      .subscribe(loadingMoreData => this.loadingMoreData = loadingMoreData);

    this.lastUpdateFieldsDateSubscription = this.store.select(fromReducer.getLastUpdateFieldsDate, this.pageViewId).subscribe(lastUpdateFieldsDate => {
      if (this.grid != null) {
        const columns = this.grid.columns.toArray();
        columns.forEach(function (gridColumn, index) {
          if (gridColumn.orderIndex !== index) {
            gridColumn.orderIndex = index;
          }
        });
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
    this.gridConfigSubscription.unsubscribe();
    this.modifiedKeysSubscription.unsubscribe();
    this.loadingMoreDataSubscription.unsubscribe();
    this.hasMoreDataOnServerSubscription.unsubscribe();
    this.lastUpdateFieldsDateSubscription.unsubscribe();
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
      this.totalCount$ = this.store.select(fromReducer.getTotalCount, changes['pageViewId'].currentValue);
      this.selectAllState$ = this.store.select(fromReducer.getSelectAllState, changes['pageViewId'].currentValue);
      this.modifiedKeysSubscription = this.store.select(fromReducer.getModifiedKeys, changes['pageViewId'].currentValue).subscribe(
        modifiedKeys => this.modifiedKeys = modifiedKeys
      );
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
    if (this.shouldIgnoreColumnReorderEvent(value)) {
      return;
    }
    this.store.dispatch(new fromActions.ReorderColumns(
      this.pageViewId,
      {
        OldIndex: value.oldIndex,
        NewIndex: value.newIndex,
        Level: value.column.level,
        IsUseColumnGroupsEnabled: this.useColumnGroups,
        IsSelectionEnabled: this.enableSelection,
        ActionsDefined: !!this.gridRowActionsConfig
      },
    ));
  }

  loadMore() {
    if (!this.loadingMoreData && this.hasMoreDataOnServer && this.enableInfiniteScroll) {
      this.store.dispatch(new fromActions.LoadMoreData(this.pageViewId));
    }
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

  onScroll(event: ContentScrollEvent): void {
    this.store.dispatch(new fromActions.CaptureGridScrolled(this.pageViewId, event));
  }

  // TODO: Kendo sorts the grids asc -> desc -> none in that order, rather than dir -> !dir -> none regardless of direction
  // If the default sort for a grid is to be ordered desc, there would be no way to order that column asc so we have to make the addt'l check
  // Achieving the 2nd sort direction logic requires additional effort
  onSortChange(sortDescriptor: SortDescriptor[]): void {
    if (this.gridConfig?.ScrollToTop) {
      this.scrollToTop();
    }
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

  onCellClick({ dataItem, rowIndex, originalEvent, column }) {
    if (originalEvent.button !== 0 || column?.title === this.gridRowActionsConfig?.Title) {
      return;
    }

    if (getSelection().toString()) {
      // User is highlighting text so we don't want to mark this as a click
    } else if (this.allowSplitView) {
      if (this.resetWidthForSplitView) {
        this.resetKendoGridWidth();
      }

      // close split view when we click on the selected record. Otherwise select another record
      if (dataItem[this.primaryKey] === this.selectedRecordId) {
        this.store.dispatch(new fromActions.CloseSplitView(this.pageViewId));
      } else {
        this.store.dispatch(new fromActions.UpdateSelectedRecordId(this.pageViewId, dataItem[this.primaryKey], '='));
      }
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
    return this.compactGrid && !this.showHeaderWhenCompact
      ? 'pf-data-grid-no-header'
      : this.showSortControls
        ? 'pf-data-grid-header'
        : 'pf-data-grid-header no-sort-controls';
  }

  getCheckboxHeaderClass() {
    return `${this.customHeaderClass || ''} pf-grid-checkbox`.trim();
  }

  getRowClasses = (context: RowClassArgs) => {
    return {
      'pf-data-grid-clickable-row': this.selectionField,
      'pf-data-grid-non-clickable-row': this.compactGrid,
      'k-state-selected': this.selectionField && !this.compactGrid && (context.dataItem[this.primaryKey] === this.selectedRecordId),
      'pf-data-grid-modified-row': this.modifiedKey !== null && this.modifiedKeys != null
        && this.modifiedKeys.includes(context.dataItem[this.modifiedKey])
    };
  }

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

  onColumnResize(event: ColumnResizeArgs[]): void {
    if (!this.gridConfig?.PersistColumnWidth || event?.length < 1) {
      return;
    }
    const column = event[0].column as ColumnComponent;
    const columnResize: ColumnResize = {
      FieldSourceName: column.field,
      OldWidth: event[0].oldWidth,
      NewWidth: event[0].newWidth
    };
    this.store.dispatch(new fromActions.UpdateColumnWidth(this.pageViewId, columnResize));
    this.store.dispatch(new fromActions.SaveView(this.pageViewId, null, DataViewType.userDefault));
  }

  get enableInfiniteScroll(): boolean {
    return this.gridConfig?.EnableInfiniteScroll && !this.pageable;
  }

  private scrollToTop(): void {
    const gridContentElements = this.grid.wrapper.nativeElement.getElementsByClassName('k-grid-content');
    if (gridContentElements?.length) {
      const gridContent = gridContentElements[0];
      gridContent.scrollTop = 0;
    }
  }

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

  private shouldIgnoreColumnReorderEvent(event: ColumnReorderEvent): boolean {
    // If selection is enabled: the first column can't be reordered
    // For ColumnGroup the first index is also 0, but the level = 1
    const isReplacingSelectionColumn = this.enableSelection && event.newIndex === 0 && event.column.level === 0;
    const hasActionsColumnOnTheLeft = this.gridRowActionsConfig?.Position === PositionType.Left;
    const actionsColumnIndex = this.enableSelection ? 1 : 0;
    if (isReplacingSelectionColumn || (hasActionsColumnOnTheLeft && event.newIndex === actionsColumnIndex)) {
      if (event.column.reorderable) {
        event.preventDefault();
      }
      return true;
    }
    return false;
  }

  private resetKendoGridWidth() {
    const grids = window.document.getElementsByTagName('kendo-grid') || [];
    Array.from(grids).forEach((g: HTMLElement) => {
      const tables = g.getElementsByTagName('table') || [];
      Array.from(tables).forEach((t: HTMLElement) => {
        t.setAttribute('style', null);
      });
    });
  }
}
