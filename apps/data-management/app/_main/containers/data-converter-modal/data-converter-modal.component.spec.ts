import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockConverterSettings } from 'libs/models';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromConverterSettingsActions from '../../actions/converter-settings.actions';
import { DataConverterModalComponent } from './data-converter-modal.component';

describe('Data Management - Main - Data Converter Modal', () => {
  let instance: DataConverterModalComponent;
  let fixture: ComponentFixture<DataConverterModalComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        }),
      ],
      providers: [],
      declarations: [
        DataConverterModalComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DataConverterModalComponent);
    instance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch an action on dismiss of the modal', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromConverterSettingsActions.OpenDataConverterModal({open: false, modalInfo: null});

    instance.closeDataConverterModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a close action on save button of modal click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromConverterSettingsActions.OpenDataConverterModal({open: false, modalInfo: null});

    instance.saveDataConverterModal(null);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action on save button of modal click to save and close', () => {
    spyOn(store, 'dispatch');
    const mockConverterSetting = generateMockConverterSettings();
    const expectedSaveAction = new fromConverterSettingsActions.AddConverterSetting({converterSetting: mockConverterSetting});
    const expectedCloseAction = new fromConverterSettingsActions.OpenDataConverterModal({open: false, modalInfo: null});

    instance.saveDataConverterModal(mockConverterSetting);

    expect(store.dispatch).toHaveBeenCalledWith(expectedSaveAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedCloseAction);
  });
});
