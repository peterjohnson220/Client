import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { generateMockEntity, BaseDataView, generateMockBaseDataView } from 'libs/features/formula-editor';

import * as fromSharedReducer from '../../../_shared/reducers';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { CreateDataViewModalComponent } from './create-data-view-modal.component';

describe('Data Insights - Create Data View Modal', () => {
  let instance: CreateDataViewModalComponent;
  let fixture: ComponentFixture<CreateDataViewModalComponent>;
  let ngbModal: NgbModal;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
          dataInsightsShared_main: combineReducers(fromSharedReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule,
        DropDownListModule
      ],
      declarations: [ CreateDataViewModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn(), patchValue: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(CreateDataViewModalComponent);
    instance = fixture.componentInstance;
    instance.baseDataViewForm = new FormGroup({
      entity: new FormControl(''),
      name: new FormControl(''),
      summary: new FormControl('')
    });
    ngbModal = TestBed.inject(NgbModal);
    store = TestBed.inject(Store);
  });

  it('should open modal using modalService when open is called', () => {
    spyOn(ngbModal, 'open');

    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should dispatch SaveUserReport action when save is called', () => {
    spyOn(store, 'dispatch');

    const baseDataView: BaseDataView = generateMockBaseDataView();
    instance.baseDataViewForm.patchValue({
      entity: generateMockEntity(),
      name: baseDataView.Name,
      summary: baseDataView.Summary
    });
    const expectedAction = new fromDataViewActions.SaveUserReport(baseDataView);

    instance.save();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
