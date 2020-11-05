import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { AbstractFeatureFlagService, PfCommonModule } from 'libs/core';
import {
  generateMockRangeDistributionSetting,
  generateMockStructureRangeDistributionTypes
} from 'libs/models/payfactors-api';
import { SettingsService } from 'libs/state/app-context/services';
import { generateMockRangeAdvancedSetting } from 'libs/models/structures';

import * as fromJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import { ModelSettingsModalComponent } from './model-settings-modal.component';
import { UrlService } from '../../services';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import { PageViewIds } from '../../constants/page-view-ids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvancedModelSettingComponent } from '../advanced-model-setting';

describe('Job Based Ranges - Model Settings Modal', () => {
  let instance: ModelSettingsModalComponent;
  let fixture: ComponentFixture<ModelSettingsModalComponent>;
  let store: Store<fromJobBasedRangeReducer.State>;
  let ngbModal: NgbModal;
  let urlService: UrlService;
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobBased_main: combineReducers(fromJobBasedRangeReducer.reducers),
          pfDataGrids: combineReducers(fromPfGridReducer.reducers)
        }),
        PfCommonModule
      ],
      declarations: [
        ModelSettingsModalComponent,
        RangeDistributionSettingComponent,
        AdvancedModelSettingComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: UrlService,
          useValue: { isInWorkflow: jest.fn() }
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
        SettingsService
      ]
    });

    fixture = TestBed.createComponent(ModelSettingsModalComponent);
    instance = fixture.componentInstance;
    instance.rangeDistributionSettingComponent = TestBed.createComponent(RangeDistributionSettingComponent).componentInstance;
    instance.advancedModelSettingComponent = TestBed.createComponent(AdvancedModelSettingComponent).componentInstance;

    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    urlService = TestBed.inject(UrlService);
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);

    // mock the metadata
    instance.metadata = {
      Paymarket: 'Boston',
      PaymarketId: 1,
      StructureName: 'testStruc',
      ModelName: 'testModel',
      Currency: 'USD',
      Rate: 'Annual',
      PayType: 'Base',
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      SpreadMin: 10,
      SpreadMax: 10,
      IsCurrent: false,
      RangeDistributionTypeId: 1,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSetting(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };

    instance.modelSetting = {
      PayType: 'Base',
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      Currency: 'USD',
      IsCurrent: false,
      ModelName: 'testModel',
      Paymarket: 'Boston',
      PaymarketId: 1,
      Rate: 'Annual',
      SpreadMax: 10,
      SpreadMin: 10,
      StructureName: 'testStruc',
      RangeDistributionTypeId: 1,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSetting(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };

    instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads = true;
    instance.rangeDistributionSettingComponent.rangeDistributionSettingForm = new FormGroup({
      'CompanyStructuresRangeGroupId': new FormControl(this.rangeGroupId),
      'RangeDistributionTypeId': new FormControl({ value: instance.metadata.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'PayType': new FormControl(instance.metadata.PayType, [Validators.required]),
      'ControlPoint': new FormControl({ value: instance.metadata.ControlPoint, disabled: true }, [Validators.required]),
      'Minimum': new FormControl({
        value: instance.metadata.SpreadMin,
        disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads
      }, [Validators.required]),
      'Maximum': new FormControl({
        value: instance.metadata.SpreadMax,
        disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads
      }, [Validators.required]),
      'FirstTertile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'SecondTertile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'FirstQuartile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'SecondQuartile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'FirstQuintile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'SecondQuintile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'ThirdQuintile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'FourthQuintile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'MinPercentile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'MaxPercentile': new FormControl({ value: null, disabled: !instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads }),
      'ControlPoint_Formula': new FormControl({ value: null })
    });

    instance.advancedModelSettingComponent.advancedModelSettingForm = new FormGroup({
      'PreventMidsBelowCurrent': new FormControl(instance.metadata.RangeAdvancedSetting.PreventMidsBelowCurrent),
      'PreventMidsFromIncreasingMoreThanPercent': new FormGroup({
        'Enabled': new FormControl(instance.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Enabled),
        'Percentage': new FormControl(instance.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Percentage)
      }),
      'PreventMidsFromIncreasingWithinPercentOfNextLevel': new FormGroup({
        'Enabled': new FormControl(instance.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel.Enabled),
        'Percentage': new FormControl(instance.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel.Percentage)
      }),
      'MissingMarketDataType': new FormGroup({
        'Type': new FormControl(String(instance.metadata.RangeAdvancedSetting.MissingMarketDataType.Type)),
        'Percentage': new FormControl(instance.metadata.RangeAdvancedSetting.MissingMarketDataType.Percentage)
      })
    });

    instance.ngOnInit();
  });

  it('should dispatch cancel and close modal, as well as call reset on dismiss', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromModelSettingsModalActions.CloseModal();
    const expectedAction2 = new fromModelSettingsModalActions.Cancel();

    instance.handleModalDismiss();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
    expect(instance.attemptedSubmit).toEqual(false);
  });


  it('should dispatch GetStructureNameSuggestions when structure name changed', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromModelSettingsModalActions.GetStructureNameSuggestions({ filter: 'test' });
    instance.handleStructureNameChanged('test');


    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ClearModelNameExistsFailure when modelNameExistsFailure is true', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromModelSettingsModalActions.ClearModelNameExistsFailure();
    instance.modelNameExistsFailure = true;

    instance.clearModelNameExistsFailure();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch ClearModelNameExistsFailure when modelNameExistsFailure is false', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromModelSettingsModalActions.ClearModelNameExistsFailure();
    instance.modelNameExistsFailure = false;

    instance.clearModelNameExistsFailure();

    expect(instance.store.dispatch).not.toHaveBeenCalled();
  });

  it('should set attemptedSubmit to true (but leave the activeTab alone) if form is valid', () => {
    instance.buildForm();
    instance.activeTab = '';
    instance.formulaValid = true;
    instance.handleModalSubmitAttempt();

    expect(instance.attemptedSubmit).toEqual(true);
    expect(instance.activeTab).toEqual('');
  });

  it('should set attemptedSubmit to true and the activeTab to modelTab if form is NOT valid', () => {

    // make form invalid
    instance.metadata = {
      Paymarket: 'Boston',
      PaymarketId: 1,
      StructureName: '',
      ModelName: 'testModel',
      Currency: 'USD',
      Rate: 'Annual',
      PayType: 'Base',
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      SpreadMin: 10,
      SpreadMax: 10,
      IsCurrent: false,
      RangeDistributionTypeId: 1,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSetting(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };

    instance.buildForm();

    instance.activeTab = '';

    instance.handleModalSubmitAttempt();

    expect(instance.attemptedSubmit).toEqual(true);
    expect(instance.activeTab).toEqual('modelTab');
  });

  it('should dispatch getCurrencies and getControlPoints on init', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromModelSettingsModalActions.GetCurrencies();
    const expectedAction2 = new fromModelSettingsModalActions.GetControlPoints();

    instance.ngOnInit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
  });

  it('should subscribe to appropriate subscriptions on init as well', () => {
    expect(instance.controlPointsAsyncObjSub).not.toBe(undefined);
    expect(instance.currenciesAsyncObjSub).not.toBe(undefined);
    expect(instance.metadataSub).not.toBe(undefined);
    expect(instance.modalOpenSub).not.toBe(undefined);
    expect(instance.modelNameExistsFailureSub).not.toBe(undefined);
    expect(instance.roundingSettingsSub).not.toBe(undefined);
  });

  it('should dispatch SaveModelSettings and reset attemptedSubmit if submit is called when form is valid', () => {
    spyOn(instance.store, 'dispatch');

    instance.ngOnInit();

    instance.rangeGroupId = 1;
    instance.pageViewId = PageViewIds.ModelMinMidMax;
    instance.roundingSettings = {};

    const expectedAction = new fromModelSettingsModalActions.SaveModelSettings({
      rangeGroupId: instance.rangeGroupId,
      formValue: instance.modelSetting,
      fromPageViewId: PageViewIds.ModelMinMidMax,
      rounding: instance.roundingSettings
    });

    instance.handleModalSubmit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(instance.attemptedSubmit).toEqual(false);
  });
});
