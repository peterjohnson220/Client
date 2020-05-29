import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import 'rxjs/add/operator/take';

import {
  AvailableJob, ExchangeStatusEnum, generateMockAddExchangeJobsRequest,
  generateMockAvailableJob
} from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import { PfCommonModule, KendoGridFilterHelper } from 'libs/core';
import { InputDebounceComponent } from 'libs/forms/components';
import { PfValidatableDirective } from 'libs/forms/directives';
import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromAvailableJobsActions from '../../actions/available-jobs.actions';
import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import { AddJobsModalComponent } from './add-jobs-modal.component';

describe('Add Jobs Modal', () => {
  let fixture: ComponentFixture<AddJobsModalComponent>;
  let instance: AddJobsModalComponent;
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
        AddJobsModalComponent,
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

    fixture = TestBed.createComponent(AddJobsModalComponent);
    instance = fixture.componentInstance;

    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    instance.selections$ = of([]);
    instance.addJobsModalOpen$ = of(true);
  });

  it('should show a modal with a search bar and a companies grid when addJobsModalOpen$ is true', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch LoadingAvaliableJobs action when loadAvailableJobs is called', () => {
    const action = new fromAvailableJobsActions.LoadingAvailableJobs({
      exchangeId: instance.exchangeId,
      listState: KendoGridFilterHelper.getMockEmptyGridState()
    });
    fixture.detectChanges();

    instance.loadAvailableJobs();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should call loadingAvailableJobs onInit when the modal is opened', () => {
    spyOn(instance, 'loadAvailableJobs');

    fixture.detectChanges();

    expect(instance.loadAvailableJobs).toHaveBeenCalled();
  });

  it('should call selectionsControl.setErrors when addingJobsError$ is true', () => {
    const error = {'error': 'There was an error adding the selected jobs.'};
    spyOn(instance.selectionsControl, 'setErrors');
    instance.addingJobsError$ = of(true);

    fixture.detectChanges();

    expect(instance.selectionsControl.setErrors).toHaveBeenCalledWith(error);
  });

  it('should dispatch a AddingExchangeJobs action when the handleFormSubmit event is triggered', () => {
    const payload = generateMockAddExchangeJobsRequest();
    const action = new fromExchangeJobsActions.AddingExchangeJobs(payload);

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

  it('should dispatch a CloseAddExchangeJobsModal event when handleModalDismissed is triggered', () => {
    const action = new fromExchangeJobsActions.CloseAddExchangeJobsModal;

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

  it('should dispatch fromGridActions.ResetGrid action when handleModalDismissed is triggered', () => {
    const expectedAction = new fromGridActions.ResetGrid(GridTypeEnum.AvailableJobs);

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch fromGridActions.UpdateFilter action and call loadAvailableJobs when updateSearchFilter is triggered', () => {
    const newSearchTerm = 'test';
    const expectedAction = new fromGridActions.UpdateFilter(
      GridTypeEnum.AvailableJobs,
      {columnName: 'JobTitle', value: newSearchTerm}
      );
    spyOn(instance, 'loadAvailableJobs');

    fixture.detectChanges();

    instance.updateSearchFilter(newSearchTerm);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.loadAvailableJobs).toBeCalled();
  });

  it('should dispatch a fromGridActions.PageChange action and call loadAvailableJobs when the pageChange event is triggered', () => {
    const pageChangeEvent = {skip: 20, take: 10};
    const expectedAction = new fromGridActions.PageChange(GridTypeEnum.AvailableJobs, pageChangeEvent);
    spyOn(instance, 'loadAvailableJobs');

    fixture.detectChanges();

    instance.handlePageChange(pageChangeEvent);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.loadAvailableJobs).toBeCalled();
  });

  it(`should dispatch a fromGridActions.SortChange action and call loadAvailableJobs when the
    handleSortChange event is triggered`, () => {
    const expectedSort: SortDescriptor[] = [{field: 'CompanyName', dir: 'asc'}];
    const expectedAction = new fromGridActions.SortChange(GridTypeEnum.AvailableJobs, expectedSort);
    spyOn(instance, 'loadAvailableJobs');

    fixture.detectChanges();

    instance.handleSortChange(expectedSort);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.loadAvailableJobs).toBeCalled();
  });

  it(`should not dispatch fromGridActions.ToggleRowSelection action when the cellClick event is triggered
   if the job is already in the exchange`, () => {
    const mockAvailableJob: AvailableJob = generateMockAvailableJob();
    const expectedAction = new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableJobs, mockAvailableJob.MDJobsBaseId);
    mockAvailableJob.Status = ExchangeStatusEnum.InExchange;

    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableJob});

    fixture.detectChanges();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it('should dispatch a fromGridActions.ToggleRowSelection action when the cellClick event is triggered', () => {
    const mockAvailableJob: AvailableJob = generateMockAvailableJob();
    const expectedAction = new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableJobs, mockAvailableJob.MDJobsBaseId);

    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableJob});

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
  /*  it('should show error message when addingJobsError$ is true and a submit has been attempted', () => {
      spyOn(instance, 'addingJobsError$').and.returnValue(of(true));
      instance.selectionsControl.setValue([1]);
      instance.selectionsControl.markAsDirty();
      instance.selectionsControl.markAsTouched();

      // instance.addingJobsError$ = of(false);
      instance.addJobsModalOpen$ = of(true);
      instance.attemptedSubmit = true;

      fixture.detectChanges();
      instance.addJobsModalOpen$ = of(true);

      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
      // instance.addJobsModalOpen$ = of(true);
      // instance.addingJobsError$ = of(true);

      // fixture.detectChanges();
      // expect(fixture).toMatchSnapshot();
    });*/
});
