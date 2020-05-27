import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { PfCommonModule } from 'libs/core';

import * as fromJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import { ModelSettingsModalComponent } from './model-settings-modal.component';
import { UrlService } from '../../services';
import { Pages } from '../../constants/pages';

describe('Job Based Ranges - Model Settings Modal', () => {
  let instance: ModelSettingsModalComponent;
  let fixture: ComponentFixture<ModelSettingsModalComponent>;
  let store: Store<fromJobBasedRangeReducer.State>;
  let ngbModal: NgbModal;
  let urlService: UrlService;

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
      declarations: [ ModelSettingsModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: UrlService,
          useValue: { isInWorkflow: jest.fn()}
        }

      ]
    });

    fixture = TestBed.createComponent(ModelSettingsModalComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    ngbModal = TestBed.get(NgbModal);
    urlService = TestBed.get(UrlService);
    // mock the metadata
    instance.metadata = {
      Paymarket: 'Boston',
      PaymarketId: 1,
      StructureName: 'testStruc',
      ModelName: 'testModel',
      Currency: 'USD',
      Rate: 'Annual',
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      SpreadMin: 10,
      SpreadMax: 10,
      IsCurrent: false

    };

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
    const expectedAction = new fromModelSettingsModalActions.GetStructureNameSuggestions({filter: 'test'});
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
      ControlPoint: 'Base',
      ControlPointDisplay: 'Base',
      SpreadMin: 10,
      SpreadMax: 10,
      IsCurrent: false

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
    instance.page = Pages.Model;
    instance.roundingSettings = {};
    const expectedAction = new fromModelSettingsModalActions.SaveModelSettings({ rangeGroupId: instance.rangeGroupId, rounding: instance.roundingSettings, fromPage: Pages.Model, formValue: instance.modelSettingsForm.value});

    instance.handleModalSubmit();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(instance.attemptedSubmit).toEqual(false);
  });




});