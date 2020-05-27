import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { PfCommonModule } from 'libs/core';

import * as fromJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import { EmployeesPageComponent } from './employees.page';
import { RangeValuePipe } from '../../shared/pipes';

describe('Job Based Range Employees - Employees Page', () => {
  let instance: EmployeesPageComponent;
  let fixture: ComponentFixture<EmployeesPageComponent>;
  let store: Store<fromJobBasedRangeReducer.State>;
  let ngbModal: NgbModal;
  let route: ActivatedRoute;

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
      declarations: [ EmployeesPageComponent, RangeValuePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { parent: {snapshot: {params: {id: 1}}}, snapshot: {params: {id: 1}}}
        }

      ]
    });

    fixture = TestBed.createComponent(EmployeesPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    ngbModal = TestBed.get(NgbModal);
    route = TestBed.get(ActivatedRoute);
  });

  it('should dispatch the openModal action when handleModelSettingsClicked is called', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromModelSettingsModalActions.OpenModal();

    instance.handleModelSettingsBtnClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a Reset action to pfdatagrid upon destroy', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromPfGridActions.Reset();

    instance.ngOnDestroy();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });






});