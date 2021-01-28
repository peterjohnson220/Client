import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { of } from 'rxjs';

import { generateMockViewField, generateMockViewFieldList, DataViewType } from 'libs/models/payfactors-api/reports/request';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';

import { PfDataGridComponent } from './pf-data-grid.component';



describe('PfDataGridComponent', () => {
  let fixture, component;
  let store: Store<fromReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromReducer.reducers,
          pfDataGrids: combineReducers(fromReducer.reducers)
        }),
      ],
      declarations: [PfDataGridComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PfDataGridComponent);
    component = fixture.componentInstance;
    component.pageViewId = 'HelloWorld';
  });

  it('should remove all filters when calling clearAllFilters', () => {
    component.userFilteredFields$ = of([generateMockViewField()]);

    component.clearAllFilters();

    const expectedClearAllAction = new fromActions.ClearAllNonGlobalFilters(component.pageViewId);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedClearAllAction);
  });

  it('should remove the selected filter when calling clearFilter', () => {
    const filterList = generateMockViewFieldList(5);
    const filterToRemove = filterList[0];
    component.filters$ = of(filterList);

    component.clearFilter(filterToRemove);
    const expectedAction = new fromActions.ClearFilter(component.pageViewId, filterToRemove);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should update the modified filter when calling handleFilterChanged', () => {
    const filterList = generateMockViewFieldList(5);
    const filterToModify = filterList[0];
    const newFilterValue = 'Hello World';

    filterToModify.FilterValue = newFilterValue;

    const updateFilterAction = new fromActions.UpdateFilter(component.pageViewId, filterToModify);

    component.handleFilterChanged(filterToModify);

    expect(store.dispatch).toHaveBeenLastCalledWith(updateFilterAction);
  });

  it('should display the save view modal when handleSaveFilter is called', () => {
    const openModalAction = new fromActions.OpenSaveViewModal(component.pageViewId);

    component.saveFilterClicked();

    expect(store.dispatch).toHaveBeenLastCalledWith(openModalAction);
  });

  it('should save the view with the user entered name', () => {
    const viewName = 'Hello';
    const expectedSaveAction = new fromActions.SaveView(component.pageViewId, viewName, DataViewType.savedFilter);
    component.saveFilterHandler(viewName);
    expect(store.dispatch).toHaveBeenCalledWith(expectedSaveAction);
  });


});
