import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EditDataViewModalComponent } from './edit-data-view-modal.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models';

import { generateMockEntity } from '../../../_shared/models';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { generateMockUserDataView } from '../../models';

describe('Data Insights - Edit Data View Modal', () => {
  let instance: EditDataViewModalComponent;
  let fixture: ComponentFixture<EditDataViewModalComponent>;
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
      declarations: [EditDataViewModalComponent],
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

    fixture = TestBed.createComponent(EditDataViewModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.get(NgbModal);
    store = TestBed.get(Store);
    instance.baseDataViewForm = new FormGroup({
      entity: new FormControl(''),
      name: new FormControl(''),
      summary: new FormControl('')
    });
    instance.baseEntitiesSubscription = of(generateDefaultAsyncStateObj([generateMockEntity()])).subscribe();
    fixture.detectChanges();
  });

  it('should open editDataViewModal using modalService when open is called', () => {
    spyOn(ngbModal, 'open');

    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should dispatch EditUserReport action when save is called', () => {
    instance.userDataView = generateMockUserDataView();
    instance.baseDataViewForm.patchValue({
      entity: instance.userDataView.Entity,
      name: instance.userDataView.Name,
      summary: instance.userDataView.Summary
    });
    const expectedAction = new fromDataViewActions.EditUserReport(instance.userDataView);

    spyOn(store, 'dispatch');
    instance.save();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should update form with correct data when updating', () => {
    instance.userDataView = { ...generateMockUserDataView(), Name: 'Updated Report Name'};

    instance.updateForm();

    expect(instance.baseDataViewForm.value.name).toEqual('Updated Report Name');
  });
});
