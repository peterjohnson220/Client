import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { PfCommonModule } from 'libs/core';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { generateMockRoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { generateMockStructureRangeDistributionTypes, generateMockRangeDistributionSetting } from 'libs/models/payfactors-api';

import * as fromJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import { RangeRoundingComponent } from './range-rounding.component';
import { generateMockRangeAdvancedSetting } from '../../models';

describe('Job Based Ranges - Rounding Settings', () => {
  let instance: RangeRoundingComponent;
  let fixture: ComponentFixture<RangeRoundingComponent>;
  let store: Store<fromJobBasedRangeReducer.State>;
  let ngbModal: NgbModal;

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
      RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
      RangeDistributionSetting: generateMockRangeDistributionSetting(),
      RangeAdvancedSetting: generateMockRangeAdvancedSetting()
    };

    instance.roundingSettings = generateMockRoundingSettingsDataObj();

  });

  it('should dispatch UpdateRoundingType on handleTypeChange', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromSharedJobBasedRangeActions.UpdateRoundingType( { RoundingSetting: 'mid', RoundingType: RoundingTypes.Round });

    instance.handleTypeChange('mid', RoundingTypes.Round);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch UpdateRoundingPoint on handlePointChange', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'mid', RoundingPoint: 0 });

    instance.handlePointChange('mid', 0);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch UpdateRoundingPoint to set 0 for mid, min and max and update defaultSet when rate is annual', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'min', RoundingPoint: 0 });
    const expectedAction2 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'mid', RoundingPoint: 0 });
    const expectedAction3 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'max', RoundingPoint: 0 });

    // default set should not run more than once, but for test purposes we can reset it here
    instance.defaultSet = false;
    instance.metadata.Rate = 'annual';
    instance.setDefaults();

    expect(instance.defaultSet).toEqual(true);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction3);

  });

  it('should dispatch UpdateRoundingPoint to set 2 for mid, min and max and update defaultSet when rate is hourly', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'min', RoundingPoint: 2 });
    const expectedAction2 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'mid', RoundingPoint: 2 });
    const expectedAction3 = new fromSharedJobBasedRangeActions.UpdateRoundingPoint( { RoundingSetting: 'max', RoundingPoint: 2 });

    // default set should not run more than once, but for test purposes we can reset it here
    instance.defaultSet = false;
    instance.metadata.Rate = 'hourly';
    instance.setDefaults();

    expect(instance.defaultSet).toEqual(true);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction3);

  });
});
