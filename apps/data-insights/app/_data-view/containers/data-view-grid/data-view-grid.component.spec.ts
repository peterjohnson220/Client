import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, StoreModule, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import * as fromRootState from 'libs/state/state';
import { generateMockField, Field } from 'libs/features/formula-editor';
import * as fromFieldsActions from 'libs/features/formula-editor/actions/fields.actions';

import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';
import * as fromDataViewMainReducer from '../../reducers';
import { DataViewGridComponent } from './data-view-grid.component';
import { NumericFieldFormattingModalComponent } from '../numeric-field-formating-modal';
import { DateFieldFormattingModalComponent } from '../date-field-formatting-modal';

describe('Data Insights - Data View Grid', () => {
  let fixture: ComponentFixture<DataViewGridComponent>;
  let instance: DataViewGridComponent;
  let store: Store<fromDataViewMainReducer.State>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataView_main: combineReducers(fromDataViewMainReducer.reducers)
        })
      ],
      declarations: [ DataViewGridComponent, NumericFieldFormattingModalComponent, DateFieldFormattingModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { dataViewId : 1 } } }
        }
      ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DataViewGridComponent);
    instance = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should dispatch GetMoreData when not currently loading more data and having more data on server', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    const results = [];
    const numberOfResults = 25;
    for (let i = 0; i < numberOfResults; i++) {
      results.push(i);
    }
    store.dispatch(new fromDataViewGridActions.GetMoreDataSuccess(results));
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).toHaveBeenCalledWith(getMoreDataAction);
  });

  it('should NOT dispatch GetMoreData when it currently loading more data', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    store.dispatch(new fromDataViewGridActions.GetMoreData());
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreDataAction);
  });

  it('should NOT dispatch GetMoreData when there is no more data on server', () => {
    const getMoreDataAction = new fromDataViewGridActions.GetMoreData();
    const results = [];
    const numberOfResults = 10;
    for (let i = 0; i < numberOfResults; i++) {
      results.push(i);
    }
    store.dispatch(new fromDataViewGridActions.GetMoreDataSuccess(results));
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleScrollBottom();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreDataAction);
  });

  it('should dispatch a SortField action when handling sort change', () => {
    const sortDesc: SortDescriptor[] = [{
      field: 'CompanyJobs.Job_Title',
      dir: 'desc'
    }];
    instance.fields = [generateMockField()];
    const sortFieldAction = new fromDataViewGridActions.SortField({ field: instance.fields[0], sortDesc: sortDesc[0] });
    spyOn(store, 'dispatch');

    instance.handleSortChange(sortDesc);

    expect(store.dispatch).toHaveBeenCalledWith(sortFieldAction);
  });

  it('should open number format modal when handleFieldFormatModalClicked with number data type', () => {
    const field = generateMockField();
    field.Is.Numeric = true;
    spyOn(instance.numericFieldFormattingModalComponent, 'open');

    instance.handleFieldFormatModalClicked(field);

    expect(instance.numericFieldFormattingModalComponent.open).toHaveBeenCalled();
  });

  it('should open date format modal when handleFieldFormatModalClicked with date data type', () => {
    const field = generateMockField();
    field.Is.Date = true;
    spyOn(instance.dateFieldFormattingModalComponent, 'open');

    instance.handleFieldFormatModalClicked(field);

    expect(instance.dateFieldFormattingModalComponent.open).toHaveBeenCalled();
  });

  it('should dispatch SetFormatOnSelectedField for number format modal or date format modal when handleSaveClicked', () => {
    const field = generateMockField();
    const expectedAction = new fromFieldsActions.SetFormatOnSelectedField(field);
    spyOn(store, 'dispatch');

    instance.handleSaveClicked(field);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SetFormatOnSelectedField for number format modal or date format modal when handleClearFormatClicked', () => {
    const field = generateMockField();
    const formatClearedField: Field = {
      ...field,
      FieldFormat: {
        ...field.FieldFormat,
        Format: null,
        Value: null,
        KendoNumericFormat: null
      }
    };
    const expectedAction = new fromFieldsActions.ClearFormating(formatClearedField);
    spyOn(store, 'dispatch');

    instance.handleClearFormatClicked(field);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});

