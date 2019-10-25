import {Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';

import {Observable, Subject} from 'rxjs';

import { ViewField, DataViewFilter } from 'libs/models/payfactors-api';
import { PfDataGridSaveViewModalComponent } from 'libs/ui/grid-filter/components/modals/save-view';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import {DataViewConfig} from '../../../models/payfactors-api/reports/request';

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
  @Input() primaryKey: string;
  @Input() columnTemplates: any;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() gridActionsTemplate: TemplateRef<any>;
  @Input() gridGlobalActionsTemplate: TemplateRef<any>;

  // @ViewChild(PfDataGridSaveViewModalComponent, { static: true }) public saveViewModalComponent: PfDataGridSaveViewModalComponent;

  public gridFilterThrottle: Subject<any>;
  isSplitView = false;

  splitViewEmitter = new EventEmitter<string>();
  dataFields$: Observable<ViewField[]>;
  filters$: Observable<DataViewFilter[]>;
  displayFilterPanel$: Observable<boolean>;
  savedViews$: Observable<DataViewConfig[]>;
  saveViewModalOpen$: Observable<boolean>;
  viewIsSaving$: Observable<boolean>;

  constructor(private store: Store<fromReducer.State>) {
    this.gridFilterThrottle = new Subject();
  }

  ngOnInit(): void {
    this.splitViewEmitter.subscribe(res => {
      switch (res) {
        case 'close':
          this.isSplitView = false;
          break;
        default:
          break;
      }
    });

    this.initGridFilterThrottle();
    this.loadSavedFilterList();

    this.dataFields$ = this.store.select(fromReducer.getFields, this.pageViewId);
    this.filters$ = this.store.select(fromReducer.getFilters, this.pageViewId);
    this.displayFilterPanel$ = this.store.select(fromReducer.getFilterPanelDisplay, this.pageViewId);
    this.savedViews$ = this.store.select(fromReducer.getSavedViews, this.pageViewId);
    this.saveViewModalOpen$ = this.store.select(fromReducer.getSaveViewModalOpen, this.pageViewId);
    this.viewIsSaving$ = this.store.select(fromReducer.getViewIsSaving, this.pageViewId);
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
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

  onRowSelect() {
    this.isSplitView = true;
    this.store.dispatch(new fromActions.SetFilterPanelDisplay(this.pageViewId, false));
  }

  saveFilterClicked() {
    this.loadSavedFilterList();
    this.store.dispatch(new fromActions.OpenSaveViewModal(this.pageViewId));
  }

  closeSaveViewModal() {
    this.store.dispatch(new fromActions.CloseSaveViewModal(this.pageViewId));
  }

  loadSavedFilterList() {
    this.store.dispatch(new fromActions.LoadSavedViews(this.pageViewId));
  }

  saveFilterHandler(filterName) {
    this.store.dispatch(new fromActions.SaveView(this.pageViewId, filterName));
  }

  // TODO: Subscribe to save filter success action, close the modal there

  private initGridFilterThrottle() {
    const gridThrottle$ = this.gridFilterThrottle.debounceTime(400);

    gridThrottle$.subscribe(filter => {
      if (filter && filter.Value.toString().trim().length) {
        this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, filter));
      }
    });
  }
}
