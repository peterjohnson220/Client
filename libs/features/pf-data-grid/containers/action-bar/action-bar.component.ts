import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import {ViewField, SimpleDataView, DataViewFieldDataType} from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as cloneDeep from 'lodash.clonedeep';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges {

  @Input() showColumnChooser = true;
  @Input() showFilterChooser = true;
  @Input() allowExport = true;
  @Input() pageViewId: string;
  @Input() globalFilterAlignment: string;
  @Input() globalActionsTemplate: TemplateRef<any>;
  @Input() globalFiltersTemplate: TemplateRef<any>;
  @Input() globalFilters: ViewField[];
  @Input() showActionBar = false;
  @Output() onFilterSidebarToggle = new EventEmitter();

  dataFields$: Observable<ViewField[]>;
  savedViews$: Observable<SimpleDataView[]>;
  selectedRecordId$: Observable<number>;
  viewDeleting$: Observable<boolean>;
  viewNameToBeDeleted$: Observable<string>;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.savedViews$ = this.store.select(fromReducer.getSavedViews, changes['pageViewId'].currentValue);
      this.selectedRecordId$ = this.store.select(fromReducer.getSelectedRecordId, this.pageViewId);
      this.viewDeleting$ = this.store.select(fromReducer.getViewIsDeleting, this.pageViewId);
      this.viewNameToBeDeleted$ = this.store.select(fromReducer.getViewNameToBeDeleted, this.pageViewId);
    }
  }

  updateFields(updatedFields: ViewField[]) {
    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }

  handleGlobalFilterValueChanged(field: ViewField, value: any) {
    const newField =  {...field};
    switch (field.DataType) {
      case DataViewFieldDataType.String:
        newField.FilterOperator = 'contains';
        newField.FilterValue = value;
        break;
      case DataViewFieldDataType.Bit:
        newField.FilterOperator = '=';
        newField.FilterValue = value;
        break;
    }
    this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, newField));
  }
  toggleFilterPanel() {
    this.onFilterSidebarToggle.emit();
  }

  savedViewClicked(view: SimpleDataView) {
    this.store.dispatch(new fromActions.HandleSavedViewClicked(this.pageViewId, view.Name));
  }

  prepareViewForDelete(viewName: string) {
    this.store.dispatch(new fromActions.PrepareViewForDelete(this.pageViewId, viewName));
  }

  deleteView(viewName: string) {
    this.store.dispatch(new fromActions.DeleteSavedView(this.pageViewId, viewName));
  }

  cancelDelete() {
    this.store.dispatch(new fromActions.CancelViewDelete(this.pageViewId));
  }

  hasTemplate(globalFilter) {
    return this.globalFiltersTemplate && this.globalFiltersTemplate[globalFilter.SourceName];
  }
  trackByFn(index, item: ViewField) {
    return item.DataElementId;
  }

  getNgModel(field: ViewField) {
    return cloneDeep(field);
  }
}
