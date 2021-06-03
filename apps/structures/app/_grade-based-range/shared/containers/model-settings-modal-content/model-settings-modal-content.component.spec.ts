import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ModelSettingsModalContentComponent } from './model-settings-modal-content.component';

import * as fromRootState from 'libs/state/state';
import { AbstractFeatureFlagService, PfCommonModule } from 'libs/core';
import { SettingsService } from 'libs/state/app-context/services';
import { generateMockStructureRangeDistributionTypes } from 'libs/models/payfactors-api/structures/response';
import { generateMockRangeAdvancedSetting, generateMockRangeDistributionSettingForm } from 'libs/models/structures';

import * as fromSharedReducer from '../../../../shared/reducers';
import * as fromGradeBasedSharedReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import { RangeRoundingComponent } from '../../../../shared/containers/range-rounding';

describe('ModelSettingsModalContentComponent', () => {
  let instance: ModelSettingsModalContentComponent;
  let fixture: ComponentFixture<ModelSettingsModalContentComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModelSettingsModalContentComponent,
        RangeRoundingComponent
      ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          structures_gradeBasedRange_shared: combineReducers(fromGradeBasedSharedReducer.reducers),
          structures_shared: combineReducers(fromSharedReducer.reducers)
        }),
        PfCommonModule,
        NgbNavModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
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
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    instance.rangeRoundingComponent = TestBed.createComponent(RangeRoundingComponent).componentInstance;

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
      RangeAdvancedSetting: generateMockRangeAdvancedSetting(),
      MidpointProgression: 5,
      StartingMidpoint: 55555
    };

    instance.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl(instance.metadata.ModelName, [Validators.required, Validators.maxLength(50)]),
      'Grades': new FormControl('', [Validators.required]),
      'RangeDistributionTypeId': new FormControl({ value: instance.metadata.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'MarketDataBased': new FormControl('BaseMRP', [Validators.required]),
      'StartingMidpoint': new FormControl('', [Validators.required]),
      'RangeSpread': new FormControl('', [Validators.required]),
      'MidpointProgression': new FormControl('', [Validators.required]),
      'Rate': new FormControl(instance.metadata.Rate, [Validators.required]),
      'Currency': new FormControl(instance.metadata.Currency, [Validators.required])
    });

    instance.ngOnInit();
  });

  it('should dispatch getCurrencies and getControlPoints on init', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromModelSettingsModalActions.GetCurrencies();
    const expectedAction2 = new fromModelSettingsModalActions.GetControlPoints();

    instance.ngOnInit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
  });

});
