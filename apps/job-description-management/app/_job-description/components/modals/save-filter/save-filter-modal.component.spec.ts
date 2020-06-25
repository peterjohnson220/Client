import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../../reducers';
import { SaveFilterModalComponent } from './save-filter-modal.component';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: SaveFilterModalComponent;
  let fixture: ComponentFixture<SaveFilterModalComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [
        SaveFilterModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SaveFilterModalComponent);
    instance = fixture.componentInstance;

    instance.filterForm = new FormGroup({});

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
  });

  it('should reset component variables and open the modal, when calling open', () => {
    spyOn(instance.opened, 'emit');
    spyOn(instance.filterForm, 'reset');
    spyOn(modal, 'open');

    instance.saveFilterModal = {};

    instance.open();

    expect(instance.opened.emit).toHaveBeenCalled();
    expect(instance.filterForm.reset).toHaveBeenCalled();
    expect(modal.open).toHaveBeenLastCalledWith(instance.saveFilterModal, { backdrop: 'static' });
  });
});
