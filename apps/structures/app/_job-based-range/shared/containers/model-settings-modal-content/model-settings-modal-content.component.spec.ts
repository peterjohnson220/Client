import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';
import { AbstractFeatureFlagService, PfCommonModule } from 'libs/core';
import { SettingsService } from 'libs/state/app-context/services';
import { generateMockStructureRangeDistributionTypes } from 'libs/models/payfactors-api/structures/response';
import { generateMockRangeAdvancedSetting, generateMockRangeDistributionSettingForm, JobBasedPageViewIds } from 'libs/models/structures';

import { ModelSettingsModalContentComponent } from './model-settings-modal-content.component';
import { UrlService } from '../../../../shared/services';
import * as fromSharedReducer from '../../../../shared/reducers';
import { AdvancedModelSettingComponent } from '../advanced-model-setting';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedSharedReducer from '../../reducers';
import { RangeRoundingComponent } from '../../../../shared/containers/range-rounding';

describe('ModelSettingsModalContentComponent', () => {
  let instance: ModelSettingsModalContentComponent;
  let fixture: ComponentFixture<ModelSettingsModalContentComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;
  let urlService: UrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModelSettingsModalContentComponent,
        RangeDistributionSettingComponent,
        AdvancedModelSettingComponent,
        RangeRoundingComponent
      ],
      imports: [
        NgbNavModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          structures_jobBasedRange_shared: combineReducers(fromJobBasedSharedReducer.reducers),
          structures_shared: combineReducers(fromSharedReducer.reducers)
        }),
        PfCommonModule
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
    fixture = TestBed.createComponent(ModelSettingsModalContentComponent);
    instance = fixture.componentInstance;
    instance.rangeDistributionSettingComponent = TestBed.createComponent(RangeDistributionSettingComponent).componentInstance;
    instance.advancedModelSettingComponent = TestBed.createComponent(AdvancedModelSettingComponent).componentInstance;
    instance.rangeRoundingComponent = TestBed.createComponent(RangeRoundingComponent).componentInstance;

    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    urlService = TestBed.inject(UrlService);

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
      RangeTypeId: 2,
      ExchangeId: null,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSettingForm(),
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
      RangeTypeId: 2,
      ExchangeId: null,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSettingForm(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };

    instance.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(instance.metadata.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(instance.metadata.ModelName, [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(instance.metadata.Paymarket, [Validators.required]),
      'Rate': new FormControl(instance.metadata.Rate, [Validators.required]),
      'Currency': new FormControl(instance.metadata.Currency, [Validators.required]),
      'PeerExchange': new FormControl( 'Global Network', [Validators.required]),
      'RangeDistributionSetting': new FormControl(instance.metadata.RangeDistributionSetting),
      'RangeAdvancedSetting': new FormControl(instance.metadata.RangeAdvancedSetting)
    });

    instance.rangeDistributionSettingComponent.enablePercentilesAndRangeSpreads = true;
    instance.rangeDistributionSettingComponent.rangeDistributionSettingForm = new FormGroup({
      'CompanyStructuresRangeGroupId': new FormControl(instance.rangeGroupId),
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

    const increaseMidpointByPercentage =
      instance.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreaseMidpointByPercent
        ? instance.metadata.RangeAdvancedSetting.MissingMarketDataType.IncreaseMidpointByPercentage
        : null;

    const decreasePercentFromNextLevelPercentage =
      instance.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.DecreasePercentFromNextLevel
        ? instance.metadata.RangeAdvancedSetting.MissingMarketDataType.DecreasePercentFromNextLevelPercentage
        : null;

    const increasePercentFromPreviousLevelPercentage =
      instance.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreasePercentFromPreviousLevel
        ? instance.metadata.RangeAdvancedSetting.MissingMarketDataType.IncreasePercentFromPreviousLevelPercentage
        : null;

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
        'IncreaseMidpointByPercentage': new FormControl(increaseMidpointByPercentage),
        'DecreasePercentFromNextLevelPercentage': new FormControl(decreasePercentFromNextLevelPercentage),
        'IncreasePercentFromPreviousLevelPercentage': new FormControl(increasePercentFromPreviousLevelPercentage),
      })
    });

    instance.rangeRoundingComponent.roundingSettingsForm = new FormGroup({
      'min': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.min.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.min.RoundingPoint),
      }),
      'mid': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.mid.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.mid.RoundingPoint),
      }),
      'max': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.max.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.max.RoundingPoint),
      }),
      'firstTertile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.firstTertile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.firstTertile.RoundingPoint),
      }),
      'secondTertile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.secondTertile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.secondTertile.RoundingPoint),
      }),
      'firstQuartile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.firstQuartile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.firstQuartile.RoundingPoint),
      }),
      'secondQuartile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.secondQuartile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.secondQuartile.RoundingPoint),
      }),
      'firstQuintile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.firstQuintile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.firstQuintile.RoundingPoint),
      }),
      'secondQuintile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.secondQuintile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.secondQuintile.RoundingPoint),
      }),
      'thirdQuintile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.thirdQuintile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.thirdQuintile.RoundingPoint),
      }),
      'fourthQuintile': new FormGroup({
        'RoundingType': new FormControl(instance.roundingSettings?.fourthQuintile.RoundingType),
        'RoundingPoint': new FormControl(instance.roundingSettings?.fourthQuintile.RoundingPoint),
      })
    });

    instance.selectedExchange = {
      ExchangeId: null,
      ExchangeName: null,
    };

    instance.ngOnInit();

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
    instance.activeTab = '';
    instance.allFormulas = {};
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
      RangeTypeId: 2,
      ExchangeId: null,
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSettingForm(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };
    instance.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(instance.metadata.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(instance.metadata.ModelName, [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(instance.metadata.Paymarket, [Validators.required]),
      'Rate': new FormControl(instance.metadata.Rate, [Validators.required]),
      'Currency': new FormControl(instance.metadata.Currency, [Validators.required]),
      'PeerExchange': new FormControl( 'Global Network', [Validators.required]),
      'RangeDistributionSetting': new FormControl(instance.metadata.RangeDistributionSetting),
      'RangeAdvancedSetting': new FormControl(instance.metadata.RangeAdvancedSetting)
    });


    instance.activeTab = '';
    instance.allFormulas = {};

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
    expect(instance.modelNameExistsFailureSub).not.toBe(undefined);
    expect(instance.roundingSettingsSub).not.toBe(undefined);
  });

  it('should dispatch SaveModelSettings and reset attemptedSubmit if submit is called when form is valid', () => {
    spyOn(instance.store, 'dispatch');

    instance.ngOnInit();
    instance.allFormulas = {};
    instance.rangeGroupId = 1;
    instance.pageViewId = JobBasedPageViewIds.ModelMinMidMax;
    instance.roundingSettings = {};

    const expectedAction = new fromModelSettingsModalActions.SaveJobBasedModelSettings({
      rangeGroupId: instance.rangeGroupId,
      formValue: instance.modelSetting,
      fromPageViewId: JobBasedPageViewIds.ModelMinMidMax,
      rounding: instance.roundingSettings
    });

    instance.handleModalSubmit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(instance.attemptedSubmit).toEqual(false);
  });

});
