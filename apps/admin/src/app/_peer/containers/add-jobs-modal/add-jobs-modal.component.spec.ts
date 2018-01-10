import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { SortDescriptor } from '@progress/kendo-data-query';
import 'rxjs/add/operator/take';

import {
  AvailableJob, generateMockAddExchangeJobsRequest,
  generateMockAvailableJob
} from 'libs/models/peer';
import { PfCommonModule } from 'libs/common';
import { PfValidatableDirective } from 'libs/forms/directives';
import * as fromRootState from 'libs/state/state';
import { KendoGridFilterHelper } from 'libs/common/core/helpers';
import { InputDebounceComponent } from 'libs/forms/components';
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
        PfCommonModule
      ],
      declarations: [
        AddJobsModalComponent,
        PfValidatableDirective
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        },
        {
          provide: InputDebounceComponent,
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

    fixture = TestBed.createComponent(AddJobsModalComponent);
    instance = fixture.componentInstance;
    instance.debouncedSearchTerm = TestBed.get(InputDebounceComponent);

    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    instance.selections$ = of([]);
    instance.gridState$.take(1);
  });

  it('should show a modal with a search bar and a companies grid when addJobsModalOpen$ is true', () => {
    instance.addJobsModalOpen$ = of(true);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingAvailableJobs action when the modal is opened', () => {
    const action = new fromAvailableJobsActions.LoadingAvailableJobs({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(KendoGridFilterHelper.getMockEmptyGridState())
    });
    instance.addJobsModalOpen$ = of(true);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
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

  it('should call debouncedSearchTerm.setSilently when handleModalDismissed is triggered', () => {
    spyOn(instance.debouncedSearchTerm, 'setSilently');
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(instance.debouncedSearchTerm.setSilently).toBeCalledWith('');
  });

  it('should reset gridState and selections when handleModalDismissed is triggered', () => {
    const exptectedGridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    const expectedSelections$ = of([]);
    instance.selections$ = of([1, 2]);
    instance.gridState$ = of(KendoGridFilterHelper.getMockGridState());
    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(instance.selections$).toEqual(expectedSelections$);
      expect(instance.gridState$).toEqual(exptectedGridState$);
    });
  });

  it('should update gridState and call loadAvailableJobs when updateSearchFilter is triggered', () => {
    const expectedGridState = KendoGridFilterHelper.getMockEmptyGridState();
    expectedGridState.filter.filters.push(KendoGridFilterHelper.getMockFilter('CompanyName'));
    const currentGridState = KendoGridFilterHelper.getMockEmptyGridState();
    currentGridState.skip = 10;
    instance.gridState$ = of(currentGridState);
    const action = new fromAvailableJobsActions.LoadingAvailableJobs({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(expectedGridState)
    });
    fixture.detectChanges();

    instance.updateSearchFilter('test');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(instance.gridState$).toEqual(of(expectedGridState));
      expect(store.dispatch).toBeCalledWith(action);
    });
  });

  it('should dispatch LoadingAvaliableJobs action when loadAvailableJobs is called', () => {
    const action = new fromAvailableJobsActions.LoadingAvailableJobs({
      exchangeId: instance.exchangeId,
      listState: JSON.stringify(KendoGridFilterHelper.getMockEmptyGridState())
    });
    fixture.detectChanges();

    instance.loadAvailableJobs();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should update gridState.skip and call loadAvailableJobs when the pageChange event is triggered', () => {
    spyOn(instance, 'loadAvailableJobs');
    const expectedSkip = 20;
    fixture.detectChanges();

    instance.handlePageChange({skip: expectedSkip, take: 10});

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      instance.gridState$.take(1).subscribe(state => {
        expect(state.skip).toEqual(expectedSkip);
      });
      expect(instance.loadAvailableJobs).toBeCalled();
    });
  });

  it(`should update gridState.sort, reset gridState.skip, and call loadAvailableJobs when the
    handleSortChanged event is triggered`, () => {
    spyOn(instance, 'loadAvailableJobs');

    const expectedSort: SortDescriptor[] = [{field: 'CompanyName', dir: 'asc'}];
    const currentGridState = KendoGridFilterHelper.getMockEmptyGridState();
    currentGridState.skip = 10;
    instance.gridState$ = of(currentGridState);
    fixture.detectChanges();

    instance.handleSortChanged(expectedSort);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      instance.gridState$.take(1).subscribe(state => {
        expect(state.skip).toEqual(0);
        expect(state.sort).toEqual(expectedSort);
      });
      expect(instance.loadAvailableJobs).toBeCalled();
    });
  });

  it('should not update selections when the cellClick event is triggered if the job is already in the exchange', () => {
    const mockAvailableJob: AvailableJob = generateMockAvailableJob();
    const expectedSelections = [];
    mockAvailableJob.InExchange = true;
    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableJob});

    fixture.detectChanges();

    expect(instance.selections).toEqual(expectedSelections);
  });

  it('should add job to selections and update selectionsControl when the cellClick event is triggered', () => {
    const mockAvailableJob: AvailableJob = generateMockAvailableJob();
    const expectedSelections$ = of([mockAvailableJob.MDJobsBaseId]);
    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableJob});

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(instance.selections$).toEqual(expectedSelections$);

      // expecting the selections input to have a value of 1 and have the ng-touched class.
      expect(fixture).toMatchSnapshot();
    });
  });

  it(`should remove job from selections if it has already been added and update selectionsControl
    when the cellClick event is triggered`, () => {
    const expectedSelections = [];
    const mockAvailableJob: AvailableJob = generateMockAvailableJob();
    instance.selections = [mockAvailableJob.MDJobsBaseId];
    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockAvailableJob});

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
