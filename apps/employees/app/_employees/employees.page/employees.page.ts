import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserContext } from 'libs/models';
import { Permissions } from 'libs/constants';
import { ActionBarConfig, ColumnChooserType, GridConfig } from 'libs/features/pf-data-grid/models';
import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions/pf-data-grid.actions';
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
export class EmployeesPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('pricingJobsMessage', { static: true }) public pricingJobsMessage: any;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;
  @ViewChild('salaryColumn') salaryColumn: ElementRef;
  @ViewChild('rateBasedSalaryColumn') rateBasedSalaryColumn: ElementRef;
  permissions = Permissions;
  userContext$: Observable<UserContext>;
  pricingJobs$: Observable<boolean>;
  pricingJobsError$: Observable<boolean>;

  showDeleteEmployeeModal = new BehaviorSubject<boolean>(false);
  showDeleteEmployeeModal$ = this.showDeleteEmployeeModal.asObservable();

  showEmployeeHistoryModal = new BehaviorSubject<boolean>(false);
  showEmployeeHistoryModal$ = this.showEmployeeHistoryModal.asObservable();

  selectedCompanyEmployeeIdsSubscription: Subscription;
  pricingJobsSubscription: Subscription;

  pageViewId = EmployeesPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee_ID'
  }];
  selectedCompanyEmployeeIds: number[];
  pricingJobs: boolean;
  filterTemplates = {};
  colTemplates = {};
  actionBarConfig: ActionBarConfig;
  fieldsExcludedFromExport = ['CompanyEmployee_ID', 'HiddenRate'];
  gridConfig: GridConfig;

  constructor(
    private rootStore: Store<fromRootState.State>,
    public store: Store<fromEmployeesReducer.State>,
    public employeeManagementStore: Store<fromEmployeeManagementReducers.State>,
    private pfGridStore: Store<fromPfGridReducer.State>,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
    this.pricingJobs$ = this.store.pipe(select(fromEmployeesReducer.getPricingJobs));
    this.pricingJobsError$ = this.store.pipe(select(fromEmployeesReducer.getPricingsJobsError));
    this.actionBarConfig = {
      ShowActionBar: true,
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: true,
      AllowSaveFilter: false,
      ExportSourceName: 'Employees',
      ColumnChooserType: ColumnChooserType.ColumnGroup,
      ColumnChooserSubmitText: 'Save'
    };
    this.gridConfig = {
      PersistColumnWidth: true
    };
  }

  ngOnInit(): void {
    this.selectedCompanyEmployeeIdsSubscription = this.pfGridStore.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedCompanyEmployeeIds = sk;
    });
    this.pricingJobsSubscription = this.pricingJobs$.subscribe(value => this.handlePricingJobsStatusChanged(value));
  }

  ngAfterViewInit(): void {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
    this.colTemplates = {
      'salary': { Template: this.salaryColumn },
      'rateBasedSalary': { Template: this.rateBasedSalaryColumn }
    };
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

  handleClearSelectionClicked(): void {
    this.pfGridStore.dispatch(new fromPfGridActions.ClearSelections(this.pageViewId));
  }

  handleEmployeeHistoryDateChange(date: string): void {
    this.showEmployeeHistoryModal.next(false);
    this.router.navigate([`history/${date}`]);
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

