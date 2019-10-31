import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import { ViewField, DataViewFilter, DataViewEntity } from 'libs/models/payfactors-api';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'pf-data-grid',
  templateUrl: './pf-data-grid.component.html',
  styleUrls: ['./pf-data-grid.component.scss'],
})
export class PfDataGridComponent implements OnChanges, OnInit, OnDestroy {

  @Input() pageViewId: string;
  @Input() title: string;
  @Input() navigationURL: string;
  @Input() showTitle = true;
  @Input() showColumnChooser = true;
  @Input() allowExport = true;
  @Input() showFilterChooser = true;
  @Input() contentNoPadding = false;
  @Input() selectionField: string;
  @Input() columnTemplates: any;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() gridActionsTemplate: TemplateRef<any>;
  @Input() gridGlobalActionsTemplate: TemplateRef<any>;
  @Input() inboundFilters: DataViewFilter[];
  @Input() defaultSort: SortDescriptor[];

  public gridFilterThrottle: Subject<any>;

  splitViewEmitter = new EventEmitter<string>();
  splitViewFilters$: Observable<DataViewFilter[]>;
  baseEntity$: Observable<DataViewEntity>;
  dataFields$: Observable<ViewField[]>;
  filters$: Observable<DataViewFilter[]>;
  displayFilterPanel$: Observable<boolean>;
  selectedRowId$: Observable<number>;

  constructor(private store: Store<fromReducer.State>) {
    this.gridFilterThrottle = new Subject();
  }

  ngOnInit(): void {
    this.splitViewEmitter.subscribe(res => {
      switch (res) {
        case 'close':
          this.store.dispatch(new fromActions.UpdateSelectedRowId(this.pageViewId, null, this.selectionField));
          break;
        default:
          break;
      }
    });

    this.initGridFilterThrottle();

    this.splitViewFilters$ = this.store.select(fromReducer.getSplitViewFilters, this.pageViewId);
    this.baseEntity$ = this.store.select(fromReducer.getBaseEntity, this.pageViewId);
    this.dataFields$ = this.store.select(fromReducer.getFields, this.pageViewId);
    this.filters$ = this.store.select(fromReducer.getFilters, this.pageViewId);
    this.displayFilterPanel$ = this.store.select(fromReducer.getFilterPanelDisplay, this.pageViewId);
    this.selectedRowId$ = this.store.select(fromReducer.getSelectedRowId, this.pageViewId);
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
    }

    if (changes['inboundFilters']) {
      this.store.dispatch(new fromActions.UpdateInboundFilters(this.pageViewId, changes['inboundFilters'].currentValue));
    }

    if (changes['defaultSort']) {
      this.store.dispatch(new fromActions.UpdateDefaultSortDescriptor(this.pageViewId, changes['defaultSort'].currentValue));
    }
  }

  toggleFilterPanel() {
    this.store.dispatch(new fromActions.ToggleFilterPanel(this.pageViewId));
  }

  closeFilterPanel() {
    this.store.dispatch(new fromActions.SetFilterPanelDisplay(this.pageViewId, false));
  }

  handleFilterChanged(event: DataViewFilter) {
    this.gridFilterThrottle.next(event);
  }

  clearFilter(event: DataViewFilter) {
    this.store.dispatch(new fromActions.ClearFilter(this.pageViewId, event));
  }

  clearAllFilters() {
    this.store.dispatch(new fromActions.ClearAllFilters(this.pageViewId));
  }

  private initGridFilterThrottle() {
    const gridThrottle$ = this.gridFilterThrottle.debounceTime(400);

    gridThrottle$.subscribe(filter => {
      if (filter && filter.Value.toString().trim().length) {
        this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, filter));
      }
    });
  }
}
