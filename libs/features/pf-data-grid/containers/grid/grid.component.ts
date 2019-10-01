import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ViewField } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  @Input() primaryKey: string;
  @Input() pageViewId: string;
  @Input() columnTemplates: any;
  @Input() isCompact = false;
  @Input() selection = [];

  loading$: Observable<boolean>;
  dataFields$: Observable<ViewField[]>;
  data$: Observable<GridDataResult>;
  pageSize$: Observable<number>;
  skip$: Observable<number>;

  public pageSize = 25;
  public skip = 0;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.loading$ = this.store.select(fromReducer.getLoading, changes['pageViewId'].currentValue);
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.data$ = this.store.select(fromReducer.getGridData, changes['pageViewId'].currentValue);
      this.pageSize$ = this.store.select(fromReducer.getPageSize, changes['pageViewId'].currentValue);
      this.skip$ = this.store.select(fromReducer.getSkip, changes['pageViewId'].currentValue);
    }
  }

  getValue(row: any, colName: string[]): string[] {
    const values = colName.map(val => row[val]);
    return values;
  }

  showColumn(col: ViewField) {
    return (!this.isCompact || col.IsLocked) && col.IsSelectable && col.IsSelected;
  }

  mappedColumnName(col: ViewField): string {
    return (col.EntitySourceName ? col.EntitySourceName + '_' : '') + col.SourceName;
  }

  public pageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromActions.UpdateSkip(this.pageViewId, event.skip));
  }

  public getPagingBarConfig() {
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
    }
  }
}
