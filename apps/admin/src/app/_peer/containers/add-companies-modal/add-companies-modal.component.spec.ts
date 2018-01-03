import { forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { PfCommonModule } from 'libs/common';
import { PfValidatableDirective } from 'libs/forms/directives';
import * as fromRootState from 'libs/state/state';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import { AddCompaniesModalComponent } from './add-companies-modal.component';
import { generateMockAddExchangeCompaniesRequest } from '../../../../../../../libs/models/peer';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import { GridFilterService } from '../../../../../../../libs/common/core/services';
import { PfInputDebounceComponent } from '../../../../../../../libs/forms/components';

describe('Add Companies Modal', () => {
  let fixture: ComponentFixture<AddCompaniesModalComponent>;
  let instance: AddCompaniesModalComponent;
  // let pfInputDebounce: PfInputDebounceComponent;
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
          // useValue: jest.mock(PfInputDebounceComponent)
          useValue: {setSilently(test: string) {}}
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    // pfInputDebounce = TestBed.createComponent(PfInputDebounceComponent).componentInstance;
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
    // instance.debouncedSearchTerm = pfInputDebounce;
    spyOn(instance.debouncedSearchTerm, 'setSilently');
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.debouncedSearchTerm).toBeCalledWith('');
  });

  it('should reset gridState and selections when handleModalDismissed is triggered', () => {
    instance.selections = [1, 2];
    instance.gridState = GridFilterService.getMockGridState();
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.selections).toEqual([]);
    expect(instance.gridState).toEqual(GridFilterService.getMockEmptyGridState());
  });

  it('should update gridState and call loadAvailableCompanies when updateSearchFilter is triggered', () => {
    const expectedGridState = GridFilterService.getMockGridState('CompanyName', 0);
    instance.gridState = GridFilterService.getMockEmptyGridState();
    instance.gridState.skip = 10;
    const action = new fromAvailableCompaniesActions.LoadingAvailableCompanies({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(instance.gridState)
    });
    fixture.detectChanges();

    instance.updateSearchFilter('test');

    fixture.detectChanges();

    expect(instance.gridState).toEqual(expectedGridState);
    expect(store.dispatch).toBeCalledWith(action);
  });

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

/*  it('should not show the form text and should show a required error message once a submit has been attempted', () => {
    fixture.detectChanges();

    // trigger handleFormSubmit
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an CloseCreateExchangeModal action when handleModalDismissed is called', () => {
    const action = new fromExchangeListActions.CloseCreateExchangeModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an UpsertingExchange action with payload when handleFormSubmit is called', () => {
    const action = new fromExchangeListActions.UpsertingExchange(generateMockUpsertExchangeRequest());
    instance.name.setValue('test');
    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });*/
});
