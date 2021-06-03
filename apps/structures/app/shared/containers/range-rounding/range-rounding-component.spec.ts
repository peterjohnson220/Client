import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { generateMockRangeAdvancedSetting, generateMockRangeDistributionSettingForm } from 'libs/models/structures';
import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PfCommonModule } from 'libs/core';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { generateMockRoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { generateMockStructureRangeDistributionTypes } from 'libs/models/payfactors-api';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromSharedStructuresActions from '../../actions/shared.actions';
import { RangeRoundingComponent } from './range-rounding.component';

describe('Job Based Ranges - Rounding Settings', () => {
  let instance: RangeRoundingComponent;
  let fixture: ComponentFixture<RangeRoundingComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          structures_shared: combineReducers(fromSharedStructuresReducer.reducers),
          pfDataGrids: combineReducers(fromPfGridReducer.reducers)
        }),
        PfCommonModule
      ],
      declarations: [ RangeRoundingComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(RangeRoundingComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);


    instance.ngOnInit();

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

    instance.roundingSettings = generateMockRoundingSettingsDataObj();

  });

  it ('should dispatch UpdateRoundingSettings on init', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromSharedStructuresActions.UpdateRoundingSettings(generateMockRoundingSettingsDataObj());

    instance.ngOnInit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
