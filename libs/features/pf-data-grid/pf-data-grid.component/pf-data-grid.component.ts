import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { ViewField, DataViewEntity, SimpleDataView } from 'libs/models/payfactors-api';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import { PfDataGridFilter } from '../models';
import { getUserFilteredFields } from '../components';

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
  @Input() gridGlobalFiltersTemplate: TemplateRef<any>;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() enableSelection = false;
  @Input() defaultSort: SortDescriptor[];


  splitViewEmitter = new EventEmitter<string>();
  splitViewFilters$: Observable<PfDataGridFilter[]>;
  baseEntity$: Observable<DataViewEntity>;
  dataFields$: Observable<ViewField[]>;
  filterableFields$: Observable<ViewField[]>;
  displayFilterPanel$: Observable<boolean>;
  selectedRowId$: Observable<number>;
  savedViews$: Observable<SimpleDataView[]>;
  saveViewModalOpen$: Observable<boolean>;
  viewIsSaving$: Observable<boolean>;

  userFilteredFieldsSubscription: Subscription;
  userFilteredFields: ViewField[];

  constructor(private store: Store<fromReducer.State>) { }

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

    this.userFilteredFieldsSubscription = this.store.select(fromReducer.getFields, this.pageViewId).subscribe(fields => {
      this.userFilteredFields = getUserFilteredFields(fields);
    });

    this.splitViewFilters$ = this.store.select(fromReducer.getSplitViewFilters, this.pageViewId);
    this.baseEntity$ = this.store.select(fromReducer.getBaseEntity, this.pageViewId);
    this.dataFields$ = this.store.select(fromReducer.getFields, this.pageViewId);
    this.filterableFields$ = this.store.select(fromReducer.getFilterableFields, this.pageViewId);
    this.displayFilterPanel$ = this.store.select(fromReducer.getFilterPanelDisplay, this.pageViewId);
    this.selectedRowId$ = this.store.select(fromReducer.getSelectedRowId, this.pageViewId);
    this.savedViews$ = this.store.select(fromReducer.getSavedViews, this.pageViewId);
    this.saveViewModalOpen$ = this.store.select(fromReducer.getSaveViewModalOpen, this.pageViewId);
    this.viewIsSaving$ = this.store.select(fromReducer.getViewIsSaving, this.pageViewId);
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
    this.userFilteredFieldsSubscription .unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
      this.store.dispatch(new fromActions.LoadSavedViews(changes['pageViewId'].currentValue));
    }

    if (changes['inboundFilters']) {
      this.store.dispatch(new fromActions.UpdateInboundFilters(this.pageViewId, changes['inboundFilters'].currentValue));
    }

    if (changes['defaultSort']) {
      this.store.dispatch(new fromActions.UpdateDefaultSortDescriptor(this.pageViewId, changes['defaultSort'].currentValue));
    }
  }

  hasFilters(fields: ViewField[]): boolean {
    return fields.filter(f => f.FilterValue).length > 0;
  }

  toggleFilterPanel() {
    this.store.dispatch(new fromActions.ToggleFilterPanel(this.pageViewId));
  }

  closeFilterPanel() {
    this.store.dispatch(new fromActions.SetFilterPanelDisplay(this.pageViewId, false));
  }

  handleFilterChanged(field: ViewField) {
    this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, field));
  }

  clearFilter(field: ViewField, resetOperator = false) {
    this.store.dispatch(new fromActions.ClearFilter(this.pageViewId, field, resetOperator));
  }

  clearAllFilters() {
    this.store.dispatch(new fromActions.ClearAllFilters(this.pageViewId));
  }

  saveFilterClicked() {
    this.store.dispatch(new fromActions.OpenSaveViewModal(this.pageViewId));
  }

  closeSaveViewModal() {
    this.store.dispatch(new fromActions.CloseSaveViewModal(this.pageViewId));
  }

  saveFilterHandler(filterName) {
    this.store.dispatch(new fromActions.SaveView(this.pageViewId, filterName));
  }

}
