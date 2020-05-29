import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import 'rxjs/add/operator/take';

import {
  AvailableCompany, ExchangeStatusEnum, generateMockAddExchangeCompaniesRequest,
  generateMockAvailableCompany
} from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import { PfCommonModule, KendoGridFilterHelper } from 'libs/core';
import { InputDebounceComponent } from 'libs/forms/components';
import { PfValidatableDirective } from 'libs/forms/directives';
import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import { AddCompaniesModalComponent } from './add-companies-modal.component';

describe('Add Companies Modal', () => {
  let fixture: ComponentFixture<AddCompaniesModalComponent>;
  let instance: AddCompaniesModalComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        ReactiveFormsModule,
        FormsModule,
        PfCommonModule
      ],
      declarations: [
        AddCompaniesModalComponent,
        PfValidatableDirective,

        // Since the input debounce is part of the form we need to know how to get its value. It needs to be
        // a declaration for this test.
        InputDebounceComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { params: { id : 1 } } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.parent.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddCompaniesModalComponent);
    instance = fixture.componentInstance;

    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    instance.selections$ = of([]);
  });

  it('should show a modal with a search bar and a companies grid when addCompaniesModalOpen$ is true', () => {
    instance.addCompaniesModalOpen$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should call loadAvailableCompanies onInit when the modal is opened', () => {
    spyOn(instance, 'loadAvailableCompanies');

    instance.addCompaniesModalOpen$ = of(true);

    fixture.detectChanges();

    expect(instance.loadAvailableCompanies).toHaveBeenCalled();
  });

  it('should call selectionsControl.setErrors when addingCompaniesError$ is true', () => {
    const error = {'error': 'There was an error adding the selected companies.'};
    spyOn(instance.selectionsControl, 'setErrors');

    instance.addingCompaniesError$ = of(true);

    fixture.detectChanges();

    expect(instance.selectionsControl.setErrors).toHaveBeenCalledWith(error);
  });

  it('should dispatch a AddingExchangeCompanies action when the handleFormSubmit event is triggered', () => {
    const payload = generateMockAddExchangeCompaniesRequest();
    const action = new fromExchangeCompaniesActions.AddingExchangeCompanies(payload);

    instance.selections$ = of([1, 2]);

    fixture.detectChanges();

    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should have attemptedSubmit of true once handleFormSubmit is triggered', () => {
    instance.attemptedSubmit = false;

    fixture.detectChanges();

    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(instance.attemptedSubmit).toBe(true);
  });

  it('should have attemptedSubmit of false once handleModalDismissed is triggered', () => {
    instance.attemptedSubmit = true;

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.attemptedSubmit).toBe(false);
  });

  it('should dispatch a CloseAddExchangeCompaniesModal event when handleModalDismissed is triggered', () => {
    const action = new fromExchangeCompaniesActions.CloseAddExchangeCompaniesModal;

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should set the searchTerm to blank, when the modal is dismissed', () => {
    fixture.detectChanges();

    instance.searchTerm = 'Fake search term';

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.searchTerm).toBe('');
  });

  it('should dispatch fromGridActions.ResetGrid when handleModalDismissed is triggered', () => {
    const expectedAction = new fromGridActions.ResetGrid(GridTypeEnum.AvailableCompanies);

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch fromGridActions.UpdateFilter action and call loadAvailableCompanies when updateSearchFilter is triggered', () => {
    const newSearchTerm = 'test';
    const updateFilterAction = new fromGridActions.UpdateFilter(
      GridTypeEnum.AvailableCompanies,
      {columnName: 'CompanyName', value: newSearchTerm}
    );
    spyOn(instance, 'loadAvailableCompanies');

    fixture.detectChanges();

    instance.updateSearchFilter(newSearchTerm);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(updateFilterAction);
    expect(instance.loadAvailableCompanies).toBeCalled();
  });

  it('should dispatch LoadingAvaliableCompanies action when loadAvailableCompanies is called', () => {
    const action = new fromAvailableCompaniesActions.LoadingAvailableCompanies({
      exchangeId: instance.exchangeId,
      listState: KendoGridFilterHelper.getMockEmptyGridState()
    });

    fixture.detectChanges();

    instance.loadAvailableCompanies();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it(`should dispatch fromGridActions.PageChange action and call loadAvailableCompanies when the handlePageChange
  event is triggered`, () => {
    const pageChangeEvent = {skip: 20, take: 10};
    const expectedAction = new fromGridActions.PageChange(GridTypeEnum.AvailableCompanies, pageChangeEvent);
    spyOn(instance, 'loadAvailableCompanies');

    fixture.detectChanges();

    instance.handlePageChange(pageChangeEvent);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.loadAvailableCompanies).toBeCalled();
  });

  it(`should dispatch fromGridActions.SortChange action and call loadAvailableCompanies when the handleSortChange
   event is triggered`, () => {
    const sortDescriptors: SortDescriptor[] = [{field: 'CompanyName', dir: 'asc'}];
    const expectedAction = new fromGridActions.SortChange(GridTypeEnum.AvailableCompanies, sortDescriptors);
    spyOn(instance, 'loadAvailableCompanies');

    fixture.detectChanges();

    instance.handleSortChange(sortDescriptors);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.loadAvailableCompanies).toBeCalled();
  });

  it(`should not dispatch fromGridActions.ToggleRowSelection action when the cellClick event
   is triggered if the company is already in the exchange`, () => {
    const mockAvailableCompany: AvailableCompany = generateMockAvailableCompany();
    const expectedAction = new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableCompanies, mockAvailableCompany.CompanyId);
    mockAvailableCompany.Status = ExchangeStatusEnum.InExchange;

    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableCompany});

    fixture.detectChanges();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it(`should dispatch fromGridActions.ToggleRowSelection action when the cellClick event is triggered`, () => {
    const mockAvailableCompany: AvailableCompany = generateMockAvailableCompany();
    const expectedAction = new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableCompanies, mockAvailableCompany.CompanyId);

    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableCompany});

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should update primaryButtonText with the number of selections when selections change', () => {
    const expectedPrimaryButtonTextBefore = 'Add (0)';
    const expectedPrimaryButtonTextAfter = 'Add (1)';

    fixture.detectChanges();

    expect(instance.primaryButtonText).toEqual(expectedPrimaryButtonTextBefore);

    instance.selections = [1];

    fixture.detectChanges();

    expect(instance.primaryButtonText).toEqual(expectedPrimaryButtonTextAfter);
  });
  // TODO: Was unable to get the subscription to fire the second time, preventing the text from appearing (JP)
/*  it('should show error message when addingCompaniesError$ is true and a submit has been attempted', () => {
    spyOn(instance, 'addingCompaniesError$').and.returnValue(of(true));
    instance.selectionsControl.setValue([1]);
    instance.selectionsControl.markAsDirty();
    instance.selectionsControl.markAsTouched();

    // instance.addingCompaniesError$ = of(false);
    instance.addCompaniesModalOpen$ = of(true);
    instance.attemptedSubmit = true;

    fixture.detectChanges();
    instance.addCompaniesModalOpen$ = of(true);

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
    // instance.addCompaniesModalOpen$ = of(true);
    // instance.addingCompaniesError$ = of(true);

    // fixture.detectChanges();
    // expect(fixture).toMatchSnapshot();
  });*/
});
