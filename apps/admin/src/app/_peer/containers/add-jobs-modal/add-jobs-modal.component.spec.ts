/*
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { SortDescriptor } from '@progress/kendo-data-query';

import {
  AvailableCompany, generateMockAddExchangeCompaniesRequest,
  generateMockAvailableCompany
} from 'libs/models/peer';
import { PfCommonModule } from 'libs/common';
import { PfValidatableDirective } from 'libs/forms/directives';
import * as fromRootState from 'libs/state/state';
import { KendoGridFilterHelper } from 'libs/common/core/helpers';
import { PfInputDebounceComponent } from 'libs/forms/components';
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
        PfCommonModule
      ],
      declarations: [
        AddCompaniesModalComponent,
        PfValidatableDirective
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        },
        {
          provide: PfInputDebounceComponent,
          useValue: {setSilently(test: string) {}}
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddCompaniesModalComponent);
    instance = fixture.componentInstance;
    instance.debouncedSearchTerm = TestBed.get(PfInputDebounceComponent);
  });

  it('should show a modal with a search bar and a companies grid when addCompaniesModalOpen$ is true', () => {
    instance.addCompaniesModalOpen$ = of(true);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingAvailableCompanies action when the modal is opened', () => {
    const action = new fromAvailableCompaniesActions.LoadingAvailableCompanies({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(instance.gridState)
    });
    instance.addCompaniesModalOpen$ = of(true);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
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

    instance.selections = [1, 2];

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

  it('should call debouncedSearchTerm.setSilently when handleModalDismissed is triggered', () => {
    spyOn(instance.debouncedSearchTerm, 'setSilently');
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.debouncedSearchTerm.setSilently).toBeCalledWith('');
  });

  it('should reset gridState and selections when handleModalDismissed is triggered', () => {
    instance.selections = [1, 2];
    instance.gridState = KendoGridFilterHelper.getMockGridState();
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.selections).toEqual([]);
    expect(instance.gridState).toEqual(KendoGridFilterHelper.getMockEmptyGridState());
  });

  it('should update gridState and call loadAvailableCompanies when updateSearchFilter is triggered', () => {
    const expectedGridState = KendoGridFilterHelper.getMockEmptyGridState();
    expectedGridState.filter.filters.push(KendoGridFilterHelper.getMockFilter('CompanyName'));
    instance.gridState = KendoGridFilterHelper.getMockEmptyGridState();
    instance.gridState.skip = 10;
    const action = new fromAvailableCompaniesActions.LoadingAvailableCompanies({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(expectedGridState)
    });
    fixture.detectChanges();

    instance.updateSearchFilter('test');

    fixture.detectChanges();

    expect(instance.gridState).toEqual(expectedGridState);
    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should dispatch LoadingAvaliableCompanies action when loadAvailableCompanies is called', () => {
    const action = new fromAvailableCompaniesActions.LoadingAvailableCompanies({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(instance.gridState)
    });
    fixture.detectChanges();

    instance.loadAvailableCompanies();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should update gridState.skip and call loadAvailableCompanies when the pageChange event is triggered', () => {
    spyOn(instance, 'loadAvailableCompanies');
    const expectedSkip = 20;
    fixture.detectChanges();

    instance.pageChange({skip: expectedSkip, take: 10});

    fixture.detectChanges();

    expect(instance.gridState.skip).toEqual(expectedSkip);
    expect(instance.loadAvailableCompanies).toBeCalled();
  });

  it(`should update gridState.sort, reset gridState.skip, and call loadAvailableCompanies when the
    handleSortChanged event is triggered`, () => {
    spyOn(instance, 'loadAvailableCompanies');
    const expectedSort: SortDescriptor[] = [{field: 'CompanyName', dir: 'asc'}];
    instance.gridState.skip = 10;
    fixture.detectChanges();

    instance.handleSortChanged(expectedSort);

    fixture.detectChanges();

    expect(instance.gridState.skip).toEqual(0);
    expect(instance.gridState.sort).toEqual(expectedSort);
    expect(instance.loadAvailableCompanies).toBeCalled();
  });

  it('should not update selections when the cellClick event is triggered if the company is already in the exchange', () => {
    const mockAvailableCompany: AvailableCompany = generateMockAvailableCompany();
    const expectedSelections = [];
    mockAvailableCompany.InExchange = true;
    fixture.detectChanges();

    instance.cellClick({dataItem: mockAvailableCompany});

    fixture.detectChanges();

    expect(instance.selections).toEqual(expectedSelections);
  });

  it('should add company to selections and update selectionsControl when the cellClick event is triggered', () => {
    const mockAvailableCompany: AvailableCompany = generateMockAvailableCompany();
    const expectedSelections = [mockAvailableCompany.CompanyId];
    fixture.detectChanges();

    instance.cellClick({dataItem: mockAvailableCompany});

    fixture.detectChanges();

    expect(instance.selections).toEqual(expectedSelections);

    // expecting the selections input to have a value of 1 and have the ng-touched class.
    expect(fixture).toMatchSnapshot();
  });

  it(`should remove company from selections if it has already been added and update selectionsControl
    when the cellClick event is triggered`, () => {
    const expectedSelections = [];
    const mockAvailableCompany: AvailableCompany = generateMockAvailableCompany();
    instance.selections = [mockAvailableCompany.CompanyId];
    fixture.detectChanges();

    instance.cellClick({dataItem: mockAvailableCompany});

    fixture.detectChanges();

    expect(instance.selections).toEqual(expectedSelections);

    // expecting the selections input to have a value of nothing and have the ng-touched class.
    expect(fixture).toMatchSnapshot();
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
/!*  it('should show error message when addingCompaniesError$ is true and a submit has been attempted', () => {
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
  });*!/
});
*/
