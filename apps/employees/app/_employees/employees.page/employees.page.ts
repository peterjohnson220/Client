import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserContext } from 'libs/models';
import { Permissions } from 'libs/constants';
import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromEmployeeManagementReducers from 'libs/features/employee-management/reducers';
import * as fromEmployeeManagementActions from 'libs/features/employee-management/actions';

import * as fromEmployeesReducer from '../reducers';
import * as fromEmployeesPageActions from '../actions/employees-page.actions';
import { EmployeesPageViewId } from '../models';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, OnDestroy {

  @ViewChild('pricingJobsMessage', { static: true }) public pricingJobsMessage: any;
  permissions = Permissions;
  userContext$: Observable<UserContext>;
  pricingJobs$: Observable<boolean>;
  pricingJobsError$: Observable<boolean>;

  showDeleteEmployeeModal = new BehaviorSubject<boolean>(false);
  showDeleteEmployeeModal$ = this.showDeleteEmployeeModal.asObservable();

  selectedCompanyEmployeeIdsSubscription: Subscription;
  pricingJobsSubscription: Subscription;

  pageViewId = EmployeesPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee_ID'
  }];
  selectedCompanyEmployeeIds: number[];
  pricingJobs: boolean;

  constructor(
    private rootStore: Store<fromRootState.State>,
    public store: Store<fromEmployeesReducer.State>,
    public employeeManagementStore: Store<fromEmployeeManagementReducers.State>,
    private pfGridStore: Store<fromPfGridReducer.State>,
    private modalService: NgbModal
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
    this.pricingJobs$ = this.store.pipe(select(fromEmployeesReducer.getPricingJobs));
    this.pricingJobsError$ = this.store.pipe(select(fromEmployeesReducer.getPricingsJobsError));
  }

  ngOnInit(): void {
    this.selectedCompanyEmployeeIdsSubscription = this.pfGridStore.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedCompanyEmployeeIds = sk;
    });
    this.pricingJobsSubscription = this.pricingJobs$.subscribe(value => this.handlePricingJobsStatusChanged(value));
  }

  ngOnDestroy(): void {
    this.selectedCompanyEmployeeIdsSubscription.unsubscribe();
    this.pricingJobsSubscription.unsubscribe();
  }

  getPageTitle(companyName: string): string {
    return companyName ? `${companyName} Employees` : '';
  }

  public get priceJobsDisabled(): boolean {
    return !this.selectedCompanyEmployeeIds || this.selectedCompanyEmployeeIds.length === 0 || this.pricingJobs;
  }

  addNewEmployee() {
    this.employeeManagementStore.dispatch(new fromEmployeeManagementActions.AddEmployee());
  }

  handlePriceJobsClicked(): void {
    this.store.dispatch(new fromEmployeesPageActions.PriceJobs({ companyEmployeeIds: this.selectedCompanyEmployeeIds }));
  }

  handlePricingJobsMessageCloseClicked(): void {
    this.modalService.dismissAll();
    this.store.dispatch(new fromEmployeesPageActions.ResetPricingJobsStatus());
  }

  handleEmployeeDelete() {
    this.showDeleteEmployeeModal.next(false);
    return this.store.dispatch(new fromEmployeesPageActions.DeleteEmployee({pageViewId: this.pageViewId, companyEmployeeIds: this.selectedCompanyEmployeeIds}));
  }

  handleEditClicked(): void {
    if (!this.selectedCompanyEmployeeIds || this.selectedCompanyEmployeeIds.length !== 1) {
      return;
    }
    this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
      companyEmployeeId: this.selectedCompanyEmployeeIds[0]
    }));
  }

  private handlePricingJobsStatusChanged(value: boolean): void {
    this.pricingJobs = value;
    if (this.pricingJobs) {
      this.modalService.open(this.pricingJobsMessage, { backdrop: 'static', centered: true, size: 'sm' });
    } else {
      this.modalService.dismissAll();
    }
  }
}

