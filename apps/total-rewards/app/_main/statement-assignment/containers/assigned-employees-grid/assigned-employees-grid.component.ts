import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { Permissions } from 'libs/constants';
import { GridTypeEnum, ListAreaColumn, SelectAllStatus } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions';
import { TotalRewardAssignedEmployee } from 'libs/models/payfactors-api';

import * as fromAssignedEmployeesGridReducer from '../../reducers';
import * as fromAssignedEmployeesGridActions from '../../actions/assigned-employees-grid.actions';
import * as fromAssignedEmployeesPageActions from '../../actions/statement-assignment.page.actions';

@Component({
  selector: 'pf-assigned-employees-grid',
  templateUrl: './assigned-employees-grid.component.html',
  styleUrls: ['./assigned-employees-grid.component.scss']
})
export class AssignedEmployeesGridComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  @Input() gridState: any;
  @Input() displayNoEmployeesImage: boolean;
  @Output() gridStateChange = new EventEmitter<any>();
  @Output() openAssignModalClicked: EventEmitter<any> = new EventEmitter();

  assignedEmployeesGridData$: Observable<GridDataResult>;
  assignedEmployeesDataLoading$: Observable<boolean>;
  assignedEmployeesDataLoadingError$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  selectedCompanyEmployeeIds$: Observable<number[]>;
  openActionMenuEmployee$: Observable<TotalRewardAssignedEmployee>;
  selectAllState$: Observable<string>;
  listAreaColumns$: Observable<ListAreaColumn[]>;

  selectedCompanyEmployeeIds: number[];
  selectAllStatus = SelectAllStatus;
  permissions = Permissions;
  selectedDropdown: NgbDropdown;
  selectedCompanyEmployeeId: number;

  selectedCompanyEmployeeIdsSubscription = new Subscription();
  pageSizes = [20, 50, 100, 250];

  constructor(private store: Store<fromAssignedEmployeesGridReducer.State>) { }

  ngOnInit(): void {
    this.assignedEmployeesGridData$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesGridData));
    this.assignedEmployeesDataLoading$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesDataLoadingError$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoadingError));
    this.assignedEmployeesTotal$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesTotal));
    this.openActionMenuEmployee$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getOpenActionMenuEmployee));
    this.selectedCompanyEmployeeIds$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesSelectedCompanyEmployeeIds));
    this.selectAllState$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getSelectAllState));
    this.selectedCompanyEmployeeIdsSubscription = this.selectedCompanyEmployeeIds$.subscribe(ids => this.selectedCompanyEmployeeIds = ids);
    this.listAreaColumns$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getGridColumns));
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy(): void {
    this.selectedCompanyEmployeeIdsSubscription.unsubscribe();
    window.removeEventListener('scroll', this.onScroll, true);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.TotalRewardsAssignedEmployees));
    this.store.dispatch(new fromAssignedEmployeesGridActions.Reset());
  }

  handleCheckboxClick(employee: TotalRewardAssignedEmployee) {
    this.store.dispatch(new fromAssignedEmployeesGridActions.ToggleEmployeeSelection({ CompanyEmployeeId: employee.CompanyEmployeeId }));
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    // emit up to the parent here since we need the filters in that component's state to be passed in the load call
    this.gridStateChange.emit(state);
  }

  showGridTooltip(e: any): void {
    if ((e.target.offsetWidth < e.target.scrollWidth) && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  onActionMenuUnassignClick(): void {
    this.store.dispatch(new fromAssignedEmployeesPageActions.OpenSingleEmployeeUnassignModal());
  }

  handleSelectedRowAction(dropdown: NgbDropdown, employee: TotalRewardAssignedEmployee): void {
    this.selectedDropdown = dropdown;
    this.selectedCompanyEmployeeId = employee.CompanyEmployeeId;
    this.store.dispatch(new fromAssignedEmployeesGridActions.OpenActionMenu(employee));
  }

  handleEditClicked(): void {
    this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
      companyEmployeeId: this.selectedCompanyEmployeeId
    }));
  }

  onScroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  onSelectAllChange() {
    this.store.dispatch(new fromAssignedEmployeesGridActions.SelectAll());
  }

  openAssignModal(): void {
    this.openAssignModalClicked.emit();
  }
}
