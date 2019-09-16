import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { DataGridService } from '../services/data-grid.service';
import { Store } from '@ngrx/store';
import * as fromReducer from '../reducers';
import * as fromActions from '../actions';

@Component({
  selector: 'pf-data-grid',
  templateUrl: './pf-data-grid.component.html',
  styleUrls: ['./pf-data-grid.component.scss'],
})
export class PfDataGridComponent implements OnChanges, OnInit, OnDestroy {

  @Input() entity: string;
  @Input() primaryKey: string;
  @Input() columnTemplates: any;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() gridActionsTemplate: TemplateRef<any>;

  selection = [];

  splitViewEmitter = new EventEmitter<string>();

  constructor(public dataGridService: DataGridService, private store: Store<fromReducer.State>) {}

  ngOnInit(): void {
    this.splitViewEmitter.subscribe(res => {
      switch (res) {
        case 'close':
          this.selection = [];
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.store.dispatch(new fromActions.InitGrid(changes['entity'].currentValue));
      this.store.dispatch(new fromActions.LoadFields(changes['entity'].currentValue));
      this.store.dispatch(new fromActions.LoadData(changes['entity'].currentValue));
    }
  }

  isSplitView(): boolean {
    return this.splitViewTemplate && this.selection.length > 0;
  }
}
