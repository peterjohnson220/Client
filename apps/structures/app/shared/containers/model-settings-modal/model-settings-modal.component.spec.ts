import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PfCommonModule } from 'libs/core';
import { generateMockRangeAdvancedSetting, generateMockRangeDistributionSettingForm } from 'libs/models/structures';
import { generateMockStructureRangeDistributionTypes } from 'libs/models/payfactors-api/structures/response';

import { ModelSettingsModalComponent } from './model-settings-modal.component';
import * as fromSharedReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';

describe('ModelSettingsModalComponent', () => {
  let instance: ModelSettingsModalComponent;
  let fixture: ComponentFixture<ModelSettingsModalComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          structures_shared: combineReducers(fromSharedReducer.reducers)
        }),
        PfCommonModule
      ],
      declarations: [
        ModelSettingsModalComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        SettingsService
      ]
    });

    fixture = TestBed.createComponent(ModelSettingsModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);

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

    instance.ngOnInit();
  });

  it('should emit handleSubmit on submit', () => {
    spyOn(instance.modalSubmit, 'emit');

    instance.handleModalSubmit();
    expect(instance.modalSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit handleSubmitAttempt on submit', () => {
    spyOn(instance.modalAttemptedSubmit, 'emit');

    instance.handleModalSubmitAttempt();
    expect(instance.modalAttemptedSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit handleModalDismissed on cancel', () => {
    spyOn(instance.modalDismissed, 'emit');

    instance.handleModalDismiss();
    expect(instance.modalDismissed.emit).toHaveBeenCalledTimes(1);
  });

  it('should dispatch cancel and close modal, as well as call reset on dismiss', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction1 = new fromModelSettingsModalActions.CloseModal();
    const expectedAction2 = new fromModelSettingsModalActions.Cancel();

    instance.handleModalDismiss();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction2);
  });

});
