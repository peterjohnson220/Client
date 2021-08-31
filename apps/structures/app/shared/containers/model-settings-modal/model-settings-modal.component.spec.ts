import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { PfCommonModule } from 'libs/core';

import { ModelSettingsModalComponent } from './model-settings-modal.component';
import * as fromSharedReducer from '../../reducers';

describe('ModelSettingsModalComponent', () => {
  let instance: ModelSettingsModalComponent;
  let fixture: ComponentFixture<ModelSettingsModalComponent>;
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

    ngbModal = TestBed.inject(NgbModal);
  });

  it('should emit handleSubmit on submit', () => {
    jest.spyOn(instance.modalSubmit, 'emit');

    instance.handleModalSubmit();
    expect(instance.modalSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit handleSubmitAttempt on submit', () => {
    jest.spyOn(instance.modalAttemptedSubmit, 'emit');

    instance.handleModalSubmitAttempt();
    expect(instance.modalAttemptedSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit handleModalDismissed on cancel', () => {
    jest.spyOn(instance.modalDismissed, 'emit');

    instance.handleModalDismiss();
    expect(instance.modalDismissed.emit).toHaveBeenCalledTimes(1);
  });

});
