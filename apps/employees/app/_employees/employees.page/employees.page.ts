import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { Permissions } from 'libs/constants';
import { PfSecuredResourceDirective } from 'libs/forms/directives';
import * as fromEmployeeManagementActions from 'libs/features/employee-management/actions';
import * as fromEmployeeManagementReducers from 'libs/features/employee-management/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions/pf-data-grid.actions';
import {
  ActionBarConfig,
  ColumnChooserType,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig
} from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { AsyncStateObj } from 'libs/models/state';

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
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;
  permissions = Permissions;
  pricingJobs$: Observable<boolean>;
  pricingJobsError$: Observable<boolean>;
  totalRewardsStatement$: Observable<AsyncStateObj<Statement>>;
  employeeRewardsData$: Observable<AsyncStateObj<EmployeeRewardsData>>;
  totalRewardsStatementId$: Observable<AsyncStateObj<string>>;

  showDeleteEmployeeModal = new BehaviorSubject<boolean>(false);
  showDeleteEmployeeModal$ = this.showDeleteEmployeeModal.asObservable();

  showEmployeeHistoryModal = new BehaviorSubject<boolean>(false);
  showEmployeeHistoryModal$ = this.showEmployeeHistoryModal.asObservable();

  showTotalRewardsStatementModal = new BehaviorSubject<boolean>(false);
  showTotalRewardsStatementModal$ = this.showTotalRewardsStatementModal.asObservable();

  selectedCompanyEmployeeIdsSubscription: Subscription;
  pricingJobsSubscription: Subscription;
  totalRewardsStatementSubscription: Subscription;
  employeeRewardsDataSubscription: Subscription;
  totalRewardsStatementIdSubscription: Subscription;

  pageViewId = EmployeesPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee_ID'
  }];
  selectedDropdown: NgbDropdown;
  selectedCompanyEmployeeIds: number[];
  selectedCompanyEmployeeId: number;
  deleteSingleEmployee = false;
  pricingJobs: boolean;
  filterTemplates = {};
  colTemplates = {};
  actionBarConfig: ActionBarConfig;
  fieldsExcludedFromExport = ['CompanyEmployee_ID', 'HiddenRate'];
  gridConfig: GridConfig;
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  hasDropdownOptions: boolean;
  totalRewardsStatementMode = StatementModeEnum.Print;
  totalRewardsStatement: Statement;
  employeeRewardsData: EmployeeRewardsData;
  totalRewardsStatementId: string;

  constructor(
    public store: Store<fromEmployeesReducer.State>,
    public employeeManagementStore: Store<fromEmployeeManagementReducers.State>,
    private pfGridStore: Store<fromPfGridReducer.State>,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.pricingJobs$ = this.store.pipe(select(fromEmployeesReducer.getPricingJobs));
    this.pricingJobsError$ = this.store.pipe(select(fromEmployeesReducer.getPricingsJobsError));
    this.showTotalRewardsStatementModal$ = this.store.pipe(select(fromEmployeeManagementReducers.getIsTotalRewardsStatementModalOpen));
    this.totalRewardsStatement$ = this.store.pipe(select(fromEmployeeManagementReducers.getTotalRewardsStatement));
    this.employeeRewardsData$ = this.store.pipe(select(fromEmployeeManagementReducers.getEmployeeTotalRewardsData));
    this.totalRewardsStatementId$ = this.store.pipe(select(fromEmployeeManagementReducers.getTotalRewardsStatementId));

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: true,
      AllowSaveFilter: true,
      ExportSourceName: 'Employees',
      ColumnChooserType: ColumnChooserType.ColumnGroup
    };
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'employees'
    };
  }

  ngOnInit(): void {
    this.selectedCompanyEmployeeIdsSubscription = this.pfGridStore.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedCompanyEmployeeIds = sk;
    });
    this.pricingJobsSubscription = this.pricingJobs$.subscribe(value => this.handlePricingJobsStatusChanged(value));
    this.totalRewardsStatementSubscription = this.totalRewardsStatement$.subscribe(s => this.totalRewardsStatement = s.obj);
    this.employeeRewardsDataSubscription = this.employeeRewardsData$.subscribe(e => this.employeeRewardsData = e.obj);
    this.totalRewardsStatementIdSubscription = this.totalRewardsStatementId$.subscribe(id => this.totalRewardsStatementId = id.obj);
    window.addEventListener('scroll', this.scroll, true);
  }

  ngAfterViewInit(): void {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate : this.gridRowActionsTemplate
    };
    this.colTemplates = {
      'salary': { Template: this.salaryColumn },
      'rateBasedSalary': { Template: this.rateBasedSalaryColumn }
    };
    // to combat ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.hasDropdownOptions = this.checkHasDropdownOptions([this.permissions.EMPLOYEES_ADD_EDIT_DELETE, this.permissions.NEW_PROJECT]);
    }, 0);
  }

  ngOnDestroy(): void {
    this.selectedCompanyEmployeeIdsSubscription.unsubscribe();
    this.pricingJobsSubscription.unsubscribe();
    this.totalRewardsStatementSubscription.unsubscribe();
    this.employeeRewardsDataSubscription.unsubscribe();
    this.totalRewardsStatementIdSubscription.unsubscribe();
  }

  public get priceJobsDisabled(): boolean {
    return !this.selectedCompanyEmployeeIds || this.selectedCompanyEmployeeIds.length === 0 || this.pricingJobs;
  }

  scroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  addNewEmployee() {
    this.employeeManagementStore.dispatch(new fromEmployeeManagementActions.AddEmployee());
  }

  handlePriceJobsClicked(fromActionsColumn?: boolean): void {
    if (fromActionsColumn) {
      this.store.dispatch(new fromEmployeesPageActions.PriceJobs({ companyEmployeeIds: [this.selectedCompanyEmployeeId] }));
    } else {
      this.store.dispatch(new fromEmployeesPageActions.PriceJobs({ companyEmployeeIds: this.selectedCompanyEmployeeIds }));
    }
  }

  handlePricingJobsMessageCloseClicked(): void {
    this.modalService.dismissAll();
    this.store.dispatch(new fromEmployeesPageActions.ResetPricingJobsStatus());
  }

  handleEmployeeDelete() {
    this.showDeleteEmployeeModal.next(false);
    if (this.deleteSingleEmployee) {
      return this.store.dispatch(new fromEmployeesPageActions.DeleteEmployee({
        pageViewId: this.pageViewId,
        companyEmployeeIds: [this.selectedCompanyEmployeeId]
      }));
    } else {
      return this.store.dispatch(new fromEmployeesPageActions.DeleteEmployee({
        pageViewId: this.pageViewId,
        companyEmployeeIds: this.selectedCompanyEmployeeIds
      }));
    }
  }

  handleEditClicked(fromActionsColumn?: boolean): void {
    if (fromActionsColumn) {
      this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
        companyEmployeeId: this.selectedCompanyEmployeeId
      }));
    } else {
      if (!this.selectedCompanyEmployeeIds || this.selectedCompanyEmployeeIds.length !== 1) {
        return;
      }
      this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
        companyEmployeeId: this.selectedCompanyEmployeeIds[0]
      }));
    }
  }

  handleDeleteSingleEmployeeClicked() {
    this.deleteSingleEmployee = true;
    this.showDeleteEmployeeModal.next(true);
  }

  handleClearSelectionClicked(): void {
    this.pfGridStore.dispatch(new fromPfGridActions.ClearSelections(this.pageViewId));
  }

  handleEmployeeHistoryDateChange(date: string): void {
    this.showEmployeeHistoryModal.next(false);
    this.router.navigate([`history/${date}`]);
  }

  handleSelectedRowAction(companyEmployeeId: number, dropdown: any, isOpened: boolean) {
    if (this.selectedDropdown?.isOpen() && this.selectedDropdown !== dropdown) {
      this.selectedDropdown.close();
    }

    this.selectedDropdown = dropdown;
    this.selectedCompanyEmployeeId = companyEmployeeId;

    if (isOpened && this.pfSecuredResourceDirective.doAuthorize(this.permissions.TOTAL_REWARDS)) {
      this.store.dispatch(new fromEmployeeManagementActions.GetTotalRewardsStatementId({ companyEmployeeId: companyEmployeeId }));
    }
  }

  handleModalDismissed(): void {
    this.deleteSingleEmployee = false;
    this.selectedCompanyEmployeeId = null;
    this.showDeleteEmployeeModal.next(false);
  }

  checkHasDropdownOptions(permissions: string[]): boolean {
    if (this.pfSecuredResourceDirective) {
      return this.pfSecuredResourceDirective.doAuthorizeAny(permissions);
    }
  }

  handleViewTotalRewardsStatementClicked(employeeId: number): void {
    this.store.dispatch(new fromEmployeeManagementActions.OpenTotalRewardsStatement());
    this.store.dispatch(new fromEmployeeManagementActions.GetTotalRewardsStatement());
    this.store.dispatch(new fromEmployeeManagementActions.GetEmployeeTotalRewardsData({
      companyEmployeeId: employeeId,
      statementId: this.totalRewardsStatementId
    }));
  }

  handleDismissTotalRewardsModal(): void {
    this.store.dispatch(new fromEmployeeManagementActions.CloseTotalRewardsStatement());
  }

  getTotalRewardsModalTitle(): string {
    let totalRewardsModalTitle = 'Your Total Rewards Statement - ';
    if (this.employeeRewardsData) {
      if (this.employeeRewardsData.EmployeeFirstName && this.employeeRewardsData.EmployeeLastName) {
        totalRewardsModalTitle += this.employeeRewardsData.EmployeeFirstName + ' ' + this.employeeRewardsData.EmployeeLastName;
      } else if (this.employeeRewardsData.EmployeeFirstName && !this.employeeRewardsData.EmployeeLastName) {
        totalRewardsModalTitle += this.employeeRewardsData.EmployeeFirstName;
      } else if (!this.employeeRewardsData.EmployeeFirstName && this.employeeRewardsData.EmployeeLastName) {
        totalRewardsModalTitle += this.employeeRewardsData.EmployeeLastName;
      } else {
        if (this.employeeRewardsData.EmployeeId) {
          totalRewardsModalTitle += this.employeeRewardsData.EmployeeId;
        }
      }
    }
    return totalRewardsModalTitle;
  }

  public downloadStatement(): void {
    this.store.dispatch(
      new fromEmployeesPageActions.GenerateStatement(
        { statementId: this.totalRewardsStatement.StatementId, companyEmployeeIds: [this.selectedCompanyEmployeeId] }
        ));
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

