import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { PagingOptions, ViewField } from 'libs/models/payfactors-api';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';
import { ActionBarConfig, GridConfig } from '../../models';
import { GridDataHelper } from '../../helpers';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @Input() actionBarConfig: ActionBarConfig;
  @Input() pageViewId: string;
  @Input() globalFilters: ViewField[];
  @Input() reorderable: boolean;

  dataFields$: Observable<ViewField[]>;
  selectedRecordId$: Observable<number>;
  exporting$: Observable<boolean>;
  loadingExportingStatus$: Observable<boolean>;
  data$: Observable<GridDataResult>;
  data: GridDataResult;
  gridConfig: GridConfig;
  pagingOptions: PagingOptions;
  dataSubscription: Subscription;
  gridConfigSubscription: Subscription;
  pagingOptionsSubscription: Subscription;

  enableFileDownloadSecurityWarning$: Observable<boolean>;
  enableFileDownloadSecurityWarningSub: Subscription;
  enableFileDownloadSecurityWarning = false;

  constructor(private store: Store<fromReducer.State>, private settingService: SettingsService) {
    this.enableFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.selectedRecordId$ = this.store.select(fromReducer.getSelectedRecordId, this.pageViewId);
      this.exporting$ = this.store.select(fromReducer.getExportingGrid, this.pageViewId);
      this.loadingExportingStatus$ = this.store.select(fromReducer.getLoadingExportingStatus, this.pageViewId);
      this.data$ = this.store.select(fromReducer.getData, this.pageViewId);
      this.dataSubscription = this.data$.subscribe(data => this.data = data);
      this.pagingOptionsSubscription = this.store.select(fromReducer.getPagingOptions, this.pageViewId)
        .subscribe(pagingOptions => this.pagingOptions = pagingOptions);
      this.gridConfigSubscription = this.store.select(fromReducer.getGridConfig, this.pageViewId).subscribe(gridConfig => this.gridConfig = gridConfig);
    }
  }

  updateFields(fields: ViewField[]) {
    const updatedFields = cloneDeep(fields);
    if (this.reorderable) {
      const orderedVisibleFields = orderBy(updatedFields.filter(f => f.IsSelectable && f.IsSelected), ['Order', 'DisplayName'], ['asc']);
      orderedVisibleFields.forEach((f, index) => f.Order = index);
    }

    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(GridDataHelper.getLoadDataAction(this.pageViewId, this.data, this.gridConfig, this.pagingOptions));
  }

  handleGlobalFilterValueChanged(field: ViewField, value: any) {
    const newField = { ...field };
    newField.FilterOperator = 'contains';
    newField.FilterValues = !!value && value.trim().length > 0 ? [value] : null;
    this.updateField(newField);
  }

  trackByFn(index, item: ViewField) {
    return item.DataElementId;
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.exportGrid();
    }
  }

  handleExportClicked(): void {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportGrid();
    }
  }

  exportGrid(): void {
    this.store.dispatch(new fromActions.ExportGrid(this.pageViewId, this.actionBarConfig.ExportSourceName, this.actionBarConfig.CustomExportType));
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

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.gridConfigSubscription.unsubscribe();
    this.pagingOptionsSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSub.unsubscribe();
  }

  private updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromActions.ClearFilter(this.pageViewId, field));
    }
  }
}
