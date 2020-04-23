import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { PfCommonModule } from 'libs/core';

import * as fromEmployeesReducer from '../reducers';
import * as fromEmployeesPageActions from '../actions/employees-page.actions';
import { EmployeesPageComponent } from './employees.page';
import { of } from 'rxjs';

describe('Employees - Employees Page', () => {
  let instance: EmployeesPageComponent;
  let fixture: ComponentFixture<EmployeesPageComponent>;
  let store: Store<fromEmployeesReducer.State>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          employees_main: combineReducers(fromEmployeesReducer.reducers),
          pfDataGrids: combineReducers(fromPfGridReducer.reducers)
        }),
        PfCommonModule
      ],
      declarations: [ EmployeesPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(EmployeesPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    ngbModal = TestBed.get(NgbModal);
    instance.selectedCompanyEmployeeIdsSubscription = of([]).subscribe();
    instance.pricingJobsSubscription = of(false).subscribe();
  });

  it('should dispatch PriceJobs action when handling price jobs clicked', () => {
    spyOn(instance.store, 'dispatch');
    instance.selectedCompanyEmployeeIds = [ 1, 2, 3 ];
    const expectedAction = new fromEmployeesPageActions.PriceJobs({ companyEmployeeIds: instance.selectedCompanyEmployeeIds });

    instance.handlePriceJobsClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ResetPricingJobsStatus when handling pricing jobs error Close button clicked', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromEmployeesPageActions.ResetPricingJobsStatus();

    instance.handlePricingJobsMessageCloseClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should use the modal service to open the pricing jobs message modal when pricingJobs is true', () => {
    spyOn(ngbModal, 'open');
    instance.pricingJobs$ = of(true);

    fixture.detectChanges();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should use the modal service to dismiss the modal when handling pricing jobs error Close button clicked', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.handlePricingJobsMessageCloseClicked();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should disable Price Jobs button if there are no employees selected', () => {
    instance.selectedCompanyEmployeeIds = [];

    expect(instance.priceJobsDisabled).toEqual(true);
  });

  it('should NOT disable Price Jobs button if there are employees selected', () => {
    instance.selectedCompanyEmployeeIds = [ 1, 2, 3 ];
    instance.pricingJobs = false;

    expect(instance.priceJobsDisabled).toEqual(false);
  });

  it('should disable Price Jobs button when creating project', () => {
    instance.selectedCompanyEmployeeIds = [ 1, 2, 3 ];
    instance.pricingJobs = true;

    expect(instance.priceJobsDisabled).toEqual(true);
  });

});
