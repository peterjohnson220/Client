import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchRegressionFlagsModalComponent } from './switch-regression-flags-modal.component';

import * as fromRootState from 'libs/state/state';
import { AbstractFeatureFlagService, PfCommonModule } from 'libs/core';
import { SettingsService } from 'libs/state/app-context/services';
import { SwitchRegressionFlagsRequest } from 'libs/models/payfactors-api';

import * as fromSharedReducer from '../../../../shared/reducers';
import * as fromGradeBasedSharedReducer from '../../reducers';
import * as fromSwitchRegressionFlagsActions from '../../actions/switch-regression-flags-modal.actions';

describe('SwitchRegressionFlagsModalComponent', () => {
  let instance: SwitchRegressionFlagsModalComponent;
  let fixture: ComponentFixture<SwitchRegressionFlagsModalComponent>;
  let store: Store<any>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SwitchRegressionFlagsModalComponent
      ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          structures_gradeBasedRange_shared: combineReducers(fromGradeBasedSharedReducer.reducers),
          structures_shared: combineReducers(fromSharedReducer.reducers)
        }),
        PfCommonModule,
        NgbNavModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
        SettingsService
      ]
    });
    fixture = TestBed.createComponent(SwitchRegressionFlagsModalComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);
    instance.rangeGroupId = 1;
    instance.ngOnInit();
  });

  it('should set showAll and selectAll to false on init', () => {
    instance.ngOnInit();

    expect(instance.showAll).toBe(false);
    expect(instance.selectAllFlag).toBe(false);
  });

  it('should dispatch CloseModal on dismiss', () => {
    jest.spyOn(instance.store, 'dispatch');
    const expectedAction = new fromSwitchRegressionFlagsActions.CloseModal();

    instance.handleDismiss();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SwitchRegressionFlags on submit', () => {
    jest.spyOn(instance.store, 'dispatch');
    const request: SwitchRegressionFlagsRequest = { CompanyStructuresRangeGroupId: instance.rangeGroupId,
      CompanyJobStructuresIds: []} ;
    const expectedAction = new fromSwitchRegressionFlagsActions.SwitchRegressionFlags(request);

    instance.handleSwitch();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should selectAll when selectAll is called', () => {
    jest.spyOn(instance.store, 'dispatch');
    instance.gradePoints = [];
    instance.gradePoints.push({ CompanyJobsStructuresId: 1, Mrp: 10000, IncludeInRegression: false, Selected: false, JobTitle: 'some title'});
    instance.gradePoints.push({ CompanyJobsStructuresId: 2, Mrp: 20000, IncludeInRegression: false, Selected: false, JobTitle: 'some other title'});
    instance.selectAllFlag = false;

    instance.selectAll();

    expect(instance.gradePoints[0].Selected).toBe(true);
    expect(instance.gradePoints[1].Selected).toBe(true);
  });

  it('should select an individual gradePoint (and not any others) when selectGradePoint is called', () => {
    jest.spyOn(instance.store, 'dispatch');
    instance.gradePoints = [];
    instance.gradePoints.push({ CompanyJobsStructuresId: 1, Mrp: 10000, IncludeInRegression: false, Selected: false, JobTitle: 'some title'});
    instance.gradePoints.push({ CompanyJobsStructuresId: 2, Mrp: 20000, IncludeInRegression: false, Selected: false, JobTitle: 'some other title'});
    instance.selectAllFlag = false;

    instance.selectGradePoint(1);

    expect(instance.gradePoints[0].Selected).toBe(true);
    expect(instance.gradePoints[1].Selected).toBe(false);
  });

});
