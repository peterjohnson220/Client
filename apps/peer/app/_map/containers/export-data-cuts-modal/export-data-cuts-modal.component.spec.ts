import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import 'rxjs/add/operator/take';

import { GridTypeEnum } from 'libs/models/common';
import { PfCommonModule, KendoGridFilterHelper } from 'libs/core';
import { PfValidatableDirective } from 'libs/forms/directives';
import { generateMockDataStateChangeEvent } from 'libs/extensions/kendo/mocks';
import { SettingsService } from 'libs/state/app-context/services';
import { RateType, WeightType } from 'libs/data/data-sets';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import { ExportDataCutsModalComponent } from './export-data-cuts-modal.component';
import { ExchangeCompanyJob, generateMockExchangeCompanyJob } from '../../models';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeCompanyJobGridActions from '../../actions/exchange-company-job-grid.actions';
import * as fromExportDataCutsActions from '../../actions/export-data-cuts.actions';

describe('Peer - Map - Export Data Cuts Modal', () => {
  let fixture: ComponentFixture<ExportDataCutsModalComponent>;
  let instance: ExportDataCutsModalComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  const mockExchangeCompanyJob = generateMockExchangeCompanyJob();
  const mockDataView = {data: [mockExchangeCompanyJob], total: 1};

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
        DropDownListModule,
        PfCommonModule
      ],
      declarations: [
        ExportDataCutsModalComponent,
        PfValidatableDirective
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { params: { id : 1 } } } }
        },
        {
          provide: SettingsService,
          useValue: { selectUiPersistenceSetting: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.parent.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExportDataCutsModalComponent);
    instance = fixture.componentInstance;

    instance.gridState$ = of(KendoGridFilterHelper.getMockEmptyGridState());
    instance.selections$ = of([]);
    instance.exportDataCutsModalOpen$ = of(true);
    instance.persistedRateForExport$ = of(RateType.Annual);
    instance.persistedWeightingTypeForExport$ = of(WeightType.Inc);
  });

  it('should dispatch LoadExchangeCompanyJobs action when loadExchangeCompanyJobs is called', () => {
    const action = new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobs;
    fixture.detectChanges();

    instance.loadExchangeCompanyJobs();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should dispatch LoadExchangeCompanyJobsIds action when loadExchangeCompanyJobs is called', () => {
    const action = new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsIds;
    fixture.detectChanges();

    instance.loadExchangeCompanyJobs();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should call loadingAvailableJobs onInit when the modal is opened', () => {
    spyOn(instance, 'loadExchangeCompanyJobs');

    fixture.detectChanges();

    expect(instance.loadExchangeCompanyJobs).toHaveBeenCalled();
  });

  it('should call selectionsControl.setErrors when exportingDataCutsError$ is true', () => {
    const error = {'error': 'There was an error adding the selected jobs.'};
    spyOn(instance.selectionsControl, 'setErrors');
    instance.exportingDataCutsError$ = of(true);

    fixture.detectChanges();

    expect(instance.selectionsControl.setErrors).toHaveBeenCalledWith(error);
  });

  it('should dispatch a ExportDataCuts action when the handleFormSubmit event is triggered', () => {
    const action = new fromExportDataCutsActions.ExportDataCuts({selectedRate: RateType.Annual, scopes: [], exportCurrentMap: false,
                                                                        selectedWeightingType: WeightType.Inc, selectedCurrency: 'USD'});

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

  it('should dispatch a CloseExportDataCutsModal event when handleModalDismissed is triggered', () => {
    const action = new fromExportDataCutsActions.CloseExportDataCutsModal;

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('should dispatch fromGridActions.ResetGrid action when handleModalDismissed is triggered', () => {
    const expectedAction = new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanyJob);

    fixture.detectChanges();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch an UpdateGrid action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent('CompanyJobTitle');
    const expectedAction = new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeCompanyJob, mockGridState);
    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadExchangeCompanyJobs action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent('CompanyJobTitle');
    const expectedAction = new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobs;
    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a fromGridActions.ToggleRowSelection action when the cellClick event is triggered`, () => {
    const mockJob: ExchangeCompanyJob = {...mockExchangeCompanyJob};
    const expectedAction = new fromGridActions.ToggleRowSelection(
      GridTypeEnum.ExchangeCompanyJob,
      mockJob.ExchangeJobToCompanyJobId,
      []
    );

    fixture.detectChanges();

    instance.handleCellClick({dataItem: mockJob});

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should update primaryButtonText with the number of selections when selections change', () => {
    const expectedPrimaryButtonTextBefore = 'Export (0)';
    const expectedPrimaryButtonTextAfter = 'Export (1)';

    fixture.detectChanges();

    expect(instance.primaryButtonText).toEqual(expectedPrimaryButtonTextBefore);

    instance.selections = [1];

    fixture.detectChanges();

    expect(instance.primaryButtonText).toEqual(expectedPrimaryButtonTextAfter);
  });

  it(`should dispatch ToggleSelectAll action when onSelectAllChange is triggered`, () => {
    const expectedAction = new fromGridActions.ToggleSelectAll(GridTypeEnum.ExchangeCompanyJob, [1]);
    instance.view$ = of(mockDataView);

    fixture.detectChanges();

    instance.onSelectAllChange(null);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a SetSelections action when onSelectAllClick is called`, () => {
    const allIds = [1];
    const expectedAction = new fromGridActions.SetSelections(GridTypeEnum.ExchangeCompanyJob, allIds, instance.pageEntityIds);

    instance.allIds$ = of(allIds);

    fixture.detectChanges();

    instance.onSelectAllClick({});

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a SetSelections action with an empty array when onClearAllClick is called`, () => {
    const expectedAction = new fromGridActions.SetSelections(GridTypeEnum.ExchangeCompanyJob, [], instance.pageEntityIds);

    fixture.detectChanges();

    instance.onClearAllClick({});

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a SelectRate action when handleRateSelectionChange is called`, () => {
    const expectedAction = new fromExportDataCutsActions.SelectRate({newRate: RateType.Annual});

    fixture.detectChanges();

    instance.handleRateSelectionChange( { Name: RateType.Annual, Value: RateType.Annual });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
