import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import {Observable, Subject} from 'rxjs';

import { DataGridService } from '../services/data-grid.service';
import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import { PfDataGridFieldModel, PfGridFieldFilter } from '../../../models';


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

  public gridFilterThrottle: Subject<any>;

  selection = [];
  displayFilterPanel = false;

  splitViewEmitter = new EventEmitter<string>();
  dataFields$: Observable<PfDataGridFieldModel[]>;
  filters$: Observable<PfGridFieldFilter[]>;

  constructor(public dataGridService: DataGridService, private store: Store<fromReducer.State>) {
    this.gridFilterThrottle = new Subject();
  }

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

    this.dataFields$ = this.store.select(fromReducer.getFields, this.entity);
    this.filters$ = this.store.select(fromReducer.getFilters, this.entity);
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

  toggleFilterPanel(displayValue: boolean) {
    this.displayFilterPanel = displayValue;
    if (this.displayFilterPanel) {
      this.splitViewEmitter.emit('close');
    }
  }

  handleFilterChanged(event: PfGridFieldFilter) {
    this.store.dispatch(new fromActions.UpdateFilter(this.entity, event));
  }

  clearFilter(event: PfGridFieldFilter) {
    // filter throttle here?
    /*
    const currentFilters: Array<any> = this.gridState.filter.filters;

    this.filterThrottle.next(currentFilters.filter(f => f.field !== filter.field));
     */
    this.store.dispatch(new fromActions.ClearFilter(this.entity, event));
  }

  clearAllFilters() {
    this.store.dispatch(new fromActions.ClearAllFilters(this.entity));
  }

  private initGridFilterThrottle() {
    const gridThrottle$ = this.gridFilterThrottle.debounceTime(400);

    gridThrottle$.subscribe(filters => {
      if (filters) {
        // dispatch action to store
        // this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
        // refactor this action/effect stack trace to acknowledge filters in the store
      }
    });
  }
}
