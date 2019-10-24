import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { ViewField, PagingOptions } from 'libs/models/payfactors-api';
import { DataGridState } from '../../reducers/pf-data-grid.reducer';

@Component({
  selector: 'pf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridComponent implements OnInit, OnChanges {

  @Input() primaryKey: string;
  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() allowSplitView = false;
  @Input() isCompact = false;

  @Output() rowSelected = new EventEmitter();

  gridState$: Observable<DataGridState>;
  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  data$: Observable<GridDataResult>;
  pagingOptions$: Observable<PagingOptions>;
  pageCount$: Observable<number>;

  selectedRowId: number;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.gridState$ = this.store.select(fromReducer.getGrid, changes['pageViewId'].currentValue);
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      this.dataFields$ = this.store.select(fromReducer.getGroupedFields, changes['pageViewId'].currentValue);
      this.data$ = this.store.select(fromReducer.getData, changes['pageViewId'].currentValue);
      this.pagingOptions$ = this.store.select(fromReducer.getPagingOptions, changes['pageViewId'].currentValue);
    } else if (changes['isCompact'] && !changes['isCompact'].currentValue) {
      this.selectedRowId = null;
    }
  }

  getValue(row: any, colName: string[]): string[] {
    const values = colName.map(val => row[val]);
    return values;
  }

  showColumn(col: ViewField) {
    return (!this.isCompact || col.IsLocked) && col.IsSelectable && col.IsSelected;
  }

  mappedFieldName(col: ViewField): string {
    return (col.EntitySourceName ? col.EntitySourceName + '_' : '') + col.SourceName;
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromActions.UpdatePagingOptions(this.pageViewId, { From: event.skip, Count: event.take }));
  }

  onCellClick({ dataItem }) {
    if (this.allowSplitView && !getSelection().toString()) {
      this.selectedRowId = dataItem[this.primaryKey];
      this.rowSelected.emit();
    }
  }

  public selectedRowClass = (context: RowClassArgs) => ({
    'k-state-selected': context.dataItem[this.primaryKey] === this.selectedRowId
  })

  getPagingBarConfig(state: DataGridState) {
    if (state && state.data && (state.data.total / state.pagingOptions.Count) <= 1) {
      return false;
    }

    if (this.isCompact) {
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
}
