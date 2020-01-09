import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';
import * as fromFieldsActions from '../../actions/fields.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Field, FieldDataType, FieldType, UserDataView } from '../../models';
import { NumericFieldFormattingModalComponent } from '../numeric-field-formating-modal';
import { FormulaFieldModalComponent } from '../../../_data-view/containers';
import { FormulaFieldModalObj } from '../../../_data-view/models';

@Component({
  selector: 'pf-data-view-grid',
  templateUrl: './data-view-grid.component.html',
  styleUrls: ['./data-view-grid.component.scss']
})
export class DataViewGridComponent implements OnInit, OnDestroy {
  @ViewChild('numericFieldFormattingModal', { static: true }) public numericFieldFormattingModalComponent: NumericFieldFormattingModalComponent;
  @ViewChild(FormulaFieldModalComponent, { static: true }) public formulaFieldModal: FormulaFieldModalComponent;

  fields$: Observable<Field[]>;
  dataAsync$: Observable<AsyncStateObj<any[]>>;
  loadingMoreData$: Observable<boolean>;
  hasMoreDataOnServer$: Observable<boolean>;
  sortDescriptor$: Observable<SortDescriptor>;
  totalCount$: Observable<number>;
  dataView$: Observable<AsyncStateObj<UserDataView>>;
  formulaFieldSuggestions$: Observable<string[]>;

  loadingMoreDataSub: Subscription;
  hasMoreDataOnServerSub: Subscription;
  fieldsSub: Subscription;
  sortDescriptorSub: Subscription;

  loadingMoreData: boolean;
  hasMoreDataOnServer: boolean;
  fields: Field[];
  sortableConfig = {
    allowUnsort: true,
    mode: 'single'
  };
  sortDesc: SortDescriptor[];
  dataTypes = FieldDataType;
  formulaFieldModalObj: FormulaFieldModalObj;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.fields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.dataAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getReportDataAsync));
    this.loadingMoreData$ = this.store.pipe(select(fromDataInsightsMainReducer.getLoadingMoreData));
    this.hasMoreDataOnServer$ = this.store.pipe(select(fromDataInsightsMainReducer.getHasMoreDataOnServer));
    this.sortDescriptor$ = this.store.pipe(select(fromDataInsightsMainReducer.getSortDescriptor));
    this.totalCount$ = this.store.pipe(select(fromDataInsightsMainReducer.getTotalCount));
    this.dataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataInsightsMainReducer.getFormulaFieldSuggestions));
  }

  ngOnInit(): void {
    this.loadingMoreDataSub = this.loadingMoreData$.subscribe(loading => this.loadingMoreData = loading);
    this.hasMoreDataOnServerSub = this.hasMoreDataOnServer$.subscribe(result => this.hasMoreDataOnServer = result);
    this.fieldsSub = this.fields$.subscribe(results => this.fields = results);
    this.sortDescriptorSub = this.sortDescriptor$.subscribe(sort => this.updateSortDescriptor(sort));
  }

  ngOnDestroy(): void {
    this.loadingMoreDataSub.unsubscribe();
    this.hasMoreDataOnServerSub.unsubscribe();
    this.fieldsSub.unsubscribe();
    this.sortDescriptorSub.unsubscribe();
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleScrollBottom(): void {
    if (!this.loadingMoreData && this.hasMoreDataOnServer) {
      this.store.dispatch(new fromDataViewGridActions.GetMoreData());
    }
  }

  handleSortChange(sortDesc: SortDescriptor[]): void {
    if (!sortDesc.length) {
      return;
    }
    const selectedField = this.fields.find(x => x.KendoGridField === sortDesc[0].field);
    if (!selectedField) {
      return;
    }
    this.store.dispatch(new fromDataViewGridActions.SortField({
      field: selectedField,
      sortDesc: sortDesc[0]
    }));
  }

  updateSortDescriptor(sort: SortDescriptor): void {
    if (!sort) {
      this.sortDesc = [];
    } else {
      this.sortDesc = [sort];
    }
  }

  isNumericDataType(fieldDataType: FieldDataType): boolean {
    return !!fieldDataType && (
      fieldDataType === FieldDataType.Int || fieldDataType === FieldDataType.Float);
  }

  handleNumberFormatModalClicked(field: Field, format?: string): void {
    this.numericFieldFormattingModalComponent.open(field, format);
  }

  handleSaveClicked(field: Field): void {
    this.store.dispatch(new fromFieldsActions.SetNumberFormatOnSelectedField({field: field, numberFormat: field.Format}));
  }

  handleClearFormatClicked(field: Field): void {
    this.store.dispatch(new fromFieldsActions.SetNumberFormatOnSelectedField({field: field, numberFormat: null}));
  }

  columnMenuEnabled(field: Field): boolean {
    return this.isNumericDataType(field.DataType) || this.isFormulaField(field);
  }

  isFormulaField(field: Field): boolean {
    return field.FieldType === FieldType.Formula;
  }

  handleEditFormulaClick(field: Field): void {
    this.formulaFieldModalObj = {
      Title: field.IsEditable ? 'Edit Formula Field' : 'View Formula Field',
      FieldName: field.FormulaName,
      Formula: field.Formula,
      IsEditable: field.IsEditable,
      FormulaId: field.FormulaId
    };
    this.formulaFieldModal.open();
  }
}
