import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models';
import { generateMockEntity, generateMockUserDataView } from 'libs/features/formula-editor';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { DuplicateDataViewModalComponent } from './duplicate-data-view-modal.component';

describe('Data Insights - Duplicate Data View Modal Component', () => {
  let instance: DuplicateDataViewModalComponent;
  let fixture: ComponentFixture<DuplicateDataViewModalComponent>;
  let ngbModal: NgbModal;
  let store: Store<fromDataViewMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataView_main: combineReducers(fromDataViewMainReducer.reducers)
        })
      ],
      declarations: [DuplicateDataViewModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn(), patchValue: jest.fn() }
        },
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(DuplicateDataViewModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);
    store = TestBed.inject(Store);
    instance.baseDataViewForm = new FormGroup({
      entity: new FormControl(''),
      name: new FormControl(''),
      summary: new FormControl('')
    });
    instance.baseEntitiesSubscription = of(generateDefaultAsyncStateObj([generateMockEntity()])).subscribe();
    fixture.detectChanges();
  });

  it('should open dupicateDataViewModal using modalService when open is called', () => {
    spyOn(ngbModal, 'open');

    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should dispatch DuplicateUserReport action when save is called', () => {
    instance.userDataView = generateMockUserDataView();
    instance.baseDataViewForm.patchValue({
      entity: instance.userDataView.Entity,
      name: instance.userDataView.Name,
      summary: instance.userDataView.Summary
    });
    const expectedAction = new fromDataViewActions.DuplicateUserReport(instance.userDataView);

    spyOn(store, 'dispatch');
    instance.save();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should update form with correct data when updating', () => {
    instance.userDataView = { ...generateMockUserDataView(), Name: 'Updated Report Name'};

    instance.updateForm();

    expect(instance.baseDataViewForm.value.name).toEqual('Copy of Updated Report Name');
  });

});
