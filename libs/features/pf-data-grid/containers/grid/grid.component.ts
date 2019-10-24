import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { ViewField } from 'libs/models/payfactors-api';

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

  loading$: Observable<boolean>;
  dataFields$: Observable<any[]>;
  data$: Observable<GridDataResult>;
  pageSize$: Observable<number>;
  skip$: Observable<number>;

  pageSize = 25;
  skip = 0;

  selectedRowId: number;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      this.dataFields$ = this.store.select(fromReducer.getGroupedFields, changes['pageViewId'].currentValue);
      this.data$ = this.store.select(fromReducer.getGridData, changes['pageViewId'].currentValue);
      this.pageSize$ = this.store.select(fromReducer.getPageSize, changes['pageViewId'].currentValue);
      this.skip$ = this.store.select(fromReducer.getSkip, changes['pageViewId'].currentValue);
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
    this.store.dispatch(new fromActions.UpdateSkip(this.pageViewId, event.skip));
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

  getPagingBarConfig() {
    if (this.isCompact) {
      return {
        info: true,
        type: 'input',
        pageSizes: false,
        previousNext: true
      };
    }
    return {
      buttonCount: 8,
      info: true,
      type: 'numeric',
      pageSizes: false,
      previousNext: true
    };
  }

 
}
