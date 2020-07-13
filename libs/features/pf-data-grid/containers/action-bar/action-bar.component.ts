import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ViewField, SimpleDataView } from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { ActionBarConfig } from '../../models';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges {
  @Input() actionBarConfig: ActionBarConfig;
  @Input() pageViewId: string;
  @Input() globalFilters: ViewField[];
  @Input() reorderable: boolean;

  dataFields$: Observable<ViewField[]>;
  selectableFields$: Observable<ViewField[]>;
  selectedRecordId$: Observable<number>;
  exporting$: Observable<boolean>;
  loadingExportingStatus$: Observable<boolean>;
  data$: Observable<GridDataResult>;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.selectableFields$ = this.store.select(fromReducer.getSelectableFields, changes['pageViewId'].currentValue);
      this.selectedRecordId$ = this.store.select(fromReducer.getSelectedRecordId, this.pageViewId);
      this.exporting$ = this.store.select(fromReducer.getExportingGrid, this.pageViewId);
      this.loadingExportingStatus$ = this.store.select(fromReducer.getLoadingExportingStatus, this.pageViewId);
      this.data$ = this.store.select(fromReducer.getData, this.pageViewId);
    }
  }

  updateFields(fields: ViewField[]) {
    const updatedFields = cloneDeep(fields);
    if (this.reorderable) {
      const orderedVisibleFields = orderBy(updatedFields.filter(f => f.IsSelectable && f.IsSelected), ['Order', 'DisplayName'], ['asc']);
      orderedVisibleFields.forEach((f, index) => f.Order = index);
    }

    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }

  handleGlobalFilterValueChanged(field: ViewField, value: any) {
    const newField = { ...field };
    newField.FilterOperator = 'contains';
    newField.FilterValue = value;
    this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, newField));
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

  getExportTitleTooltip(exporting: boolean, loadingExportingStatus: boolean, data: GridDataResult): string {
    if (exporting || loadingExportingStatus) {
      return 'Exporting';
    } else if (data && data.total === 0) {
      return 'There is no data to export';
    } else {
      return 'Export';
    }
  }
}
