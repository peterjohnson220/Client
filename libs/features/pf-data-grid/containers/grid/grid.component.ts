import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PfDataGridFieldModel } from 'libs/models';

@Component({
  selector: 'pf-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  @Input() primaryKey: string;
  @Input() entity: string;
  @Input() columnTemplates: any;
  @Input() isCompact = false;
  @Input() selection = [];

  dataFields$: Observable<PfDataGridFieldModel[]>;
  data$: Observable<GridDataResult>;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['entity'].currentValue);
      this.data$ = this.store.select(fromReducer.getData, changes['entity'].currentValue);
    }
  }

  getValue(row: any, colName: string[]): string[] {
    const values = colName.map(val => row[val]);
    return values;
  }

  showColumn(col: PfDataGridFieldModel){
    return (!this.isCompact || col.ShowInCompactView) && col.Visible;
  }

}
