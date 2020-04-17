import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ViewField, SimpleDataView } from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as cloneDeep from 'lodash.clonedeep';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { ActionBarConfig } from '../../models';
import {GridDataResult} from '@progress/kendo-angular-grid';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges {
  @Input() actionBarConfig: ActionBarConfig;
  @Input() pageViewId: string;
  @Input() globalFilters: ViewField[];
  @Output() onFilterSidebarToggle = new EventEmitter();

  dataFields$: Observable<ViewField[]>;
  savedViews$: Observable<SimpleDataView[]>;
  selectedRecordId$: Observable<number>;
  viewDeleting$: Observable<boolean>;
  viewNameToBeDeleted$: Observable<string>;
  exporting$: Observable<boolean>;
  loadingExportingStatus$: Observable<boolean>;
  data$: Observable<GridDataResult>;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.savedViews$ = this.store.select(fromReducer.getSavedViews, changes['pageViewId'].currentValue);
      this.selectedRecordId$ = this.store.select(fromReducer.getSelectedRecordId, this.pageViewId);
      this.viewDeleting$ = this.store.select(fromReducer.getViewIsDeleting, this.pageViewId);
      this.viewNameToBeDeleted$ = this.store.select(fromReducer.getViewNameToBeDeleted, this.pageViewId);
      this.exporting$ = this.store.select(fromReducer.getExportingGrid, this.pageViewId);
      this.loadingExportingStatus$ = this.store.select(fromReducer.getLoadingExportingStatus, this.pageViewId);
      this.data$ = this.store.select(fromReducer.getData, this.pageViewId);
    }
  }

  updateFields(updatedFields: ViewField[]) {
    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }

  handleGlobalFilterValueChanged(field: ViewField, value: any) {
    const newField =  {...field};
    newField.FilterOperator = 'contains';
    newField.FilterValue = value;
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

  trackByFn(index, item: ViewField) {
    return item.DataElementId;
  }

  getNgModel(field: ViewField) {
    return cloneDeep(field);
  }

  handleExportClicked(): void {
    this.store.dispatch(new fromActions.ExportGrid(this.pageViewId, this.actionBarConfig.ExportSourceName));
  }
}
